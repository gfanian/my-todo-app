const express = require('express');
const { initializeApp } = require('firebase/app');
const { getAnalytics } = require('firebase/analytics');
const { getAuth } = require('firebase/auth');
const mongoose = require('mongoose');
const taskRoutes = require('./routes/taskRoutes');

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
const firebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(firebaseApp);
const auth = getAuth(firebaseApp);
const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://Gab:Fan@cluster0.waegi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files (HTML, CSS, JS)
app.use(express.static('public'));

// Use the task routes
app.use('/tasks', taskRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
