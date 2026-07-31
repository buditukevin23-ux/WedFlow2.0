import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    doc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


const tableList = document.getElementById("tableList");



onAuthStateChanged(auth, async (user)=>{


    if(!user){

        tableList.innerHTML =
        "❌ Vous devez être connecté";

        return;

    }



    try{


        // Trouver le mariage


        const weddingQuery = query(

            collection(db,"weddings"),

            where("userId","==",user.uid)

        );



        const weddingSnapshot = await getDocs(weddingQuery);



        if(weddingSnapshot.empty){

            tableList.innerHTML =
            "❌ Aucun mariage trouvé";

            return;

        }



        let weddingId;



        weddingSnapshot.forEach((weddingDoc)=>{


            weddingId = weddingDoc.id;


        });






        // Charger les invités


        const guestsQuery = query(

            collection(db,"guests"),

            where("weddingId","==",weddingId)

        );



        const guestsSnapshot = await getDocs(guestsQuery);



        let guests = [];



        guestsSnapshot.forEach((guestDoc)=>{


            guests.push(guestDoc.data());


        });







        // Charger les tables


        const tablesQuery = query(

            collection(db,"tables"),

            where("weddingId","==",weddingId)

        );



        const tablesSnapshot = await getDocs(tablesQuery);



        if(tablesSnapshot.empty){


            tableList.innerHTML =
            "Aucune table créée";


            return;

        }






        tableList.innerHTML = "";





        tablesSnapshot.forEach((tableDoc)=>{


            const table = tableDoc.data();




            // Compter les invités sur cette table


            const occupied = guests
.filter(
    guest => guest.table === table.tableName
)
.reduce(
    (total, guest) => total + Number(guest.people || 1),
    0
);




            const available =
            Number(table.seats) - occupied;





            tableList.innerHTML += `


            <div class="table-card">


            <h3>
            🪑 ${table.tableName}
            </h3>



            <p>
            👥 Capacité : ${table.seats} places
            </p>



            <p>
            ✅ Occupées : ${occupied}
            </p>



            <p>
            🟢 Disponibles : ${available}
            </p>




            <button onclick="editTable('${tableDoc.id}')">
            ✏️ Modifier
            </button>



            <button onclick="deleteTable('${tableDoc.id}')">
            🗑️ Supprimer
            </button>



            </div>


            <hr>


            `;



        });





    }catch(error){


        console.log(error);


        tableList.innerHTML =
        "❌ Erreur : " + error.message;


    }



});






window.editTable = function(id){


    window.location.href =
    "edittable.html?id=" + id;


};






window.deleteTable = async function(id){


    const confirmDelete = confirm(
        "Supprimer cette table ?"
    );



    if(confirmDelete){


        await deleteDoc(

            doc(db,"tables",id)

        );


        alert("Table supprimée ✅");


        location.reload();


    }


};