document.addEventListener('DOMContentLoaded', function() {
  // Check admin session
  const session = JSON.parse(localStorage.getItem('session'));
  if (!session || session.role !== 'admin') {
    window.location.href = 'admin-login.html';
    return;
  }

  // Setup form validation and submission
  const form = document.getElementById('createExamForm');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    
    createExam();
  });
});

function createExam() {
  const examName = document.getElementById('exam_name').value.trim();
  const subject = document.getElementById('subject').value.trim();
  const duration = parseInt(document.getElementById('duration').value.trim());

  // Additional validation
  if (duration < 1 || duration > 480) {
    alert('Duration must be between 1 and 480 minutes.');
    return;
  }

  const existingExams = JSON.parse(localStorage.getItem('exams') || []);
  const examId = existingExams.length > 0
    ? Math.max(...existingExams.map(e => e.exam_id)) + 1
    : 1;

  const newExam = {
    exam_id: examId,
    exam_name: examName,
    subject: subject,
    duration: duration
  };

  existingExams.push(newExam);
  localStorage.setItem('exams', JSON.stringify(existingExams));

  // Show success and redirect
  alert('Exam created successfully!');
  window.location.href = `add-question.html?examId=${examId}`;
}

function logout() {
  localStorage.removeItem('session');
  window.location.href = 'admin-login.html';
}