import { auth, db } from "./firebase-config.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



// Check user login

onAuthStateChanged(auth, async (user) => {


    if (user) {


        const userRef = doc(db, "users", user.uid);


        const userSnap = await getDoc(userRef);



        if (userSnap.exists()) {


            const userData = userSnap.data();



            // Username

            document.querySelector("[data-hh-username]").innerHTML =
                userData.username;



            // Coins

            document.querySelector("[data-hh-coins]").innerHTML =
                userData.coins;



            // Pet Level

            document.querySelector("[data-hh-pet-level]").innerHTML =
                "Level " + userData.level;



            // Pet XP

            document.querySelector("[data-hh-pet-xp]").innerHTML =
                userData.xp + " XP";



            // Pet Health

            const healthElement =
                document.querySelector(".status-metric.h");


            if(healthElement){

                healthElement.innerHTML =
                `<i class="fa-solid fa-heart"></i> Health: ${userData.puppy.health}%`;

            }




            // Pet Happiness

            const happinessElement =
                document.querySelector(".status-metric.p");


            if(happinessElement){

                happinessElement.innerHTML =
                `<i class="fa-solid fa-face-smile"></i> Happiness: ${userData.puppy.happiness}%`;

            }




            // Pet Energy

            const energyElement =
                document.querySelector(".diorama-badge.right strong");


            if(energyElement){

                energyElement.innerHTML =
                `${userData.puppy.energy}% ⚡`;

            }



            // Update progress bar

            const progress =
                document.querySelector("[data-hh-pet-progress]");


            if(progress){

                let value = userData.xp;

                if(value > 100){
                    value = 100;
                }


                progress.style.width = value + "%";

            }



        }


    }

    else {


        // If user is not logged in

        window.location.href = "login.html";


    }


});




// Logout button

const logoutBtn =
document.querySelector(".auth-user-chip button");


if(logoutBtn){


    logoutBtn.addEventListener("click",()=>{


        signOut(auth)
        .then(()=>{


            window.location.href="login.html";


        });


    });


}