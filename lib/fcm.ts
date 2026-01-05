import { getMessaging, getToken, onMessage, deleteToken, Messaging } from 'firebase/messaging';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';

// Configuration Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase (évite duplications)
let firebaseApp: FirebaseApp;
if (!getApps().length) {
  firebaseApp = initializeApp(firebaseConfig);
} else {
  firebaseApp = getApps()[0];
}

/**
 * Obtient l'instance Firebase Messaging
 * @returns Instance Messaging ou null si pas supporté
 */
export function getMessagingInstance(): Messaging | null {
  if (typeof window === 'undefined') {
    return null;
  }

  // CRITIQUE: Vérifier VAPID key AVANT d'initialiser Messaging (évite 401 FCM)
  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
  if (!vapidKey || vapidKey === 'YOUR_VAPID_KEY_HERE' || vapidKey.trim() === '') {
    // FCM non configuré - retour silencieux (feature optionnelle)
    return null;
  }

  if (!('Notification' in window)) {
    return null;
  }

  try {
    return getMessaging(firebaseApp);
  } catch (error) {
    // Log uniquement en développement
    if (process.env.NODE_ENV === 'development') {
      console.warn('Firebase Messaging non disponible (non-critique):', error);
    }
    return null;
  }
}

/**
 * Demande la permission notifications et obtient le token FCM
 * @returns Token FCM ou null si refusé/erreur
 */
export async function requestNotificationPermission(): Promise<string | null> {
  if (typeof window === 'undefined') {
    console.warn('requestNotificationPermission appelé côté serveur');
    return null;
  }

  try {
    // Vérifier si notifications supportées
    if (!('Notification' in window)) {
      console.warn('Notifications non supportées');
      return null;
    }

    // Demander permission
    const permission = await Notification.requestPermission();

    if (permission !== 'granted') {
      console.log('Permission notifications refusée');
      return null;
    }

    const messaging = getMessagingInstance();
    if (!messaging) {
      // Retour silencieux - messaging non disponible (VAPID manquante ou navigateur incompatible)
      return null;
    }

    // Obtenir token FCM (VAPID key déjà validée dans getMessagingInstance)
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!;
    const token = await getToken(messaging, { vapidKey });

    if (token) {
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ Token FCM obtenu:', token.substring(0, 20) + '...');
      }
      return token;
    } else {
      return null;
    }
  } catch (error) {
    // Log uniquement en développement
    if (process.env.NODE_ENV === 'development') {
      console.warn('FCM token request failed (non-critique):', error);
    }
    return null;
  }
}

/**
 * Vérifie le statut actuel de la permission notifications
 * @returns 'granted' | 'denied' | 'default'
 */
export function getNotificationPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'default';
  }
  return Notification.permission;
}

/**
 * Écoute les messages FCM en foreground (app ouverte)
 * @param callback Fonction appelée à chaque message reçu
 */
export function onMessageListener(
  callback: (payload: any) => void
): (() => void) | null {
  if (typeof window === 'undefined') {
    console.warn('onMessageListener appelé côté serveur');
    return null;
  }

  const messaging = getMessagingInstance();
  if (!messaging) {
    // Retour silencieux - messaging non disponible
    return null;
  }

  try {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('📬 Message FCM reçu:', payload);
      callback(payload);
    });

    return unsubscribe;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Erreur onMessage (non-critique):', error);
    }
    return null;
  }
}

/**
 * Révoque le token FCM (lors déconnexion)
 * @returns true si succès, false sinon
 */
export async function revokeFCMToken(): Promise<boolean> {
  if (typeof window === 'undefined') {
    console.warn('revokeFCMToken appelé côté serveur');
    return false;
  }

  const messaging = getMessagingInstance();
  if (!messaging) {
    // Retour silencieux - messaging non disponible
    return false;
  }

  try {
    await deleteToken(messaging);
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Token FCM révoqué');
    }
    return true;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Erreur révocation token FCM (non-critique):', error);
    }
    return false;
  }
}

/**
 * Vérifie si le navigateur supporte les notifications
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Vérifie si le Service Worker est enregistré
 */
export async function isServiceWorkerRegistered(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    return registrations.length > 0;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('Erreur vérification Service Worker (non-critique):', error);
    }
    return false;
  }
}
