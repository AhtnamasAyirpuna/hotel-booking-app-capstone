// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDX_gEgoD8pjlSYTRl-fWkV7Mi0mOgU1As",
    authDomain: "hotel-booking-capstone-46a56.firebaseapp.com",
    projectId: "hotel-booking-capstone-46a56",
    storageBucket: "hotel-booking-capstone-46a56.firebasestorage.app",
    messagingSenderId: "986420940028",
    appId: "1:986420940028:web:b6eab30900dae5c8f41b79"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);