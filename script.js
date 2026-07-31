import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
signOut
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";


let editingTableId = "";


console.log("Firebase connecté !");


// ===============================
// MESSAGE
// ===============================

function showMessage(message){

let bar = document.getElementById("snackbar");


if(!bar){

bar = document.createElement("div");

bar.id = "snackbar";

bar.className = "snackbar";

document.body.appendChild(bar);

}


bar.innerHTML = message;

bar.classList.add("show");


setTimeout(()=>{

bar.classList.remove("show");

},2500);

}



// ===============================
// CREATION COMPTE
// ===============================


async function registerUser(){

let name = document.getElementById("userName").value;
let phone = document.getElementById("userPhone").value;
let email = document.getElementById("userEmail").value;
let password = document.getElementById("userPassword").value;


if(!name || !phone || !email || !password){

alert("Remplis tous les champs.");

return;

}


try{


let userCredential = await createUserWithEmailAndPassword(
auth,
email,
password
);



await addDoc(collection(db,"users"),{

name:name,
phone:phone,
email:email,
uid:userCredential.user.uid

});



alert("Compte créé avec succès.");

window.location.href="login.html";


}catch(error){

alert(error.message);

}


}





// ===============================
// CONNEXION
// ===============================


async function loginUser(){


let email = document.getElementById("loginEmail").value;

let password = document.getElementById("loginPassword").value;



if(!email || !password){

alert("Remplis tous les champs.");

return;

}



try{


await signInWithEmailAndPassword(
auth,
email,
password
);



localStorage.setItem("loggedIn","true");


alert("Connexion réussie.");

window.location.href="dashboard.html";



}catch(error){

alert("Email ou mot de passe incorrect.");

}


}





// ===============================
// DECONNEXION
// ===============================


async function logoutUser(){


await signOut(auth);


localStorage.removeItem("loggedIn");


window.location.href="login.html";


}





// ===============================
// CREER UN MARIAGE
// ===============================


async function saveWedding(){


let name =
document.getElementById("weddingName").value;


let date =
document.getElementById("weddingDate").value;


let place =
document.getElementById("weddingPlace").value;



if(!name || !date || !place){

alert("Remplis tous les champs.");

return;

}



await addDoc(collection(db,"weddings"),{

name:name,
date:date,
place:place

});



alert("Mariage enregistré.");

window.location.href="dashboard.html";


}





// ===============================
// AJOUTER INVITE
// ===============================


async function addGuest(){


let name =
document.getElementById("guestName").value;


let number =
document.getElementById("guestNumber").value;


let table =
document.getElementById("tableName").value;



if(!name || !number || !table){

alert("Remplis tous les champs.");

return;

}



await addDoc(collection(db,"guests"),{


name:name,

number:Number(number),

table:table,

arrived:false,

code:"WED-"+Date.now()


});



alert("Invité ajouté.");

window.location.href="guests.html";


}





// ===============================
// AFFICHER INVITES
// ===============================


async function showGuests(){


let list = document.getElementById("guestList");


if(!list) return;



list.innerHTML="";



let snapshot = await getDocs(collection(db,"guests"));



snapshot.forEach((item)=>{


let guest=item.data();



list.innerHTML += `

<div class="guest-card">


<h3>${guest.name}</h3>

<p>Personnes : ${guest.number}</p>

<p>Table : ${guest.table}</p>



<button onclick="generateQR('${item.id}')">

<i class="fi fi-rr-qrcode"></i>

QR Code

</button>



<button onclick="deleteGuest('${item.id}')">

<i class="fi fi-rr-trash"></i>

Supprimer

</button>



<button onclick="editGuest('${item.id}')">

<i class="fi fi-rr-edit"></i>

Modifier

</button>



</div>

`;


});


}





// ===============================
// SUPPRIMER INVITE
// ===============================


async function deleteGuest(id){


await deleteDoc(doc(db,"guests",id));


alert("Invité supprimé.");


showGuests();


}




// ===============================
// MODIFIER INVITE
// ===============================


