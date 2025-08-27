// src/firebaseConfig.ts
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// Ta configuration Firebase (remplace par tes vraies valeurs si nécessaire)
const firebaseConfig = {
  apiKey: "AIzaSyBXTuIuLnuRgAs2Hb6J7SBq75dtnZx6waU",
  authDomain: "chanthanathaicookapp.firebaseapp.com",
  projectId: "chanthanathaicookapp",
  storageBucket: "chanthanathaicookapp.firebasestorage.app",
  messagingSenderId: "160076199215",
  appId: "1:160076199215:web:b1de32c00972ddcf2addda"
};

// Initialise Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);

// Exporte les services Firebase que tu vas utiliser
// Pour l'instant, on exporte l'authentification (Auth)
// Tu pourras ajouter d'autres services ici (comme Firestore, Storage) si besoin
export const auth: Auth = getAuth(app);

// Tu peux aussi exporter l'application 'app' si tu en as besoin directement ailleurs,
// mais pour l'authentification, 'auth' est ce qu'on utilise le plus souvent.
export default app;