// Create Exam Page Logic
(function() {
  // Session check
  const session = JSON.parse(localStorage.getItem('session'));
  if (!session || session.role !== 'admin') {
    window.location.href = '../admin-login.html';
    return;
  }

  document.getElementById('createExamForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const examName = document.getElementById('examName').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const duration = parseInt(document.getElementById('duration').value, 10);
    if (!examName || !subject || !duration || duration < 1) {
      alert('Please fill all fields correctly.');
      return;
    }
    let exams = JSON.parse(localStorage.getItem('exams')) || [];
    const exam_id = exams.length ? Math.max(...exams.map(e => e.exam_id)) + 1 : 1;
    exams.push({ exam_id, exam_name: examName, subject, duration });
    localStorage.setItem('exams', JSON.stringify(exams));
    document.getElementById('successMsg').classList.remove('hidden');
    this.reset();
  });
})();

function logout() {
  localStorage.removeItem('session');
  window.location.href = '../admin-login.html';
}
