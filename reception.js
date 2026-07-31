import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


// Récupérer l'identifiant du mariage après le code réception

const weddingId = localStorage.getItem("receptionWeddingId");


const weddingInfo = document.getElementById("weddingInfo");


if(!weddingId){

    weddingInfo.innerHTML = "❌ Aucun mariage trouvé";

} else {


    const weddingRef = doc(db, "weddings", weddingId);


    const weddingSnap = await getDoc(weddingRef);



    if(weddingSnap.exists()){


        const wedding = weddingSnap.data();


        weddingInfo.innerHTML = `

        <h2>💍 ${wedding.groomName} & ${wedding.brideName}</h2>

        <p>📅 Date : ${wedding.date}</p>

        <p>📍 Lieu : ${wedding.place}</p>

        `;


    }

}



// Recherche invité


const searchBtn = document.getElementById("searchGuestBtn");


searchBtn.addEventListener("click", async ()=>{


    const name = document.getElementById("guestSearch").value.trim();


    const result = document.getElementById("guestResult");


    if(name === ""){

        result.innerHTML = "Écris un nom";

        return;

    }



    const guestsRef = collection(db, "guests");


    const q = query(
        guestsRef,
        where("name","==",name),
        where("weddingId","==",weddingId)
    );



    const snapshot = await getDocs(q);



    if(snapshot.empty){

        result.innerHTML = "❌ Invité introuvable";

        return;

    }



    snapshot.forEach((guestDoc)=>{


        const guest = guestDoc.data();


        result.innerHTML = `

        <h3>✅ Invité trouvé</h3>

        <p>Nom : ${guest.name}</p>

        <p>Table : ${guest.table}</p>

        `;


    });


});
async function loadStatistics(){


    const guestsQuery = query(
        collection(db,"guests"),
        where("weddingId","==",weddingId)
    );


    const guestsSnapshot = await getDocs(guestsQuery);


    let total = 0;
    let arrived = 0;
    let tables = [];


    guestsSnapshot.forEach((guestDoc)=>{

        const guest = guestDoc.data();

        total++;


        if(guest.arrived === true){

            arrived++;

        }


        if(guest.table && !tables.includes(guest.table)){

            tables.push(guest.table);

        }

    });



    document.getElementById("totalGuests").innerHTML = total;

    document.getElementById("arrivedGuests").innerHTML = arrived;

    document.getElementById("remainingGuests").innerHTML = total - arrived;


    document.getElementById("totalTables").innerHTML = tables.length;

    document.getElementById("occupiedTables").innerHTML = tables.length;


}


loadStatistics();