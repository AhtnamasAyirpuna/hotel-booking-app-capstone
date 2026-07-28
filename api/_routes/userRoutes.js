//URLs
import express from "express";
import { verifyToken } from "../_middleware/authMiddleware.js";
import { getMyProfile } from "../_controllers/userController.js"
import { createUser } from "../_controllers/userController.js";

const router = express.Router();

//GET /api/users/me
router.get("/me", verifyToken, getMyProfile);

router.post("/", verifyToken, createUser);

export default router;