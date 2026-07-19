//Firestore logic
import pool from "../config/db.js";

// GET /api/users/me
export const getMyProfile = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;

        //take out
        console.log("PROFILE UID:", firebaseUid);

        const result = await pool.query(
            "SELECT * FROM users WHERE firebase_uid = $1",
            [firebaseUid]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error("Get profile error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};

export const createUser = async (req, res) => {
    try {
        const firebaseUid = req.user.uid;

        //take out
        console.log("CREATE USER UID:", firebaseUid);
        //take out

        const { email, profileImage } = req.body;

        const existingUser = await pool.query(
            "SELECT * FROM users WHERE firebase_uid = $1",
            [firebaseUid]
        );

        if (existingUser.rows.length > 0) {
            return res.status(200).json({
                message: "User already exists",
            });
        }

        const newUser = await pool.query(
            `INSERT INTO users 
            (firebase_uid, email, profile_image)
            VALUES ($1, $2, $3)
            RETURNING *`,
            [firebaseUid, email, profileImage]
        );

        res.status(201).json(newUser.rows[0]);

    } catch (error) {
        console.error("Create user error:", error);

        res.status(500).json({
            message: "Server error",
        });
    }
};