import { auth, db } from "./firebase-config.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const signupForm = document.getElementById("signupForm");


signupForm.addEventListener("submit", async (e) => {

    e.preventDefault();


    const username = document.getElementById("username").value;

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;


    try {

        // Create account in Firebase Authentication

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );


        const user = userCredential.user;


        // Store user information in Firestore

        await setDoc(
            doc(db, "users", user.uid),
            {

                username: username,

                email: email,

                coins: 0,

                xp: 0,

                level: 1,

                puppy: {

                    health: 100,

                    happiness: 100,

                    energy: 100

                },

                createdAt: new Date()

            }
        );


        // Automatically go to login page

        window.location.href = "login.html";


    } catch (error) {


        document.getElementById("error").innerHTML = error.message;


    }

});