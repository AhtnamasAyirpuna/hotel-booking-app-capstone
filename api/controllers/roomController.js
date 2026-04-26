import pool from "../config/db.js";

export const getAllRooms = async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM rooms");
        res.json(result.rows);
    } catch (error) {
        console.error("Fetch rooms error:", error);
        res.status(500).json({ message: "Failed to fetch rooms" });
    }
};

export const searchRooms = async (req, res) => {
    try {
        const { city, checkInDate, checkOutDate } = req.query;

        if (!checkInDate || !checkOutDate) {
            return res.status(400).json({
                message: "checkInDate and checkOutDate required"
            });
        }

        if (new Date(checkInDate) >= new Date(checkOutDate)) {
            return res.status(400).json({
                message: "Invalid date range"
            });
        }

        //get rooms
        let query = "SELECT * FROM rooms";
        let values = [];

        if (city && city !== "all") {
            query += " WHERE hotel->>'city' = $1";
            values.push(city);
        }

        const roomsResult = await pool.query(query, values);
        const rooms = roomsResult.rows;

        if (rooms.length === 0) return res.json([]);

        //get booked rooms
        const bookingResult = await pool.query(
            `
            SELECT room_id FROM bookings
            WHERE check_in_date < $1
            AND check_out_date > $2
            `,
            [checkOutDate, checkInDate]
        );

        const bookedRoomIds = new Set(
            bookingResult.rows.map(b => b.room_id)
        );

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

        const result = await pool.query(
            "SELECT * FROM rooms WHERE id = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.json(result.rows[0]);

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

        const result = await pool.query(
            `
             SELECT * FROM bookings
             WHERE room_id = $1
             AND check_in_date < $2
             AND check_out_date > $3
            `,
            [id, checkOutDate, checkInDate]
        );

        if (result.rows.length > 0) {
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