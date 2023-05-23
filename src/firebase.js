import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Buraya kendi firebaseConfig kodlarınızı yapıştırın...
const firebaseConfig = {
    apiKey: "XXX",
    authDomain: "XXX",
    projectId: "XXXXXX",
    storageBucket: "XXXXXX",
    messagingSenderId: "XXXXXXXXXX",
    appId: "XXXXXXXXXXXX"
  };

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
export {db}