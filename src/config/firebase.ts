import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig ={
  apiKey: "AIzaSyDDOuUbxluio9ulxz419BSPzheoiSW9EA0",
  authDomain: "d-id-api-demo.firebaseapp.com",
  projectId: "d-id-api-demo",
  storageBucket: "d-id-api-demo.appspot.com",
  messagingSenderId: "642231194463",
  appId: "1:642231194463:web:6cd53665f2f1ef1aa51cea"
};

  const app = initializeApp(firebaseConfig);
  export const db = getDatabase(app);
  export const storage = getStorage(app);