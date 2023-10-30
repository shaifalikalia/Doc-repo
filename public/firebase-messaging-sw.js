// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.7.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config

 let  firebaseConfig = {
  apiKey: "AIzaSyCrL5V-QBpMWsVb625-9KYUSXy1Lq2TZqk",
  authDomain: "healthhubapp-miraxis.firebaseapp.com",
  databaseURL: "https://healthhubapp-miraxis.firebaseio.com",
  projectId: "healthhubapp-miraxis",
  storageBucket: "healthhubapp-miraxis.appspot.com",
  messagingSenderId: "809846501809",
  appId: "1:809846501809:web:f8476fd90e8eebeff74d90",
  measurementId: "G-2ZH6SHSK3Q"
  };



// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log("Received background message ");

  
});
