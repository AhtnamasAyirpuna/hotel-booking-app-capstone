import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { createBooking, getMyBookings, getBookingById, deleteBooking, checkRoomAvailability, updateBooking } from "../controllers/bookingController.js";

const router = express.Router();

//public - check availability
router.get("/availability", checkRoomAvailability);

//GET my bookings
router.get("/my", verifyToken, getMyBookings);

//GET /api/bookings/:id
router.get("/:id", verifyToken, getBookingById);

//POST /api/bookings
router.post("/", verifyToken, createBooking);

router.put("/:id", verifyToken, updateBooking);

router.delete("/:id", verifyToken, deleteBooking);
router.delete("/test", (req, res) => {
    res.send("DELETE WORKS");
});

export default router;