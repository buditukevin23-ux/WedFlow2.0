import { auth, db } from "./firebase.js";

import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";



const addTableBtn = document.getElementById("addTableBtn");

const message = document.getElementById("message");




addTableBtn.addEventListener("click", async ()=>{


    const tableName =
    document.getElementById("tableName").value.trim();



    const tableSeats =
    document.getElementById("tableSeats").value;



    if(tableName === "" || tableSeats === ""){


        message.innerHTML =
        "❌ Remplissez tous les champs";


        return;

    }





    const user = auth.currentUser;



    if(!user){


        message.innerHTML =
        "❌ Vous devez être connecté";


        return;

    }





    try{


        // Trouver le mariage de l'organisateur


        const weddingQuery = query(

            collection(db,"weddings"),

            where("userId","==",user.uid)

        );



        const weddingSnapshot =
        await getDocs(weddingQuery);




        if(weddingSnapshot.empty){


            message.innerHTML =
            "❌ Aucun mariage trouvé";


            return;

        }





        let weddingId;



        weddingSnapshot.forEach((weddingDoc)=>{


            weddingId = weddingDoc.id;


        });







        // Enregistrer la table dans Firebase


        await addDoc(

            collection(db,"tables"),

            {


                weddingId: weddingId,


                tableName: tableName,


                seats: Number(tableSeats),


                createdAt: serverTimestamp()


            }


        );





        message.innerHTML =
        "✅ Table créée avec succès";



        document.getElementById("tableName").value = "";

        document.getElementById("tableSeats").value = "";





    }catch(error){


        console.log(error);


        message.innerHTML =
        "❌ Erreur : " + error.message;


    }



});