import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAMBXbCVYqCAxFvEtj1q46wHYQdMNp2D8A",
  authDomain: "samle-48b27.firebaseapp.com",
  projectId: "samle-48b27",
  storageBucket: "samle-48b27.appspot.com",
  messagingSenderId: "33990985691",
  appId: "1:33990985691:web:1c428e46b0908c2ac5c9fe"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };