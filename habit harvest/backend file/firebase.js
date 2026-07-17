// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD8fbFFMMR-qGMv1yLPsD7eKx52qznjhAY",
    authDomain: "habit-harvest-8c801.firebaseapp.com",
    projectId: "habit-harvest-8c801",
    storageBucket: "habit-harvest-8c801.firebasestorage.app",
    messagingSenderId: "389864060939",
    appId: "1:389864060939:web:68c60042930443918a2f0e",
    measurementId: "G-K9P2Y7ZYQP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);