import express from "express"
// import "dotenv/config";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";


const app = express()

//temporary
app.get("/api/test", (req, res) => {
    res.json({ message: "API is working" });
});

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


export default function handler(req, res) {
    return app(req, res);
}