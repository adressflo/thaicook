// src/firebaseConfig.ts
import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";

// Configuration Firebase avec variables d'environnement Next.js
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
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