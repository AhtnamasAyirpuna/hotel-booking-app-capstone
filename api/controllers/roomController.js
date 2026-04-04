import { db } from "../firebaseAdmin.js";
import admin from "firebase-admin";

export const searchRooms = async (req, res) => {
    try {
        const { city, checkInDate, checkOutDate } = req.query;

        if (!checkInDate || !checkOutDate) {
            return res.status(400).json({
                message: "checkInDate and checkOutDate required"
            });
        }

        const checkIn = admin.firestore.Timestamp.fromDate(new Date(`${checkInDate}T00:00:00`));
        const checkOut = admin.firestore.Timestamp.fromDate(new Date(`${checkOutDate}T00:00:00`));

        if (checkIn >= checkOut) {
            return res.status(400).json({
                message: "Invalid date range"
            });
        }

        //get rooms
        let roomsQuery = db.collection("rooms");

        if (city && city != "all") {
            roomsQuery = roomsQuery.where("hotel.city", "==", city);
        }

        const roomSnap = await roomsQuery.get();

        if (roomSnap.empty) {
            return res.json([]);
        }

        const rooms = roomSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        //overlapping bookings
        const bookingSnap = await db
            .collection("bookings")
            .where("checkInDate", "<", checkOut)
            .where("checkOutDate", ">", checkIn)
            .get();

        const bookedRoomIds = new Set(
            bookingSnap.docs.map(doc => doc.data().room.id)
        );

        //filter available rooms
        const availableRooms = rooms.filter(
            room => !bookedRoomIds.has(room.id)
        );

        res.json(availableRooms);

    } catch (error) {
        console.error("Room error:", error);
        res.status(500).json({
            message: "Failed to search rooms"
        });
    }
};

export const searchRoom = async (req, res) => {
    try {
        const { id } = req.params;

        const docRef = db.collection("rooms").doc(id);
        const docSnap = await docRef.get();

        if (!docSnap.exists) {
            return res.status(404).json({ message: "Room not found" })
        }

        res.json({
            id: docSnap.id,
            ...docSnap.data(),
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch room" });
    }
};

export const checkRoomAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const { checkInDate, checkOutDate } = req.query;

        if (!checkInDate || !checkOutDate) {
            return res.status(400).json({
                message: "checkInDate and checkOutDate required"
            });
        }

        const checkIn = admin.firestore.Timestamp.fromDate(new Date(`${checkInDate}T00:00:00`));

        const checkOut = admin.firestore.Timestamp.fromDate(new Date(`${checkOutDate}T00:00:00`));

        const bookingSnap = await db
            .collection("bookings")
            .where("room", "==", db.collection("rooms").doc(id))
            .where("checkInDate", "<", checkOut)
            .where("checkOutDate", ">", checkIn)
            .get();

        if (!bookingSnap.empty) {
            return res.json({ available: false });
        }

        res.json({ available: true });

    } catch (error) {
        console.error("Availability error:", error);
        res.status(500).json({
            message: "Failed to check availability"
        });
    }
};