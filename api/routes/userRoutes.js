//URLs
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getMyProfile } from "../controllers/userController.js"

const router = express.Router();

//GET /api/users/me
router.get("/me", verifyToken, getMyProfile);

export default router;