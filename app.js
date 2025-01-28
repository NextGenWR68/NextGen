// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcy2qrz2NH-EJ9YIfcZphSXiaG2vXiBPs",
  authDomain: "nextgen-wr682.firebaseapp.com",
  databaseURL: "https://nextgen-wr682-default-rtdb.firebaseio.com",
  projectId: "nextgen-wr682",
  storageBucket: "nextgen-wr682.firebasestorage.app",
  messagingSenderId: "611384552127",
  appId: "1:611384552127:web:b51d2c19a54fe9201bb40a",
  measurementId: "G-4XDQB8WDER",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// DOM Elements
const submitBtn = document.getElementById("submitBtn");
const commentBox = document.getElementById("commentBox");
const commentsList = document.getElementById("commentsList");

// Load comments from Firebase
onValue(ref(database, "comments"), (snapshot) => {
  commentsList.innerHTML = ""; // Clear existing comments
  const data = snapshot.val();
  for (let id in data) {
    const li = document.createElement("li");
    li.textContent = data[id].text;
    commentsList.appendChild(li);
  }
});

// Submit a comment
submitBtn.addEventListener("click", () => {
  const comment = commentBox.value.trim();
  if (comment) {
    push(ref(database, "comments"), { text: comment, date: new Date().toISOString() });
    commentBox.value = ""; // Clear input
  }
});
