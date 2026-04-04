import admin from "firebase-admin";

//to create booking objects consistently (check again)
export const createBookingModel = ({
    user,
    room,
    checkInDate,
    checkOutDate,
    totalPrice
}) => {
    return {
        user,
        room,
        checkInDate,
        checkOutDate,
        totalPrice,
        status: "pending",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };
}