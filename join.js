import { db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";



const joinBtn = document.getElementById("joinBtn");

const message = document.getElementById("message");





joinBtn.addEventListener("click", async ()=>{


    const code =
    document.getElementById("weddingCode").value.trim();



    const name =
    document.getElementById("userName").value.trim();




    if(code === "" || name === ""){


        message.innerHTML =
        "❌ Remplissez tous les champs";


        return;


    }






    try{


        // Chercher le mariage avec le code


        const weddingQuery = query(

            collection(db,"weddings"),

            where("receptionCode","==",code)

        );



        const weddingSnapshot =
        await getDocs(weddingQuery);





        if(weddingSnapshot.empty){


            message.innerHTML =
            "❌ Code de mariage incorrect";


            return;


        }





        let weddingId;



        weddingSnapshot.forEach((weddingDoc)=>{


            weddingId = weddingDoc.id;


        });






        // Enregistrer l'utilisateur de réception


        await addDoc(

            collection(db,"receptionUsers"),

            {

                weddingId:weddingId,

                name:name,

                status:"active",

                joinedAt:serverTimestamp()

            }

        );





        message.innerHTML =
        "✅ Accès accordé";



        document.getElementById("weddingCode").value = "";

        document.getElementById("userName").value = "";





    }catch(error){


        console.log(error);


        message.innerHTML =
        "❌ Erreur : " + error.message;


    }



});