import { db } from "./firebase.js";
import { showToast } from "./utils.js";

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
        "Aucun invité sélectionné";

        showToast("Aucun invité sélectionné","error");

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
            "Invité introuvable";

            showToast("Invité introuvable","error");


        }



    }catch(error){


        console.log(error);

        message.innerHTML =
        "Erreur de chargement";

        showToast("Erreur de chargement","error");


    }


}



loadGuest();






// Enregistrer les modifications


saveBtn.addEventListener("click", async ()=>{


    if(!guestId){

        message.innerHTML =
        "Aucun invité sélectionné";

        showToast("Aucun invité sélectionné","error");

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
        "Invité modifié avec succès";


        showToast(
            "Invité modifié avec succès",
            "success"
        );



    }catch(error){


        console.log(error);

        message.innerHTML =
        "Erreur lors de la modification";


        showToast(
            "Erreur lors de la modification",
            "error"
        );


    }


});