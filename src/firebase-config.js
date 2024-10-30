import {initializeApp} from "firebase/app";
import {getFirestore, serverTimestamp} from "firebase/firestore";


const firebaseConfig = {
    apiKey: "AIzaSyAk-TXVx1adO9X4LQISchV9sulx5Dg0iNA",
    authDomain: "mvpapp-project-a993c.firebaseapp.com",
    projectId: "mvpapp-project-a993c",
    storageBucket: "mvpapp-project-a993c.appspot.com",
    messagingSenderId: "31467154932",
    appId: "1:31467154932:web:d7cb114d9fa5dc8931dda1",
    measurementId: "G-GPPRFKW6K6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db, serverTimestamp}