async function editGuest(id){


let name=prompt("Nom :");

let number=prompt("Nombre de personnes :");

let table=prompt("Table :");



if(!name || !number || !table){

return;

}



await updateDoc(
doc(db,"guests",id),
{

name:name,

number:Number(number),

table:table

}

);



alert("Invité modifié.");


showGuests();


}
// ===============================
// DASHBOARD
// ===============================

async function loadDashboard(){

let guests = [];

let snapshot = await getDocs(collection(db,"guests"));

snapshot.forEach(function(doc){

guests.push(doc.data());

});

let total = 0;
let arrived = 0;

guests.forEach(function(guest){

total += Number(guest.number);

if(guest.arrived){

arrived += Number(guest.number);

}

});

let remaining = total - arrived;

if(document.getElementById("totalGuests")){
document.getElementById("totalGuests").innerHTML = total;
}

if(document.getElementById("arrivedGuests")){
document.getElementById("arrivedGuests").innerHTML = arrived;
}

if(document.getElementById("remainingGuests")){
document.getElementById("remainingGuests").innerHTML = remaining;
}

}



// ===============================
// RECHERCHE RÉCEPTION
// ===============================

async function searchReceptionGuest(){

let input = document.getElementById("searchName");

if(!input) return;

let search = input.value.toLowerCase();

let guests = [];

let snapshot = await getDocs(collection(db,"guests"));

snapshot.forEach(function(doc){

guests.push({

id:doc.id,
...doc.data()

});

});

let guest = guests.find(function(item){

return item.name.toLowerCase().includes(search);

});

let result = document.getElementById("receptionResult");

if(!result) return;

if(guest){

result.innerHTML = `

<div class="guest-card">

<h2>${guest.name}</h2>

<p>Table : ${guest.table}</p>

<p>${guest.number} personne(s)</p>

<button onclick="markReceptionArrived('${guest.id}')">

Marquer arrivé

</button>

</div>

`;

}else{

result.innerHTML = "<p>Aucun invité trouvé.</p>";

}

}



// ===============================
// MARQUER ARRIVÉ
// ===============================

async function markReceptionArrived(id){

await updateDoc(doc(db,"guests",id),{

arrived:true

});

alert("Invité enregistré.");

searchReceptionGuest();

loadDashboard();

}



// ===============================
// SUGGESTIONS
// ===============================

async function showSuggestions(){

let input = document.getElementById("searchName");

if(!input) return;

let text = input.value.toLowerCase();

let box = document.getElementById("suggestions");

if(!box) return;

box.innerHTML = "";

if(text==="") return;

let snapshot = await getDocs(collection(db,"guests"));

snapshot.forEach(function(doc){

let guest = doc.data();

if(guest.name.toLowerCase().includes(text)){

box.innerHTML += `

<p onclick="selectGuest('${guest.name}')">

${guest.name}

</p>

`;

}

});

}



function selectGuest(name){

document.getElementById("searchName").value = name;

document.getElementById("suggestions").innerHTML = "";

searchReceptionGuest();

}



// ===============================
// SCANNER QR
// ===============================

function startScanner(){

let scanner = new Html5QrcodeScanner("scanner",{

fps:10,
qrbox:250

});

scanner.render(async function(decodedText){

let snapshot = await getDocs(collection(db,"guests"));

let guest = null;

snapshot.forEach(function(doc){

let data = doc.data();

if(data.code === decodedText){

guest = {

id:doc.id,
...data

};

}

});

let result = document.getElementById("scanResult");

if(!result){

scanner.clear();

return;

}

if(!guest){

result.innerHTML = "<p>Invitation inconnue.</p>";

scanner.clear();

return;

}

if(!guest.arrived){

await updateDoc(doc(db,"guests",guest.id),{

arrived:true

});

}

result.innerHTML = `

<div class="guest-card">

<h2>${guest.name}</h2>

<p>Table : ${guest.table}</p>

<p>${guest.arrived ? "Déjà arrivé" : "Arrivée enregistrée"}</p>

</div>

`;

loadDashboard();

scanner.clear();

});

}
// ===============================
// AJOUTER UNE TABLE
// ===============================

