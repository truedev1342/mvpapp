import {initializeApp} from "firebase/app";
import {getFirestore, serverTimestamp} from "firebase/firestore";


const firebaseConfig = {
    apiKey: "Your_apiKey",
    authDomain: "Your_authDomain",
    projectId: "Your_projectId",
    storageBucket: "Your_storageBucket",
    messagingSenderId: "Your_messagingSenderId",
    appId: "Your_appId",
    measurementId: "Your_measurementId"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db, serverTimestamp}

