import pool from "../config/db.js";

export const createBooking = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { roomId, checkInDate, checkOutDate } = req.body;

        if (!roomId || !checkInDate || !checkOutDate) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (checkOut <= checkIn) {
            return res.status(400).json({ message: "invalid date range" });
        }

        const roomResult = await pool.query(
            "SELECT * FROM rooms WHERE id = $1",
            [roomId]
        );

        if (roomResult.rows.length === 0) {
            return res.status(404).json({ message: "Room not found" });
        }

        const room = roomResult.rows[0];

        //before booking check availability
        const bookingCheck = await pool.query(
            `
            SELECT * FROM bookings
            WHERE room_id = $1
            AND check_in_date < $2
            AND check_out_date > $3
            `,
            [roomId, checkOutDate, checkInDate]
        );

        if (bookingCheck.rows.length > 0) {
            return res.status(409).json({ message: "Room not available" });
        }

        const nights = Math.ceil(
            (checkOut - checkIn) / (1000 * 60 * 60 * 24)
        );

        const totalPrice = nights * room.price_per_night;

        const result = await pool.query(
            `
            INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date, total_price)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [userId, roomId, checkInDate, checkOutDate, totalPrice]
        );

        res.status(201).json({
            message: "Booking created successfully",
            booking: result.rows[0],
        });

    } catch (err) {
        console.error(error);
        res.status(500).json({ message: "Failed to create booking" });
    }
};



export const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.uid;

        const result = await pool.query(
            `
            SELECT 
                b.id AS booking_id,
                b.check_in_date,
                b.check_out_date,
                b.total_price,
                r.id AS room_id,
                r.address,
                r.image,
                r.hotel
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            WHERE b.user_id = $1
            ORDER BY b.created_at DESC
            `,
            [userId]
        );

        const bookings = result.rows.map(row => ({
            id: row.booking_id,

            checkInDate: row.check_in_date,
            checkOutDate: row.check_out_date,
            totalPrice: row.total_price,

            room: {
                id: row.room_id,
                address: row.address,
                image: row.image,
                amenities: row.amenities,
                pricePerNight: row.price_per_night,
                hotel: row.hotel
            }
        }))

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch bookings" });
    }
};

export const getBookingById = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const userId = req.user.uid;

        const result = await pool.query(
            `
            SELECT b.*, r.*
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            WHERE b.id = $1 AND b.user_id = $2
            `,
            [bookingId, userId]
        );

        if (result.rows.length === 0) {
            return res.status(500).json({ message: "Booking not found" });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch booking" });
    }
};

export const deleteBooking = async (req, res) => {
    try {
        const userId = req.user.uid;
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM bookings
            WHERE id = $1 AND user_id = $2
            RETURNING *
            `,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Booking not found or unauthorized" })
        }

        res.json({ message: "Booking deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to delte booking" });
    }
};

export const checkRoomAvailability = async (req, res) => {
    try {
        const { roomId, checkInDate, checkOutDate } = req.query;

        if (!roomId || !checkInDate || !checkOutDate) {
            return res.status(400).json({
                message: "Missing required fieds"
            });
        }

        if (new Date(checkOutDate) <= new Date(checkInDate)) {
            return res.status(400).json({
                message: "Invalid date range"
            });
        }

        const result = await pool.query(
            `
            SELECT * FROM bookings
            WHERE room_id = $1
            AND check_in_date < $2 
            AND check_out_date > $3    
            `,
            [roomId, checkOutDate, checkInDate]
        );

        res.json({
            roomId,
            available: result.rows.length === 0
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to check availability" });
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

        const bookingResult = await pool.query(
            "SELECT * FROM bookings WHERE id = $1 AND user_id = $2",
            [id, userId]
        );

        if (bookingResult.rows.length === 0) {
            return res.status(404).json({ message: "Booking not found or unauthorized" });
        }

        const booking = bookingResult.rows[0];

        const conflictCheck = await pool.query(
            `
            SELECT * FROM bookings
            WHERE room_id = $1
            AND id != $2
            AND check_in_date < $3
            AND check_out_date > $4
            `,
            [booking.room_id, id, checkOutDate, checkInDate]
        );

        if (conflictCheck.rows.length > 0) {
            return res.status(409).json({ message: "Room not available" });
        }

        const roomResult = await pool.query(
            "SELECT price_per_night FROM rooms WHERE id = $1",
            [booking.room_id]
        );

        const room = roomResult.rows[0];

        if (roomResult.rows.length === 0) {
            return res.status(404).json({ message: "Room not found" });
        }

        const nights = Math.ceil(
            (checkOut - checkIn) / (1000 * 60 * 60 * 24)
        );

        const totalPrice = nights * room.price_per_night;

        await pool.query(
            `
            UPDATE bookings
            SET check_in_date = $1,
                check_out_date = $2,
                total_price = $3
            WHERE id = $4      
            `,
            [checkInDate, checkOutDate, totalPrice, id]
        );

        res.json({ message: "Booking updated successfully", totalPrice });

    } catch (error) {
        res.status(500).json({ message: "Failed to update booking" })
    }
}





