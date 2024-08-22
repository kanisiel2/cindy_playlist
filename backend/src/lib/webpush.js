exports.vapidKeys = {
    // "publicKey":"BJmhOhNdNjrMn4DDoVoYUqnETkU76M0ceBn0WBN5r_ex1fCHJ_rDoCcOiwNcnxaOoT1xYQUJwWCMyYMGCQqP1Ro",
    // "privateKey":"yOWYs0w1PH0qx5vFeN4ssFj1UF6px3NcoT3qMyG_bKc",
    "publickey":"BP8OAIzF06k935BX7pRgWmpp5Fjp5NhczrleLk5FpXUwF2MHLO3UjhdLarD42tTSixxhxr4X2O3VDweByFTZJCw",
    "privatekey":"O9O6fFRrX16X0WMz1n5nIeyeyb63M0pRyhfmWpbhj1U"    
}
exports.GCMAPIKey = "AIzaSyAd1D1upKIvbZr9TLU7nH9G4g3Mvgv96ug";

// // get subscription from the request
// const newSubscription = request.body //depends on your type of server and/or library (like express)

// // save somewhere. Most likely a DB like Postgres.
// someImaginativeDB.saveSomewhere(newSubscription)

// import { sendNotification } from "web-push-notification/server";

// // get subscription from somewhere. Most likely a DB like Postgres.
// const subscription = someImaginativeDB.get(...)

// // create notification information. Full list of properties: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerRegistration/showNotification
// const notification = {
//     title: "....",
//     options: {
//         body: "...",
//         data: { url: "https://www.your-domain/new-blog-post" }, // Recommended workaround. Actions are buggy in Safari AND in Chromium. More about that in the FAQs.
//     }
// }

// // your Vapid Details from Step 1
// const vapidDetails = {
//     'mailto:example@yourdomain.com', //This must be either a URL or a 'mailto:' address. For example: 'https://your-website.com/contact' or 'mailto: info@your-website.com'
//     vapidKeys.publickey,
//     vapidKeys.privatekey //should be stored safely. Most likely as a secret environment variable.
// }

// const result = await sendNotification(notification, subscription, vapidDetails);