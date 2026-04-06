import "./config/env.js";

import express from "express";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";

const app = express();

//Middleware
app.use(cors()); //Enable Cross-Origin Resource Sharing
app.use(express.json());

app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
});

// Routes
app.use('/api/users', userRoutes)
app.use('/api/bookings', bookingRoutes)
app.use("/api/rooms", roomRoutes)

//test route
app.get("/api/test", (req, res) => {
    res.json({ message: "API is working" });
});

const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

//for vercel
export default function handler(req, res) {
    return app(req, res);
}