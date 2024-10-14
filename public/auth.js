import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC858pUe3Gtp-OkN4WVB8UUgwiUDvjgnfQ",
  authDomain: "todolist-f9517.firebaseapp.com",
  projectId: "todolist-f9517",
  storageBucket: "todolist-f9517.appspot.com",
  messagingSenderId: "1012165563456",
  appId: "1:1012165563456:web:98883865d46e1a705b7ba5",
  measurementId: "G-2YPLZGTBVT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('registerButton').addEventListener('click', registerUser);
  document.getElementById('signInButton').addEventListener('click', signInUser);

  // Set up auth state listener
  onAuthStateChanged(auth, (user) => {
    if (user) {
      window.location.href = 'todolist.html'; // Redirect to todo list if already authenticated
    }
  });
});

function registerUser() {
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User registered:", userCredential.user);
      window.location.href = 'todolist.html';
    })
    .catch((error) => {
      console.error("Registration error:", error);
      document.getElementById('userStatus').textContent = `Registration error: ${error.message}`;
    });
}

function signInUser() {
  const email = document.getElementById('emailInput').value;
  const password = document.getElementById('passwordInput').value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log("User signed in:", userCredential.user);
      window.location.href = 'todolist.html';
    })
    .catch((error) => {
      console.error("Sign-in error:", error);
      document.getElementById('userStatus').textContent = `Sign-in error: ${error.message}`;
    });
}
