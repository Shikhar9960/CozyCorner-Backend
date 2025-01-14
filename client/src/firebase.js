// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "cozy-corners-4dfeb.firebaseapp.com",
    projectId: "cozy-corners-4dfeb",
    storageBucket: "cozy-corners-4dfeb.firebasestorage.app",
    messagingSenderId: "82138646913",
    appId: "1:82138646913:web:e73486a154aaf1c6424080"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