async function addTable(){

let number = document.getElementById("tableNumber").value;
let name = document.getElementById("tableName").value;
let capacity = document.getElementById("tableCapacity").value;

if(number === "" || name === "" || capacity === ""){

alert("Remplis tous les champs.");
return;

}

await addDoc(collection(db,"tables"),{

number:Number(number),
name:name,
capacity:Number(capacity)

});

alert("Table enregistrée.");

document.getElementById("tableNumber").value="";
document.getElementById("tableName").value="";
document.getElementById("tableCapacity").value="";

showTables();

}



// ===============================
// AFFICHER LES TABLES
// ===============================

async function showTables(){

let container = document.getElementById("tablesList");

if(!container) return;

container.innerHTML = "";

let snapshot = await getDocs(collection(db,"tables"));

snapshot.forEach(function(item){

let table = item.data();

container.innerHTML += `

<div class="table-card">

<h2>
<i class="fi fi-rr-restaurant"></i>
Table ${table.number} - ${table.name}
</h2>

<p>
<i class="fi fi-rr-users"></i>
Capacité : ${table.capacity} places
</p>

<div class="table-actions">

<button onclick="viewTable('${item.id}')">
Voir
</button>

<button onclick="editTable('${item.id}')">
Modifier
</button>

<button onclick="deleteTable('${item.id}')">
Supprimer
</button>

</div>

</div>

`;

});

}
// ===============================
// VOIR UNE TABLE
// ===============================

async function viewTable(id){

let table = null;
let guests = [];

let tableSnapshot = await getDocs(collection(db,"tables"));

tableSnapshot.forEach(function(item){

if(item.id === id){
table = item.data();
}

});

if(!table) return;

let guestSnapshot = await getDocs(collection(db,"guests"));

guestSnapshot.forEach(function(item){

guests.push(item.data());

});

let html = `
<h3>Table ${table.number} - ${table.name}</h3>
<p>Capacité : ${table.capacity} places</p>
<hr>
<h4>Invités :</h4>
`;

let found = false;

guests.forEach(function(guest){

if(guest.table === table.name){

found = true;

html += `
<p>
<i class="fi fi-rr-user"></i>
${guest.name} (${guest.number} personne(s))
</p>
`;

}

});

if(!found){

html += "<p>Aucun invité à cette table.</p>";

}

document.getElementById("tableDetails").innerHTML = html;
document.getElementById("tableModal").style.display = "flex";

}



// ===============================
// MODIFIER UNE TABLE
// ===============================

async function editTable(id){

let snapshot = await getDocs(collection(db,"tables"));

snapshot.forEach(function(item){

if(item.id === id){

editingTableId = id;

let table = item.data();

document.getElementById("editTableNumber").value = table.number;
document.getElementById("editTableName").value = table.name;
document.getElementById("editTableCapacity").value = table.capacity;

}

});

document.getElementById("editTableModal").style.display = "flex";

}



// ===============================
// ENREGISTRER LA MODIFICATION
// ===============================

async function saveTableEdit(){

await updateDoc(
doc(db,"tables",editingTableId),
{

number:Number(document.getElementById("editTableNumber").value),

name:document.getElementById("editTableName").value,

capacity:Number(document.getElementById("editTableCapacity").value)

}
);

alert("Table modifiée.");

closeEditTableModal();

showTables();

}



// ===============================
// FERMER LA FENÊTRE DE MODIFICATION
// ===============================

function closeEditTableModal(){

document.getElementById("editTableModal").style.display = "none";

}
// ===============================
// SUPPRIMER UNE TABLE
// ===============================

async function deleteTable(id){

if(!confirm("Supprimer cette table ?")){
return;
}

await deleteDoc(doc(db,"tables",id));

alert("Table supprimée.");

showTables();

}



// ===============================
// CHARGER LES TABLES
// ===============================

