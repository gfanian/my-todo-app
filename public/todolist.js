import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, deleteDoc, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

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
const db = getFirestore(app);

console.log("todolist.js is loaded"); // Log when the script starts

// Define the signOutUser function
function signOutUser() {
  console.log("signOutUser function called");
  signOut(auth).then(() => {
    console.log("User signed out successfully");
    window.location.href = 'index.html';
  }).catch((error) => {
    console.error("Error signing out:", error);
  });
}

// Add event listeners
document.addEventListener('DOMContentLoaded', () => {
  console.log("DOMContentLoaded event fired");

  const signOutButton = document.getElementById('signOutButton');
  const addButton = document.getElementById('addButton');
  const deleteButton = document.getElementById('deleteButton');

  console.log("signOutButton:", signOutButton);

  if (signOutButton) {
    console.log("Adding click event listener to signOutButton");
    signOutButton.addEventListener('click', signOutUser);
  } else {
    console.error("Sign out button not found in the DOM");
  }

  if (addButton) addButton.addEventListener('click', handleAddTask);
  if (deleteButton) deleteButton.addEventListener('click', deleteSelectedTasks);
  
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user.email);
      document.getElementById('userStatus').textContent = `Logged in as: ${user.email}`;
      loadTasks();
    } else {
      console.log("No user signed in, redirecting to index.html");
      window.location.href = 'index.html';
    }
  });
});

// Function to set up the sign-out button
function setupSignOutButton() {
  const signOutButton = document.getElementById('signOutButton');
  if (signOutButton) {
    signOutButton.addEventListener('click', signOutUser);
  }
}

function handleAddTask() {
  const input = document.getElementById('todoInput');
  const taskName = input.value.trim();
  if (taskName) {
    addTask(taskName);
    input.value = '';
  } else {
    console.log("Task name is empty");
    document.getElementById('userStatus').textContent = "Error: Task name cannot be empty";
  }
}

async function addTask(taskName) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');

    const docRef = await addDoc(collection(db, "tasks"), {
      userId: user.uid,
      name: taskName,
      completed: false
    });
    console.log("Task added with ID: ", docRef.id);
    addTaskToUI(docRef.id, taskName, false);
  } catch (error) {
    console.error("Error adding task: ", error);
  }
}

function addTaskToUI(id, name, completed) {
  const li = document.createElement('li');
  li.textContent = name;
  li.id = id;
  if (completed) li.classList.add('completed');
  li.addEventListener('click', () => toggleTaskSelection(li));
  document.getElementById('todoList').appendChild(li);
}

function toggleTaskSelection(li) {
  li.classList.toggle('selected');
  checkSelectedTasks();
}

function checkSelectedTasks() {
  const deleteButton = document.getElementById('deleteButton');
  const selectedTasks = document.querySelectorAll('#todoList li.selected');
  deleteButton.style.display = selectedTasks.length > 0 ? 'block' : 'none';
}

async function loadTasks() {
  const user = auth.currentUser;
  if (!user) return;

  const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
  const querySnapshot = await getDocs(q);
  document.getElementById('todoList').innerHTML = '';
  querySnapshot.forEach((doc) => {
    addTaskToUI(doc.id, doc.data().name, doc.data().completed);
  });
}

async function deleteSelectedTasks() {
  const user = auth.currentUser;
  if (!user) {
    console.error("No user is signed in");
    document.getElementById('userStatus').textContent = "Error: No user signed in";
    return;
  }

  const selectedTasks = document.querySelectorAll('.selected');
  const taskNames = Array.from(selectedTasks).map(task => task.textContent);

  try {
    // Delete tasks from Firestore
    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("userId", "==", user.uid), where("name", "in", taskNames));
    const querySnapshot = await getDocs(q);
    
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Remove selected tasks from the UI
    selectedTasks.forEach(task => task.remove());
    checkSelectedTasks(); // Hide the delete button if no tasks are selected
    document.getElementById('userStatus').textContent = "Selected tasks deleted successfully";
  } catch (error) {
    console.error("Error deleting tasks: ", error);
    document.getElementById('userStatus').textContent = `Error deleting tasks: ${error.message}`;
  }
}
