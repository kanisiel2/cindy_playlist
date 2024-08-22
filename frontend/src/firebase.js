// // Import the functions you need from the SDKs you need


// import firebase from "firebase";
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";


// // import firebase from "firebase";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAd1D1upKIvbZr9TLU7nH9G4g3Mvgv96ug",
  authDomain: "cindyhelper-a7b4b.firebaseapp.com",
  projectId: "cindyhelper-a7b4b",
  storageBucket: "cindyhelper-a7b4b.appspot.com",
  messagingSenderId: "624352902528",
  appId: "1:624352902528:web:20ea2f32ad6b713cbf5565"
};

// // Initialize Firebase
// // export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseApp = initializeApp(firebaseConfig);
export const messaging = getMessaging(firebaseApp);
// firebaseApp.messaging();


// export const firebaseApp = firebase.initializeApp(firebaseConfig);