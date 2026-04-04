import { db } from "../firebaseAdmin.js";
import { createBookingModel } from "../models/booking.js";
import { checkAvailability } from "../services/bookingService.js";
import { Timestamp } from "firebase-admin/firestore";

export const createBooking = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { roomId, checkInDate, checkOutDate } = req.body;

        if (!roomId || !checkInDate || !checkOutDate) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const roomSnap = await db.collection("rooms").doc(roomId).get();

        if (!roomSnap.exists) {
            return res.status(404).json({ message: "Room not found" });
        }

        //before booking check availability
        let isAvailable;

        try {
            isAvailable = await checkAvailability(
                roomId,
                checkInDate,
                checkOutDate
            );
        } catch (err) {
            if (err.message === "INVALID_DATE_RANGE") {
                return res.status(400).json({
                    success: false,
                    message: "Invalid booking dates"
                });
            }
            throw err;
        }

        if (!isAvailable) {
            return res.status(409).json({ success: false, message: "Room is not available" });
        }

        const start = new Date(`${checkInDate}T00:00:00`);
        const end = new Date(`${checkOutDate}T00:00:00`);
        const MS_PER_DAY = 1000 * 60 * 60 * 24;
        const nights = Math.ceil((end - start) / MS_PER_DAY);

        const { pricePerNight } = roomSnap.data();
        const totalPrice = nights * pricePerNight;

        const userRef = db.collection("users").doc(userId);
        const roomRef = db.collection("rooms").doc(roomId);

        const bookingData = createBookingModel({
            user: userRef,
            room: roomRef,
            checkInDate: Timestamp.fromDate(new Date(`${checkInDate}T00:00:00`)),
            checkOutDate: Timestamp.fromDate(new Date(`${checkOutDate}T00:00:00`)),
            totalPrice,
        });

        const bookingRef = await db.collection("bookings").add(bookingData);

        res.status(201).json({
            message: "Booking created successfully",
            bookingId: bookingRef.id,
        });

    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Unknown error",
        });
    }
};

export const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.uid;
        const userRef = db.collection("users").doc(userId);

        const bookingSnap = await db
            .collection("bookings")
            .where("user", "==", userRef)
            .get();

        console.log("Bookings found:", bookingSnap.size)

        const bookings = await Promise.all(
            bookingSnap.docs.map(async (doc) => {
                const data = doc.data();

                let roomData = null;

                if (data.room) {
                    const roomDoc = await data.room.get();

                    roomData = roomDoc.exists
                        ? { id: roomDoc.id, ...roomDoc.data() }
                        : null;
                }

                return {
                    id: doc.id,
                    ...data,
                    checkInDate: data.checkInDate?.toDate().toISOString(),
                    checkOutDate: data.checkOutDate?.toDate().toISOString(),
                    room: roomData, // 🔥 populated room
                };
            })
        );

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Failed to fetch bookings"
        });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const userId = req.user.uid;

        const bookingRef = db.collection("bookings").doc(bookingId);
        const bookingSnap = await bookingRef.get();

        //to check if booking exists
        if (!bookingSnap.exists) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const booking = bookingSnap.data();

        //to check if booking belongs to the user
        if (!booking.user || booking.user.id !== userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.json({
            id: bookingSnap.id,
            ...booking,
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "Server error",
        });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { id } = req.params;

        const bookingRef = db.collection("bookings").doc(id);
        const bookingSnap = await bookingRef.get();

        if (!bookingSnap.exists) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const booking = bookingSnap.data();

        //must belong to respective user
        if (!booking.user || booking.user.id !== userId) {
            return res.status(404).json({ message: "Access denied" });
        }

        await bookingRef.delete();

        res.json({ message: "Booking deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error instanceof Error ? error.message : "Server error" })
    }
}

export const checkRoomAvailability = async (req, res) => {
    try {
        const { roomId, checkInDate, checkOutDate } = req.query;

        if (!roomId || !checkInDate || !checkOutDate) {
            return res.status(400).json({
                message: "Missing required fieds"
            });
        }

        let isAvailable;

        try {
            isAvailable = await checkAvailability(
                roomId,
                checkInDate,
                checkOutDate
            );
        } catch (err) {
            if (err.message === "INVALID_DATE_RANGE") {
                return res.status(400).json({
                    success: false,
                    message: "Invalid booking dates"
                });
            }
            throw err;
        }

        res.status(200).json({
            roomId,
            available: isAvailable
        });
    } catch (error) {
        res.status(500).json({
            message: error instanceof Error ? error.message : "server error"
        });
    }
};

export const updateBooking = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { id } = req.params;
        const { checkInDate, checkOutDate } = req.body;

        if (!checkInDate || !checkOutDate) {
            return res.status(400).json({
                message: "Both check-in and check-out dates are required"
            });
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (checkOut <= checkIn) {
            return res.status(400).json({
                message: "Invalid date range. Check-out must be after check-in"
            });
        }

        const bookingRef = db.collection("bookings").doc(id);
        const bookingSnap = await bookingRef.get();

        if (!bookingSnap.exists) {
            return res.status(404).json({ message: "Booking not found" });
        }

        const booking = bookingSnap.data();

        if (!booking.user || booking.user.id !== userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        const available = await checkAvailability(
            booking.room.id,
            checkInDate,
            checkOutDate,
            id
        );

        if (!available) {
            return res.status(404).json({ message: "Room not available" });
        }

        await bookingRef.update({
            checkInDate: Timestamp.fromDate(new Date(`${checkInDate}T00:00:00`)),
            checkOutDate: Timestamp.fromDate(new Date(`${checkOutDate}T00:00:00`)),
            updatedAt: Timestamp.now()
        });

        res.json({ message: "Booking updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update booking" })
    }
}





