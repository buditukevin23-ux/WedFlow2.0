import { auth } from "./firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const userEmail = document.getElementById("userEmail");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, (user) => {

    if (user) {

        userEmail.textContent = user.email;

    } else {

        window.location.href = "login.html";

    }

});

logoutBtn.addEventListener("click", () => {

    signOut(auth).then(() => {

        window.location.href = "login.html";

    });

});