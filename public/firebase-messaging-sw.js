// Service Worker Firebase Cloud Messaging
// Gère les notifications push en background (app fermée/en arrière-plan)

importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js');

// Configuration Firebase (doit correspondre à .env)
const firebaseConfig = {
  apiKey: 'AIzaSyBXTuIuLnuRgAs2Hb6J7SBq75dtnZx6waU',
  authDomain: 'chanthanathaicookapp.firebaseapp.com',
  projectId: 'chanthanathaicookapp',
  storageBucket: 'chanthanathaicookapp.firebasestorage.app',
  messagingSenderId: '160076199215',
  appId: '1:160076199215:web:b1de32c00972ddcf2addda',
};

// Initialiser Firebase
firebase.initializeApp(firebaseConfig);

// Récupérer instance messaging
const messaging = firebase.messaging();

// Écouter les messages en background
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Message background reçu:', payload);

  // Extraire données notification
  const notificationTitle = payload.notification?.title || payload.data?.title || 'Nouvelle notification';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || '',
    icon: payload.notification?.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    tag: payload.data?.tag || 'default',
    data: payload.data || {},
    requireInteraction: payload.data?.requireInteraction === 'true',
    vibrate: [200, 100, 200],
  };

  // Actions selon type de notification
  if (payload.data?.type === 'order') {
    notificationOptions.actions = [
      { action: 'view', title: 'Voir commande' },
      { action: 'dismiss', title: 'Ignorer' },
    ];
  } else if (payload.data?.type === 'event') {
    notificationOptions.actions = [
      { action: 'view', title: 'Voir événement' },
      { action: 'dismiss', title: 'Ignorer' },
    ];
  }

  // Afficher notification
  return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Gérer le clic sur notification
self.addEventListener('notificationclick', (event) => {
  console.log('[firebase-messaging-sw.js] Notification cliquée:', event.notification.tag);

  event.notification.close();

  const data = event.notification.data;
  let url = '/';

  // Déterminer URL selon type
  if (data.type === 'order' && data.orderId) {
    url = `/suivi-commande/${data.orderId}`;
  } else if (data.type === 'event' && data.eventId) {
    url = `/suivi-evenement/${data.eventId}`;
  } else if (data.url) {
    url = data.url;
  }

  // Actions spécifiques selon bouton cliqué
  if (event.action === 'dismiss') {
    return; // Ne rien faire, juste fermer
  }

  // Ouvrir ou focus fenêtre
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Chercher fenêtre déjà ouverte
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === self.location.origin + url && 'focus' in client) {
            return client.focus();
          }
        }

        // Sinon, ouvrir nouvelle fenêtre
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
