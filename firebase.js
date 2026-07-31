import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCzQBV4KeN3NS2bbkjFgB1pA96frK_ZKnk",
  authDomain: "gestioninvite-20c1d.firebaseapp.com",
  projectId: "gestioninvite-20c1d",
  storageBucket: "gestioninvite-20c1d.firebasestorage.app",
  messagingSenderId: "573217933079",
  appId: "1:573217933079:web:5a84f7ab3e0356e1369952"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };