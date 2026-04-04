import { db } from "../firebaseAdmin.js";
import admin from "firebase-admin"

export const checkAvailability = async (roomId, checkInDate, checkOutDate) => {
    const checkIn = admin.firestore.Timestamp.fromDate(new Date(`${checkInDate}T00:00:00`));
    const checkOut = admin.firestore.Timestamp.fromDate(new Date(`${checkOutDate}T00:00:00`));

    if (checkIn >= checkOut) {
        throw new Error("Invalid_Date_Range")
    }

    const roomRef = db.collection("rooms").doc(roomId);

    const snapshot = await db
        .collection("bookings")
        .where("room", "==", roomRef)
        .where("checkInDate", "<", checkOut)
        .where("checkOutDate", ">", checkIn)
        .get();

    return snapshot.empty;
};