import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBe25pSxUu3V_oqZnIIIbVaHVxqMtjNi7w",
  authDomain: "bazardm-f08c2.firebaseapp.com",
  projectId: "bazardm-f08c2",
  storageBucket: "bazardm-f08c2.firebasestorage.app", // 👈 alterado
  messagingSenderId: "1052140836561",
  appId: "1:1052140836561:web:633f49eb3b2168aa9d17f0",
  measurementId: "G-7W2L3FSYPL"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar serviços
export const db = getFirestore(app);       // Firestore
export const auth = getAuth(app);          // Autenticação
export const storage = getStorage(app);    // Storage
