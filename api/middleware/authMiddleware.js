import admin from "firebase-admin";

export const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({ message: "No token provided" })
        }

        const token = authHeader.split(" ")[1];

        const decodedToken = await admin.auth().verifyIdToken(token);

        req.user = decodedToken;
        console.log("AUTH HEADER:", req.headers.authorization);

        next();
    } catch (error) {
        console.error("Auth error:", error.message);
        res.status(401).json({ message: "Unauthorized" });
    }
}