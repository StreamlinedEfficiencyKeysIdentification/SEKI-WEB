// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

//Configuração do firebase
const firebaseConfig = {
  apiKey: 'AIzaSyDl1-EOxkyA3BgX7vF915h2-G3t8jz3wqw',
  authDomain: 'seki-99cd1.firebaseapp.com',
  projectId: 'seki-99cd1',
  storageBucket: 'seki-99cd1.appspot.com',
  messagingSenderId: '714606196800',
  appId: '1:714606196800:web:3d0c9a805a48f5edbe07a5',
  measurementId: 'G-5R8ZGL5YY0'
};

//Exportando o firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
