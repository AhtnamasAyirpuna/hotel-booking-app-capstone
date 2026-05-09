import pool from "../config/db.js";
import { geocodeAddress } from "../utils/geocodeAddress.js";

const updateRooms = async () => {
    try {
        const rooms = await pool.query(
            "SELECT id, address FROM rooms"
        );

        for (const room of rooms.rows) {
            console.log(`Geocoding: ${room.address}`);

            const coords = await geocodeAddress(room.address);

            if (!coords) {
                console.log(`Failed: ${room.address}`);
                continue;
            }

            await pool.query(
                `
                UPDATE rooms
                SET latitude = $1,
                    longitude = $2
                WHERE id = $3
                `,
                [coords.latitude, coords.longitude, room.id]
            );

            console.log(`Updated room ${room.id}`);
        }

        console.log("Finished updating coordinates");
        process.exit();

    } catch (error) {
        console.error("Script error:", error);
        process.exit(1);
    }
};

updateRooms();