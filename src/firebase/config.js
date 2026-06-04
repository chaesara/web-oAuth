import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAmIYCRpf6aTY26JkSFxwlWRtlvn4RVT10",
  authDomain: "oauthpro-1d4ff.firebaseapp.com",
  projectId: "oauthpro-1d4ff",
  storageBucket: "oauthpro-1d4ff.firebasestorage.app",
  messagingSenderId: "827340053829",
  appId: "1:827340053829:web:503a41232d2c30f1a6322c",
  measurementId: "G-26VMRK7TY8",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
