import express from "express";
import { searchRoom, searchRooms, checkRoomAvailability } from "../controllers/roomController.js";
import { db } from "../firebaseAdmin.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("rooms").get();

    if (snapshot.empty) {
      return res.json([]);
    }

    const rooms = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(rooms);
  } catch (error) {
    console.error("Fetch rooms error:", error);
    res.status(500).json({ message: "Failed to fetch rooms" });
  }
});

router.get("/search", searchRooms);
router.get("/check/:id", checkRoomAvailability);
router.get("/:id", searchRoom);


export default router;