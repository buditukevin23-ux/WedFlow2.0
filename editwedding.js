import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";



const groomName = document.getElementById("groomName");
const brideName = document.getElementById("brideName");
const weddingDate = document.getElementById("weddingDate");
const weddingPlace = document.getElementById("weddingPlace");

const saveBtn = document.getElementById("saveWeddingBtn");
const message = document.getElementById("message");



let weddingId = "";





// Charger le mariage


onAuthStateChanged(auth, async (user)=>{


    if(!user){

        message.innerHTML =
        "❌ Vous devez être connecté";

        return;

    }



    const weddingQuery = query(

        collection(db,"weddings"),

        where("userId","==",user.uid)

    );



    const weddingSnapshot = await getDocs(weddingQuery);



    if(weddingSnapshot.empty){


        message.innerHTML =
        "❌ Aucun mariage trouvé";


        return;

    }



    weddingSnapshot.forEach((weddingDoc)=>{


        weddingId = weddingDoc.id;



        const wedding = weddingDoc.data();



        groomName.value =
        wedding.groomName || "";



        brideName.value =
        wedding.brideName || "";



        weddingDate.value =
        wedding.date || "";



        weddingPlace.value =
        wedding.place || "";



    });



});








// Enregistrer modification


saveBtn.addEventListener("click", async ()=>{


    if(!weddingId){

        message.innerHTML =
        "❌ Aucun mariage sélectionné";

        return;

    }




    try{


        await updateDoc(

            doc(db,"weddings",weddingId),

            {

                groomName: groomName.value,

                brideName: brideName.value,

                date: weddingDate.value,

                place: weddingPlace.value

            }

        );



        message.innerHTML =
        "✅ Mariage modifié avec succès";



    }catch(error){


        console.log(error);


        message.innerHTML =
        "❌ Erreur : " + error.message;


    }


});