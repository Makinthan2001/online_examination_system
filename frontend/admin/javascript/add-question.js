// Admin Session Check
function checkAdminSession() {
  const session = JSON.parse(localStorage.getItem('session'));
  if (!session || session.role !== 'admin') {
    window.location.href = 'admin-login.html';
    return false;
  }
  return true;
}

// Initialize Page
document.addEventListener('DOMContentLoaded', function() {
  if (!checkAdminSession()) return;
  
  // Load exams into dropdown
  populateExamSelect();
  
  // Form validation and submission
  setupQuestionForm();
});

// Populate Exam Dropdown
function populateExamSelect() {
  const exams = JSON.parse(localStorage.getItem('exams')) || [];
  const select = document.getElementById('examSelect');
  
  exams.forEach(exam => {
    const option = document.createElement('option');
    option.value = exam.exam_id;
    option.textContent = `${exam.exam_name} (${exam.subject || 'No Subject'})`;
    select.appendChild(option);
  });
}

// Setup Form Submission
function setupQuestionForm() {
  const form = document.getElementById('questionForm');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    
    addQuestion();
  });
}

// Add New Question
function addQuestion() {
  const exam_id = parseInt(document.getElementById('examSelect').value);
  const question_text = document.getElementById('questionText').value.trim();
  const option_a = document.getElementById('optionA').value.trim();
  const option_b = document.getElementById('optionB').value.trim();
  const option_c = document.getElementById('optionC').value.trim();
  const option_d = document.getElementById('optionD').value.trim();
  const correct_answer = document.getElementById('correctAnswer').value.trim();
  
  // Validate correct answer matches one of the options
  if (![option_a, option_b, option_c, option_d].includes(correct_answer)) {
    alert('Correct answer must match one of the options!');
    return;
  }
  
  const questions = JSON.parse(localStorage.getItem('questions')) || [];
  const question_id = questions.length ? Math.max(...questions.map(q => q.question_id)) + 1 : 1;
  
  questions.push({
    question_id,
    exam_id,
    question_text,
    option_a,
    option_b,
    option_c,
    option_d,
    correct_answer
  });
  
  localStorage.setItem('questions', JSON.stringify(questions));
  
  // Show success and reset form
  alert('Question added successfully!');
  document.getElementById('questionForm').reset();
  document.getElementById('questionForm').classList.remove('was-validated');
}

// Navigation Functions
function goBack() {
  window.location.href = 'manage-exams.html';
}

function done() {
  window.location.href = 'manage-exams.html';
}

function logout() {
  localStorage.removeItem('session');
  window.location.href = 'admin-login.html';
}