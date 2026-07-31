import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


const accessBtn = document.getElementById("accessBtn");
const message = document.getElementById("message");


accessBtn.addEventListener("click", async () => {


    const code = document.getElementById("receptionCode").value.trim();


    if(code === ""){

        message.innerHTML = "Veuillez entrer un code";
        return;

    }


    message.innerHTML = "Recherche du mariage...";


    try {


        const weddingsRef = collection(db, "weddings");


        const q = query(
            weddingsRef,
            where("receptionCode", "==", code)
        );


        const snapshot = await getDocs(q);



        if(snapshot.empty){

            message.innerHTML = "❌ Code invalide";

            return;

        }



        snapshot.forEach((doc)=>{


            const wedding = doc.data();


            localStorage.setItem(
                "receptionWeddingId",
                doc.id
            );


            message.innerHTML =
            "✅ Accès autorisé<br><br>" +
            wedding.groomName +
            " & " +
            wedding.brideName;


            setTimeout(()=>{

                window.location.href = "reception.html";

            },1500);


        });



    } catch(error){

        console.log(error);

        message.innerHTML = "Erreur de connexion";

    }


});