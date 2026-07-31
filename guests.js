import { auth, db } from "./firebase.js";
import { showToast } from "./utils.js";

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


const guestList = document.getElementById("guestList");


onAuthStateChanged(auth, async (user) => {


    if (!user) {

        guestList.innerHTML = "Vous devez être connecté";

        showToast("Vous devez être connecté", "error");

        return;

    }


    try {


        const weddingQuery = query(
            collection(db, "weddings"),
            where("userId", "==", user.uid)
        );


        const weddingSnapshot = await getDocs(weddingQuery);


        if (weddingSnapshot.empty) {

            guestList.innerHTML = "Aucun mariage trouvé";

            showToast("Aucun mariage trouvé", "error");

            return;

        }


        let weddingId = "";


        weddingSnapshot.forEach((weddingDoc) => {

            weddingId = weddingDoc.id;

        });



        const guestsQuery = query(
            collection(db, "guests"),
            where("weddingId", "==", weddingId)
        );


        const guestsSnapshot = await getDocs(guestsQuery);



        if (guestsSnapshot.empty) {


            guestList.innerHTML =
            "Aucun invité pour le moment";


            return;


        }



        guestList.innerHTML = "";



        guestsSnapshot.forEach((guestDoc) => {


            const guest = guestDoc.data();



            guestList.innerHTML += `

            <div class="guest-card">

                <h3>${guest.name}</h3>

                <p>
                    Table : ${guest.table || "Pas encore attribuée"}
                </p>


                <button onclick="deleteGuest('${guestDoc.id}')">

                    <i class="fi fi-rr-trash"></i>
                    Supprimer

                </button>


                <button onclick="editGuest('${guestDoc.id}')">

                    <i class="fi fi-rr-edit"></i>
                    Modifier

                </button>


            </div>

            `;


        });



    } catch(error) {


        console.log(error);

        guestList.innerHTML =
        "Erreur : " + error.message;

        showToast(error.message, "error");


    }


});



window.deleteGuest = async function(id) {


    const confirmDelete = confirm(
        "Supprimer cet invité ?"
    );


    if(confirmDelete) {


        await deleteDoc(
            doc(db, "guests", id)
        );


        showToast(
            "Invité supprimé avec succès",
            "success"
        );


        location.reload();

    }


};



window.editGuest = function(id){

    window.location.href = "editguest.html?id=" + id;

};