import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


const guestTable = document.getElementById("guestTable");
const addGuestBtn = document.getElementById("addGuestBtn");
const message = document.getElementById("message");


let weddingId = "";




// Charger les tables avec places disponibles

async function loadTables(){


    const tablesQuery = query(

        collection(db,"tables"),

        where("weddingId","==",weddingId)

    );



    const tablesSnapshot = await getDocs(tablesQuery);




    const guestsQuery = query(

        collection(db,"guests"),

        where("weddingId","==",weddingId)

    );



    const guestsSnapshot = await getDocs(guestsQuery);



    let guests = [];



    guestsSnapshot.forEach((guestDoc)=>{


        guests.push(guestDoc.data());


    });






    tablesSnapshot.forEach((tableDoc)=>{


        const table = tableDoc.data();



        const occupied = guests.filter(

            guest => guest.table === table.tableName

        ).length;



        const available =
        Number(table.seats) - occupied;



        guestTable.innerHTML += `


        <option 
        value="${table.tableName}"
        ${available <= 0 ? "disabled" : ""}
        >

          ${table.tableName} 
        (${available} place(s) disponible(s))

        </option>


        `;



    });



}







onAuthStateChanged(auth, async (user)=>{


    if(!user){


        message.innerHTML =
        "Vous devez être connecté";


        return;


    }



    const weddingQuery = query(

        collection(db,"weddings"),

        where("userId","==",user.uid)

    );



    const weddingSnapshot =
    await getDocs(weddingQuery);




    if(weddingSnapshot.empty){


        message.innerHTML =
        "Aucun mariage trouvé";


        return;


    }



    weddingSnapshot.forEach((weddingDoc)=>{


        weddingId = weddingDoc.id;


    });



    await loadTables();



});









// Ajouter invité


addGuestBtn.addEventListener("click", async ()=>{


    const name =
    document.getElementById("guestName").value.trim();



    const table =
    guestTable.value;


const people =
Number(document.getElementById("guestNumber").value);

    if(name === ""){


        message.innerHTML =
        "❌ Entrez le nom de l'invité";


        return;


    }



    if(table === ""){


        message.innerHTML =
        "❌ Choisissez une table";


        return;


    }




    await addDoc(

        collection(db,"guests"),

        {


name:name,

table:table,

people:people,

weddingId:weddingId,

arrived:false,

            createdAt:serverTimestamp()


        }

    );




    message.innerHTML =
    "✅ Invité ajouté avec succès";



    document.getElementById("guestName").value = "";



});