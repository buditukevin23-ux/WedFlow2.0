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



const weddingInfo = document.getElementById("weddingInfo");



onAuthStateChanged(auth, async (user)=>{


    if(!user){


        weddingInfo.innerHTML =
        "❌ Vous devez être connecté";


        return;

    }



    try{


        // Trouver le mariage de l'utilisateur


        const weddingQuery = query(

            collection(db,"weddings"),

            where("userId","==",user.uid)

        );



        const weddingSnapshot = await getDocs(weddingQuery);



        if(weddingSnapshot.empty){


            weddingInfo.innerHTML =
            "Aucun mariage créé";


            return;


        }



        let weddingId;



        weddingSnapshot.forEach((weddingDoc)=>{


            const wedding = weddingDoc.data();


            weddingId = weddingDoc.id;



            weddingInfo.innerHTML = `

            <h2>
            💍 ${wedding.groomName} & ${wedding.brideName}
            </h2>


            <p>
            📅 ${wedding.date}
            </p>


            <p>
            📍 ${wedding.place}
            </p>

            `;



            document.getElementById("receptionCode").innerHTML =
            wedding.receptionCode;


        });






        // Compter les invités


        const guestsQuery = query(

            collection(db,"guests"),

            where("weddingId","==",weddingId)

        );



        const guestsSnapshot = await getDocs(guestsQuery);



        let guestCount = 0;

        let arrivedCount = 0;



        guestsSnapshot.forEach((guestDoc)=>{


            const guest = guestDoc.data();


            guestCount++;



            if(guest.arrived === true){

                arrivedCount++;

            }


        });




        document.getElementById("guestCount").innerHTML =
        guestCount;



        document.getElementById("arrivedCount").innerHTML =
        arrivedCount;






        // Compter les tables


        const tablesQuery = query(

            collection(db,"tables"),

            where("weddingId","==",weddingId)

        );



        const tablesSnapshot = await getDocs(tablesQuery);



        document.getElementById("tableCount").innerHTML =
        tablesSnapshot.size;



    }catch(error){


        console.log(error);


        weddingInfo.innerHTML =
        "❌ Erreur : " + error.message;


    }



});