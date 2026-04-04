import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createBooking, getMyBookings, getBookingById, deleteBooking, checkRoomAvailability, updateBooking } from "../controllers/bookingController.js";

const router = express.Router();

//public - check availability
router.get("/availability", checkRoomAvailability);

//POST /api/bookings
router.post("/", verifyToken, createBooking);

//GET my bookings
router.get("/my", verifyToken, getMyBookings);

//GET /api/bookings/:id
router.get("/:id", verifyToken, getBookingById);


router.put("/:id", verifyToken, updateBooking);

//DELETE booking by id
router.delete("/:id", verifyToken, deleteBooking);


export default router;