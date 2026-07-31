import { auth, db } from "./firebase.js";
import { showToast } from "./utils.js";

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";



const loginBtn = document.getElementById("loginBtn");



if (loginBtn) {


    loginBtn.addEventListener("click", async () => {


        const email = document.getElementById("email").value;

        const password = document.getElementById("password").value;



        try {


            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );


            showToast(
                "Connexion réussie",
                "success"
            );


            window.location.href = "dashboard.html";



        } catch (error) {


            showToast(
                error.message,
                "error"
            );


        }


    });


}






const registerBtn = document.getElementById("registerBtn");



if (registerBtn) {


    registerBtn.addEventListener("click", async () => {



        const name =
        document.getElementById("name").value;



        const email =
        document.getElementById("email").value;



        const password =
        document.getElementById("password").value;



        try {



            const userCredential =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );



            await setDoc(
                doc(
                    db,
                    "users",
                    userCredential.user.uid
                ),
                {

                    name:name,

                    email:email,

                    role:"organisateur",

                    createdAt:new Date()

                }
            );



            showToast(
                "Compte créé avec succès",
                "success"
            );



            window.location.href = "login.html";



        } catch(error) {



            showToast(
                error.message,
                "error"
            );


        }



    });


}