document.addEventListener("DOMContentLoaded", () => {
  const feedbackForm = document.getElementById("feedback-form");
  const feedbackInput = document.getElementById("feedback");
  const status = document.getElementById("status");
  const commentsTable = document.getElementById("comments-table");
  const searchBox = document.getElementById("search-box");
  const deleteSelectedButton = document.getElementById("delete-selected");

  // ฟังก์ชันบันทึกความคิดเห็น
  if (feedbackForm) {
    feedbackForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const feedback = feedbackInput.value.trim();

      if (!feedback) {
        status.textContent = "กรุณากรอกความคิดเห็นก่อนส่ง";
        status.style.color = "red";
        return;
      }

      const id = Date.now().toString(); // ใช้ timestamp เป็น id
      const timestamp = new Date().toISOString();
      const data = { feedback, timestamp };

      try {
        localStorage.setItem(id, JSON.stringify(data));
        status.textContent = "ความคิดเห็นของคุณถูกส่งเรียบร้อยแล้ว!";
        status.style.color = "#4caf50";
        feedbackInput.value = ""; // ล้างค่าที่กรอกในฟอร์ม
      } catch (error) {
        status.textContent = "เกิดข้อผิดพลาดในการบันทึกความคิดเห็น";
        status.style.color = "red";
      }
    });
  }

  // ฟังก์ชันโหลดความคิดเห็น
  const loadComments = () => {
    if (!commentsTable) return;

    const keys = Object.keys(localStorage);
    commentsTable.innerHTML = "";

    if (keys.length === 0) {
      commentsTable.innerHTML =
        '<tr><td colspan="4" style="text-align: center;">ไม่มีข้อมูลความคิดเห็น</td></tr>';
      return;
    }

    keys.forEach((key) => {
      const { feedback, timestamp } = JSON.parse(localStorage.getItem(key));
      const row = commentsTable.insertRow();
      row.innerHTML = `
        <td><input type="checkbox" class="select-comment" data-id="${key}"></td>
        <td>${key}</td>
        <td>${feedback}</td>
        <td>${new Date(timestamp).toLocaleString()}</td>
      `;
    });
  };

  // ฟังก์ชันค้นหาความคิดเห็น
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

  // ฟังก์ชันลบความคิดเห็น
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
        const commentId = checkbox.getAttribute("data-id");
        if (localStorage.getItem(commentId)) {
          localStorage.removeItem(commentId);
        }
      });

      alert("ความคิดเห็นที่เลือกถูกลบแล้ว!");
      loadComments();
    });
  }

  loadComments();
});