async function loadTables(){

let select = document.getElementById("tableName");

if(!select) return;

select.innerHTML = '<option value="">Choisir une table</option>';

let tables = [];
let guests = [];

let tableSnapshot = await getDocs(collection(db,"tables"));

tableSnapshot.forEach(function(item){

tables.push(item.data());

});

let guestSnapshot = await getDocs(collection(db,"guests"));

guestSnapshot.forEach(function(item){

guests.push(item.data());

});

tables.forEach(function(table){

let occupied = 0;

guests.forEach(function(guest){

if(guest.table === table.name){

occupied += Number(guest.number);

}

});

let remaining = table.capacity - occupied;

if(remaining < 0){
remaining = 0;
}

select.innerHTML += `

<option value="${table.name}">
Table ${table.number} - ${table.name} (${remaining} places restantes)
</option>

`;

});

}



// ===============================
// OUVRIR / FERMER LE MODAL
// ===============================

function openTableModal(){

document.getElementById("tableModal").style.display = "flex";

showTableCards();

}

function closeTableModal(){

document.getElementById("tableModal").style.display = "none";

}



// ===============================
// CARTES DES TABLES
// ===============================

async function showTableCards(){

let list = document.getElementById("tableList");

if(!list) return;

list.innerHTML = "";

let tables = [];
let guests = [];

let tableSnapshot = await getDocs(collection(db,"tables"));

tableSnapshot.forEach(function(item){

tables.push(item.data());

});

let guestSnapshot = await getDocs(collection(db,"guests"));

guestSnapshot.forEach(function(item){

guests.push(item.data());

});

let search = "";

let searchInput = document.getElementById("tableSearch");

if(searchInput){

search = searchInput.value.toLowerCase();

}

tables.forEach(function(table){

if(
search !== "" &&
!table.name.toLowerCase().includes(search) &&
!String(table.number).includes(search)
){

return;

}

let occupied = 0;

guests.forEach(function(guest){

if(guest.table === table.name){

occupied += Number(guest.number);

}

});

let remaining = table.capacity - occupied;

if(remaining < 0){
remaining = 0;
}

let status = "Disponible";

if(remaining <= 3){
status = "Presque complète";
}

if(remaining === 0){
status = "Complète";
}

list.innerHTML += `

<div class="table-card"
${remaining>0 ? `onclick="selectTable('${table.name}')"` : ""}>

<h3>Table ${table.number} - ${table.name}</h3>

<p>Capacité : ${table.capacity}</p>

<p>Places restantes : ${remaining}</p>

<span>${status}</span>

</div>

`;

});

}



function selectTable(name){

document.getElementById("tableName").value = name;

let selected = document.getElementById("selectedTable");

if(selected){

selected.innerHTML = name;

}

closeTableModal();

}
// ===============================
// GÉNÉRER LE QR CODE
// ===============================

async function generateQR(id){

let guest = null;

let snapshot = await getDocs(collection(db,"guests"));

snapshot.forEach(function(item){

if(item.id === id){

guest = {
id:item.id,
...item.data()
};

}

});

if(!guest){

alert("Invité introuvable.");
return;

}

localStorage.setItem(
"selectedGuest",
JSON.stringify(guest)
);

window.location.href = "qrcode.html";

}



// ===============================
// EXPORT DES FONCTIONS
// ===============================

window.registerUser = registerUser;
window.loginUser = loginUser;
window.logoutUser = logoutUser;

window.saveWedding = saveWedding;

window.addGuest = addGuest;
window.showGuests = showGuests;
window.deleteGuest = deleteGuest;
window.editGuest = editGuest;

window.loadDashboard = loadDashboard;

window.searchReceptionGuest = searchReceptionGuest;
window.showSuggestions = showSuggestions;
window.selectGuest = selectGuest;
window.markReceptionArrived = markReceptionArrived;

window.startScanner = startScanner;
window.generateQR = generateQR;

window.addTable = addTable;
window.showTables = showTables;
window.viewTable = viewTable;
window.editTable = editTable;
window.saveTableEdit = saveTableEdit;
window.closeEditTableModal = closeEditTableModal;
window.deleteTable = deleteTable;
window.loadTables = loadTables;
window.openTableModal = openTableModal;
window.closeTableModal = closeTableModal;
window.showTableCards = showTableCards;
window.selectTable = selectTable;



// ===============================
// CHARGEMENT AUTOMATIQUE
// ===============================

showGuests();
loadDashboard();
loadTables();
showTables();

export {
showGuests,
loadDashboard
};