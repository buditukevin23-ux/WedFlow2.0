import { db } from "./firebase.js";
import { showToast } from "./utils.js";

import {
    doc,
    getDoc,
    collection,
    query,
    where,
    getDocs,
    updateDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";



// Récupérer l'identifiant du mariage après le code réception

const weddingId = localStorage.getItem("receptionWeddingId");


const weddingInfo = document.getElementById("weddingInfo");



if(!weddingId){

    weddingInfo.innerHTML = "Aucun mariage trouvé";

    showToast("Aucun mariage trouvé","error");

} else {


    const weddingRef = doc(db, "weddings", weddingId);


    const weddingSnap = await getDoc(weddingRef);



    if(weddingSnap.exists()){


        const wedding = weddingSnap.data();


        weddingInfo.innerHTML = `

        <h2>
        <i class="fi fi-rr-rings-wedding"></i>
        ${wedding.groomName} & ${wedding.brideName}
        </h2>

        <p>
        Date : ${wedding.date}
        </p>

        <p>
        Lieu : ${wedding.place}
        </p>

        `;


    }

}



// Recherche invité

const searchBtn = document.getElementById("searchGuestBtn");

const suggestions = document.getElementById("suggestions");

const guestSearch = document.getElementById("guestSearch");


guestSearch.addEventListener("input", async function () {

    const text = this.value.trim().toLowerCase();


    if(text === ""){

        suggestions.style.display = "none";
        suggestions.innerHTML = "";

        return;

    }


    try {


        const guestsQuery = query(
            collection(db,"guests"),
            where("weddingId","==",weddingId)
        );


        const guestsSnapshot = await getDocs(guestsQuery);


        suggestions.innerHTML = "";

        let found = false;


        guestsSnapshot.forEach((guestDoc)=>{


            const guest = guestDoc.data();


            if(
                guest.name &&
                guest.name.toLowerCase().includes(text)
            ){


                found = true;


                suggestions.innerHTML += `

                <div class="suggestion-item"
                onclick="selectGuest('${guest.name}')">

                    <strong>
                    <i class="fi fi-rr-user"></i>
                    ${guest.name}
                    </strong>

                    <span>
                    ${guest.table || "Sans table"}
                    </span>

                </div>

                `;

            }


        });


        suggestions.style.display =
        found ? "block" : "none";


    } catch(error){

        console.log(error);

    }


});

searchBtn.addEventListener("click", async ()=>{


    const name = document.getElementById("guestSearch").value.trim();


    const result = document.getElementById("guestResult");


    if(name === ""){

        result.innerHTML = "Écris un nom";

        showToast("Écris un nom","error");

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

        result.innerHTML = "Invité introuvable";

        showToast("Invité introuvable","error");

        return;

    }



    snapshot.forEach((guestDoc)=>{

    const guest = guestDoc.data();

    result.innerHTML = `

    <div class="guest-card">

        <h3>
            <i class="fi fi-rr-user"></i>
            ${guest.name}
        </h3>

        <p>
            <strong>
                <i class="fi fi-rr-users"></i>
                Nombre de personnes :
            </strong>
            ${guest.people || 1}
        </p>

        <p>
            <strong>
                <i class="fi fi-rr-table-picnic"></i>
                Table :
            </strong>
            ${guest.table}
        </p>

        <p>
            <strong>
                <i class="fi fi-rr-check"></i>
                Statut :
            </strong>

            ${
                guest.arrived
                ? "Déjà arrivé"
                : "Pas encore arrivé"
            }
        </p>

        ${
            !guest.arrived
            ?
            `
            <button id="arriveBtn">
                <i class="fi fi-rr-check"></i>
                Marquer arrivé
            </button>
            `
            :
            ""
        }

    </div>

    `;

    if(!guest.arrived){

        document
        .getElementById("arriveBtn")
        .addEventListener("click", async ()=>{

            await updateDoc(
                doc(db,"guests",guestDoc.id),
                {
                    arrived:true
                }
            );

            showToast("Invité marqué comme arrivé","success");

            loadStatistics();

            searchBtn.click();

        });

    }

    showToast("Invité trouvé","success");

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
window.selectGuest = function(name){

    document.getElementById("guestSearch").value = name;

    suggestions.style.display = "none";

    searchBtn.click();

};
window.showGuests = async function(){

    const box = document.getElementById("receptionList");

    box.innerHTML = "Chargement des invités...";


    const q = query(
        collection(db,"guests"),
        where("weddingId","==",weddingId)
    );


    const snapshot = await getDocs(q);


    box.innerHTML = `

    <h2>
        <i class="fi fi-rr-users"></i>
        Liste des invités
    </h2>

    `;


    snapshot.forEach((guestDoc)=>{


        const guest = guestDoc.data();


        box.innerHTML += `

        <div class="guest-card">

            <h3>
                <i class="fi fi-rr-user"></i>
                ${guest.name}
            </h3>


            <p>
                <i class="fi fi-rr-users"></i>
                Personnes : ${guest.people || 1}
            </p>


            <p>
                <i class="fi fi-rr-table-picnic"></i>
                Table : ${guest.table || "Non attribuée"}
            </p>


            <p>
                <i class="fi fi-rr-check"></i>
                ${guest.arrived ? "Arrivé" : "Pas encore arrivé"}
            </p>

        </div>

        `;


    });


};



window.showTables = async function(){


    const box = document.getElementById("receptionList");

    box.innerHTML = "Chargement des tables...";


    const q = query(
        collection(db,"tables"),
        where("weddingId","==",weddingId)
    );


    const snapshot = await getDocs(q);


    box.innerHTML = `

    <h2>
        <i class="fi fi-rr-table-picnic"></i>
        Liste des tables
    </h2>

    `;


    snapshot.forEach((tableDoc)=>{


        const table = tableDoc.data();


        box.innerHTML += `

        <div class="table-card">

            <h3>
    <i class="fi fi-rr-chair"></i>
    ${table.name || table.tableName || "Table sans nom"}
</h3>


<p>
    Places :
    ${table.capacity || table.seats || 0}
</p>


        </div>

        `;


    });


};
window.selectGuest = function(name){

    document.getElementById("guestSearch").value = name;

    suggestions.style.display = "none";

    searchBtn.click();

};