document.getElementById("feedback-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const feedback = document.getElementById("feedback").value.trim();
  const status = document.getElementById("status");

  if (!feedback) {
    status.textContent = "กรุณากรอกความคิดเห็นก่อนส่ง";
    status.style.color = "red";
    return;
  }

  // ส่งความคิดเห็นไปยังเซิร์ฟเวอร์
  const timestamp = new Date().toISOString(); // สร้าง timestamp สำหรับความคิดเห็น
  const feedbackData = {
    feedback: feedback,
    timestamp: timestamp
  };

  // บันทึกความคิดเห็น (สำหรับการใช้งานจริงจะต้องส่งข้อมูลไปยังเซิร์ฟเวอร์)
  localStorage.setItem(timestamp, JSON.stringify(feedbackData)); // เก็บข้อมูลใน localStorage

  status.textContent = "ความคิดเห็นของคุณถูกส่งเรียบร้อยแล้ว!";
  status.style.color = "#4caf50";

  // ล้างค่าที่กรอกในฟอร์ม
  document.getElementById("feedback").value = "";
});