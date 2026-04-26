import express from "express";
import { searchRoom, searchRooms, checkRoomAvailability, getAllRooms } from "../controllers/roomController.js";

const router = express.Router();

//for all rooms
router.get("/", getAllRooms);

//for filtering
router.get("/search", searchRooms);

router.get("/check/:id", checkRoomAvailability);
router.get("/:id", searchRoom);

export default router;