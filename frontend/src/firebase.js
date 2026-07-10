import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyASQUIuSYLKgtulAhvRqpcTmJH4-_kqj2k",
  authDomain: "multi-domain-chatbot-92b7a.firebaseapp.com",
  projectId: "multi-domain-chatbot-92b7a`",
  storageBucket: "multi-domain-chatbot-92b7a.firebasestorage.app",
  messagingSenderId: "708040020484",
  appId: "1:708040020484:web:d1b4b03f5ad203695f9b51"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;