document.addEventListener("DOMContentLoaded", function () {
  const commentsTable = document.getElementById("comments-table").getElementsByTagName('tbody')[0];
  const searchBox = document.getElementById("search-box");

  // ฟังก์ชันสร้างรหัสสุ่มแบบไม่ซ้ำ
  const usedIds = new Set(); // เก็บรหัสที่เคยใช้แล้ว

  function generateRandomUniqueId() {
    const length = 6; // กำหนดความยาวของรหัส (6 ตัวอักษร)
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let id;

    do {
      id = "#";
      for (let i = 0; i < length; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    } while (usedIds.has(id)); // ตรวจสอบว่ารหัสนี้เคยใช้หรือยัง

    usedIds.add(id); // บันทึกรหัสที่ถูกใช้แล้ว
    return id;
  }

  // ฟังก์ชันโหลดความคิดเห็นจาก localStorage
  function loadComments() {
    const keys = Object.keys(localStorage);
    commentsTable.innerHTML = ''; // ล้างตารางก่อนโหลดใหม่

    // ดึงความคิดเห็นทั้งหมดจาก localStorage
    const allComments = keys.map(key => {
      const commentData = JSON.parse(localStorage.getItem(key));
      return {
        id: key,
        feedback: commentData.feedback,
        timestamp: new Date(commentData.timestamp),
      };
    });

    // **เรียงตารางจากใหม่ไปเก่า (ล่าสุดด้านบน)**
    allComments.sort((a, b) => b.timestamp - a.timestamp);

    // เพิ่มความคิดเห็นลงในตาราง
    allComments.forEach(comment => {
      const row = commentsTable.insertRow();
      row.innerHTML = `
        <td>${generateRandomUniqueId()}</td>
        <td>${comment.feedback}</td>
        <td>${comment.timestamp.toLocaleString()}</td>
      `;
    });
  }

  loadComments(); // โหลดความคิดเห็นเมื่อเปิดหน้า

  // ฟังก์ชันค้นหาความคิดเห็น
  searchBox.addEventListener("input", function () {
    const searchTerm = searchBox.value.toLowerCase();
    const rows = commentsTable.getElementsByTagName('tr');

    Array.from(rows).forEach(row => {
      const cells = row.getElementsByTagName('td');
      const feedbackText = cells[1].textContent.toLowerCase();
      if (feedbackText.includes(searchTerm)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });
});