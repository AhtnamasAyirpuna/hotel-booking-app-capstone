import express from "express";
import { searchRoom, searchRooms, checkRoomAvailability } from "../controllers/roomController.js";

const router = express.Router();

router.get("/", searchRooms);
router.get("/search", searchRooms);
router.get("/check/:id", checkRoomAvailability);
router.get("/:id", searchRoom);

export default router;