import { db } from "./firebase.js";
import { showToast } from "./utils.js";

import {
    doc,
    getDoc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";



const params = new URLSearchParams(window.location.search);

const tableId = params.get("id");



const nameInput = document.getElementById("tableName");
const seatsInput = document.getElementById("tableSeats");
const saveBtn = document.getElementById("saveTableBtn");
const message = document.getElementById("message");




// Charger la table

async function loadTable(){


    if(!tableId){

        message.innerHTML =
        "Aucune table sélectionnée";

        showToast("Aucune table sélectionnée","error");

        return;

    }



    try{


        const tableRef = doc(db,"tables",tableId);


        const tableSnap = await getDoc(tableRef);



        if(tableSnap.exists()){


            const table = tableSnap.data();



            nameInput.value = table.tableName;

            seatsInput.value = table.seats;



        }else{


            message.innerHTML =
            "Table introuvable";

            showToast("Table introuvable","error");


        }



    }catch(error){


        console.log(error);

        message.innerHTML =
        "Erreur de chargement";

        showToast("Erreur de chargement","error");


    }


}



loadTable();






// Enregistrer modification

saveBtn.addEventListener("click", async ()=>{


    if(!tableId){

        message.innerHTML =
        "Aucune table sélectionnée";

        showToast("Aucune table sélectionnée","error");

        return;

    }



    try{


        await updateDoc(

            doc(db,"tables",tableId),

            {

                tableName: nameInput.value,

                seats: Number(seatsInput.value)

            }

        );



        message.innerHTML =
        "Table modifiée avec succès";


        showToast(
            "Table modifiée avec succès",
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