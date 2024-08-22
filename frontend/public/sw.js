// Immediately take control of the page, see the 'Immediate Claim' recipe
// for a detailed explanation of the implementation of the following two
// event listeners.

self.addEventListener('install', function(event) {
    event.waitUntil(self.skipWaiting());
  });
  
  self.addEventListener('activate', function(event) {
    event.waitUntil(self.clients.claim());
  });
  
  // Register event listener for the 'push' event.
  self.addEventListener('push', function(event) {
    // console.log("푸시 도착!");
    // console.log(event.data.text());
    const payload = event.data ? JSON.parse(event.data.text()) : 
    {
      title: "신디 방송 알람!",
      body: "신디가 방송을 켰어요~",
      tag: "cindyyyyy_kr",
      icon: "https://song.cindy.team:3002/logo.png",
      badge: "https://song.cindy.team:3002/badge.png",
    };
    
    //event.data ? JSON.parse(event.data) : null;
    
    event.waitUntil(
      // Retrieve a list of the clients of this service worker.
      self.clients.matchAll().then(function(clientList) {
        // Check if there's at least one focused client.
        // var focused = clientList.some(function(client) {
        //   return client.focused;
        // });
  
        var notificationMessage = payload.body;
        // if (focused) {
        //   notificationMessage = 'You\'re still here, thanks!';
        // } else if (clientList.length > 0) {
        //   notificationMessage = 'You haven\'t closed the page, ' +
        //                         'click here to focus it!';
        // } else {
        //   notificationMessage = 'You have closed the page, ' +
        //                         'click here to re-open it!';
        // }
  
        // Show a notification with title 'ServiceWorker Cookbook' and body depending
        // on the state of the clients of the service worker (three different bodies:
        // 1, the page is focused; 2, the page is still open but unfocused; 3, the page
        // is closed).
        return self.registration.showNotification(payload.title, {
          body: notificationMessage,
          tag: payload.tag,
          icon: payload.icon,
          badge: payload.badge,
        });
      })
    );
  });
  
  // Register event listener for the 'notificationclick' event.
  self.addEventListener('notificationclick', function(event) {
    event.waitUntil(
      // Retrieve a list of the clients of this service worker.
      self.clients.matchAll().then(function(clientList) {
        // If there is at least one client, focus it.
        if (clientList.length > 0) {
          return clientList[0].focus();
        }
  
        // Otherwise, open a new page.
        return self.clients.openWindow('https://song.cindy.team');
      })
    );
  });

  self.addEventListener(
    "pushsubscriptionchange",
    (event) => {
      const conv = (val) =>
        btoa(String.fromCharCode.apply(null, new Uint8Array(val)));
      const getPayload = (subscription) => ({
        endpoint: subscription.endpoint,
        publicKey: conv(subscription.getKey("p256dh")),
        authToken: conv(subscription.getKey("auth")),
      });
  
      const subscription = self.registration.pushManager
        .subscribe(event.oldSubscription.options)
        .then((subscription) =>
          fetch("register", {
            method: "post",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({
              old: getPayload(event.oldSubscription),
              new: getPayload(subscription),
            }),
          }),
        );
      event.waitUntil(subscription);
    },
    false,
  );