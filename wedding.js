import { auth, db } from "./firebase.js";

import {
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


function generateReceptionCode(){

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    let code = "WED-";

    for(let i = 0; i < 6; i++){

        code += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );

    }

    return code;

}


const form = document.getElementById("weddingForm");


form.addEventListener("submit", async (e) => {

    e.preventDefault();


    const groomName = document.getElementById("groomName").value;
    const brideName = document.getElementById("brideName").value;
    const weddingDate = document.getElementById("weddingDate").value;
    const weddingPlace = document.getElementById("weddingPlace").value;


    const user = auth.currentUser;


    if (!user) {
        alert("Vous devez être connecté");
        return;
    }


    try {

        const receptionCode = generateReceptionCode();


        await addDoc(collection(db, "weddings"), {

            userId: user.uid,

            groomName: groomName,
            brideName: brideName,
            date: weddingDate,
            place: weddingPlace,

            receptionCode: receptionCode,

            createdAt: serverTimestamp()

        });


        alert(
            "🎉 Mariage enregistré avec succès\n\nCode réception : "
            + receptionCode
        );


        form.reset();


    } catch (error) {

        console.log(error);
        alert("Erreur lors de l'enregistrement");

    }

});