import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";
import {
getFirestore,
doc,
setDoc
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBROl8wiCpi5Xrod5ntO6lvLxllqF-lUjI",
  authDomain: "wedflow-529c8.firebaseapp.com",
  projectId: "wedflow-529c8",
  storageBucket: "wedflow-529c8.firebasestorage.app",
  messagingSenderId: "991826402524",
  appId: "1:991826402524:web:e47dc95de068381f352819"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);