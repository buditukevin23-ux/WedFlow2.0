import { auth, db } from "./firebase.js";

import {
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {

loginBtn.addEventListener("click", () => {

const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

signInWithEmailAndPassword(auth, email, password)

.then(() => {

window.location.href = "dashboard.html";

})

.catch((error) => {

alert(error.message);

});

});

}
import {
  createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

const registerBtn = document.getElementById("registerBtn");

if (registerBtn) {

  registerBtn.addEventListener("click", async () => {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

await setDoc(doc(db, "users", userCredential.user.uid), {
    name: name,
    email: email,
    role: "organisateur",
    createdAt: new Date()
});

      alert("Compte créé avec succès ✅");

      window.location.href = "login.html";

    } catch (error) {

      alert(error.message);

    }

  });

}