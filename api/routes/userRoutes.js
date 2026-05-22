//URLs
import express from "express";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getMyProfile } from "../controllers/userController.js"
import { createUser } from "../controllers/userController.js";

const router = express.Router();

//GET /api/users/me
router.get("/me", verifyToken, getMyProfile);

router.post("/", verifyToken, createUser);

export default router;