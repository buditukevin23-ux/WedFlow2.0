import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";



const userCount = document.getElementById("userCount");
const accessList = document.getElementById("accessList");



onAuthStateChanged(auth, async (user)=>{


    if(!user){


        accessList.innerHTML =
        "❌ Vous devez être connecté";


        return;

    }




    try{


        // Trouver le mariage de l'organisateur


        const weddingQuery = query(

            collection(db,"weddings"),

            where("userId","==",user.uid)

        );



        const weddingSnapshot = await getDocs(weddingQuery);



        if(weddingSnapshot.empty){


            accessList.innerHTML =
            "❌ Aucun mariage trouvé";


            return;


        }



        let weddingId;



        weddingSnapshot.forEach((weddingDoc)=>{


            weddingId = weddingDoc.id;


        });






        // Chercher les utilisateurs ayant accès


        const accessQuery = query(

            collection(db,"receptionUsers"),

            where("weddingId","==",weddingId)

        );



        const accessSnapshot = await getDocs(accessQuery);





        userCount.innerHTML =
        accessSnapshot.size;





        if(accessSnapshot.empty){


            accessList.innerHTML =
            "Aucun utilisateur utilise votre code pour le moment";


            return;


        }





        accessList.innerHTML = "";





        accessSnapshot.forEach((accessDoc)=>{


            const access = accessDoc.data();



            accessList.innerHTML += `


            <div class="guest-card">


            <h3>
            👤 ${access.name || "Utilisateur"}
            </h3>


            <p>
            Statut : ${access.status || "Actif"}
            </p>



            <button>
            🚫 Bloquer
            </button>



            </div>


            <hr>


            `;



        });




    }catch(error){


        console.log(error);


        accessList.innerHTML =
        "❌ Erreur : " + error.message;


    }



});