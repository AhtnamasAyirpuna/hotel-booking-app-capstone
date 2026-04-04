//Firestore logic
import { db } from "../firebaseAdmin.js";


// GET /api/users/me
export const getMyProfile = async (req, res) => {
    try {
        const uid = req.user.uid;

        const userRef = db.collection("users").doc(uid);
        const userSnap = await userRef.get();

        if (!userSnap.exists) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(userSnap.data());
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};