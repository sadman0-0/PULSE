// Firebase App
import { initializeApp } 
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";


// Firebase Authentication
import { getAuth } 
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


// Firestore Database
import { getFirestore } 
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



// Your Firebase Configuration

const firebaseConfig = {

    apiKey: "AIzaSyAgK_GHrmIFJPhb-bNiEW4YV9lJCcecmDk",

    authDomain: "habit-harvest-1667c.firebaseapp.com",

    projectId: "habit-harvest-1667c",

    storageBucket: "habit-harvest-1667c.firebasestorage.app",

    messagingSenderId: "346187714677",

    appId: "1:346187714677:web:1eecf6e6b2ca3dfbdb283c",

    measurementId: "G-W7X0C2JDZH"

};



// Initialize Firebase

const app = initializeApp(firebaseConfig);



// Export Firebase Authentication

export const auth = getAuth(app);



// Export Firestore Database

export const db = getFirestore(app);