import { auth } from "./firebase-config.js";

import {
signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


const loginForm = document.getElementById("loginForm");

const error = document.getElementById("error");


loginForm.addEventListener("submit", async(e)=>{

e.preventDefault();


const email =
document.getElementById("email").value;


const password =
document.getElementById("password").value;


try{

await signInWithEmailAndPassword(
auth,
email,
password
);


// Directly open dashboard

window.location.href="dashboard.html";


}

catch(err){

error.innerHTML = err.message;

}


});