import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";



const params = new URLSearchParams(window.location.search);

const guestId = params.get("id");



const nameInput = document.getElementById("guestName");
const tableInput = document.getElementById("guestTable");
const saveBtn = document.getElementById("saveGuestBtn");
const message = document.getElementById("message");




// Charger l'invité

async function loadGuest(){


    if(!guestId){

        message.innerHTML =
        "❌ Aucun invité sélectionné";

        return;

    }



    try{


        const guestRef = doc(db, "guests", guestId);


        const guestSnap = await getDoc(guestRef);



        if(guestSnap.exists()){


            const guest = guestSnap.data();


            nameInput.value = guest.name;

            tableInput.value = guest.table || "";



        }else{


            message.innerHTML =
            "❌ Invité introuvable";


        }



    }catch(error){


        console.log(error);

        message.innerHTML =
        "❌ Erreur de chargement";


    }


}



loadGuest();






// Enregistrer les modifications


saveBtn.addEventListener("click", async ()=>{


    if(!guestId){

        message.innerHTML =
        "❌ Aucun invité sélectionné";

        return;

    }



    try{


        await updateDoc(

            doc(db,"guests",guestId),

            {

                name: nameInput.value,

                table: tableInput.value

            }

        );



        message.innerHTML =
        "✅ Invité modifié avec succès";



    }catch(error){


        console.log(error);

        message.innerHTML =
        "❌ Erreur lors de la modification";


    }


});