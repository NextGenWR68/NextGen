// Import Firebase SDK
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, onValue, remove } from "firebase/database";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcy2qrz2NH-EJ9YIfcZphSXiaG2vXiBPs",
  authDomain: "nextgen-wr682.firebaseapp.com",
  databaseURL: "https://nextgen-wr682-default-rtdb.firebaseio.com",
  projectId: "nextgen-wr682",
  storageBucket: "nextgen-wr682.appspot.com",
  messagingSenderId: "611384552127",
  appId: "1:611384552127:web:b51d2c19a54fe9201bb40a",
  measurementId: "G-4XDQB8WDER",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// DOM Elements
const feedbackForm = document.getElementById("feedback-form");
const feedbackInput = document.getElementById("feedback");
const status = document.getElementById("status");
const commentsTable = document.getElementById("comments-table");
const searchBox = document.getElementById("search-box");
const deleteSelectedButton = document.getElementById("delete-selected");

// Add Feedback to Firebase
if (feedbackForm) {
  feedbackForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const feedback = feedbackInput.value.trim();
    if (!feedback) {
      status.textContent = "กรุณากรอกความคิดเห็นก่อนส่ง";
      status.style.color = "red";
      return;
    }

    // Push to Firebase
    const feedbackRef = ref(database, "feedbacks/");
    push(feedbackRef, {
      feedback,
      timestamp: Date.now(),
    })
      .then(() => {
        status.textContent = "ความคิดเห็นของคุณถูกส่งเรียบร้อยแล้ว!";
        status.style.color = "#4caf50";
        feedbackInput.value = "";
      })
      .catch((error) => {
        status.textContent = "เกิดข้อผิดพลาดในการส่งความคิดเห็น";
        status.style.color = "red";
        console.error(error);
      });
  });
}

// Load Comments from Firebase
const loadComments = () => {
  if (!commentsTable) return;

  const feedbackRef = ref(database, "feedbacks/");
  onValue(feedbackRef, (snapshot) => {
    const feedbacks = snapshot.val();
    commentsTable.innerHTML = "";

    if (!feedbacks) {
      commentsTable.innerHTML =
        '<tr><td colspan="4" style="text-align: center;">ไม่มีความคิดเห็น</td></tr>';
      return;
    }

    Object.keys(feedbacks).forEach((key) => {
      const feedbackData = feedbacks[key];
      const row = commentsTable.insertRow();
      row.innerHTML = `
        <td><input type="checkbox" class="select-comment" data-id="${key}"></td>
        <td>${key}</td>
        <td>${feedbackData.feedback}</td>
        <td>${new Date(feedbackData.timestamp).toLocaleString()}</td>
      `;
    });
  });
};

// Delete Selected Feedbacks
if (deleteSelectedButton) {
  deleteSelectedButton.addEventListener("click", () => {
    const selectedCheckboxes = document.querySelectorAll(
      ".select-comment:checked"
    );
    if (selectedCheckboxes.length === 0) {
      alert("กรุณาเลือกความคิดเห็นที่ต้องการลบ!");
      return;
    }

    const confirmDelete = confirm("คุณต้องการลบความคิดเห็นที่เลือกหรือไม่?");
    if (!confirmDelete) return;

    selectedCheckboxes.forEach((checkbox) => {
      const feedbackId = checkbox.getAttribute("data-id");
      const feedbackRef = ref(database, `feedbacks/${feedbackId}`);
      remove(feedbackRef)
        .then(() => {
          console.log(`ความคิดเห็น ${feedbackId} ถูกลบเรียบร้อย`);
        })
        .catch((error) => {
          console.error("เกิดข้อผิดพลาดในการลบความคิดเห็น:", error);
        });
    });

    alert("ความคิดเห็นที่เลือกถูกลบแล้ว!");
    loadComments();
  });
}

// Search Feedbacks
if (searchBox) {
  searchBox.addEventListener("input", () => {
    const searchTerm = searchBox.value.toLowerCase();
    const rows = commentsTable.getElementsByTagName("tr");
    Array.from(rows).forEach((row) => {
      const feedbackText = row.cells[2]?.textContent.toLowerCase() || "";
      row.style.display = feedbackText.includes(searchTerm) ? "" : "none";
    });
  });
}

// Initial Load
document.addEventListener("DOMContentLoaded", loadComments);
