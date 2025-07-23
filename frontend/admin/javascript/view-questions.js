// Admin Session Check
function checkAdminSession() {
  const session = JSON.parse(localStorage.getItem('session'));
  if (!session || session.role !== 'admin') {
    window.location.href = 'admin-login.html';
    return false;
  }
  return true;
}

let currentExamId = null;
let currentExam = null;

// Initialize Page
document.addEventListener('DOMContentLoaded', function() {
  if (!checkAdminSession()) return;
  
  // Get exam ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  currentExamId = urlParams.get('examId');
  
  if (!currentExamId) {
    window.location.href = 'manage-exams.html';
    return;
  }
  
  // Load exam details and questions
  loadExamDetails();
  loadQuestions();
  
  // Setup add question button
  document.getElementById('addQuestionBtn').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = `add-question.html?examId=${currentExamId}`;
  });
  
  document.getElementById('addFirstQuestionBtn').addEventListener('click', function(e) {
    e.preventDefault();
    window.location.href = `add-question.html?examId=${currentExamId}`;
  });
});

// Load Exam Details
function loadExamDetails() {
  const exams = JSON.parse(localStorage.getItem('exams')) || [];
  currentExam = exams.find(exam => exam.exam_id.toString() === currentExamId);
  
  if (currentExam) {
    document.getElementById('examTitle').textContent = `${currentExam.exam_name} Questions`;
  }
}

// Load Questions
function loadQuestions() {
  const questions = JSON.parse(localStorage.getItem('questions')) || [];
  const examQuestions = questions.filter(q => q.exam_id.toString() === currentExamId);
  
  const questionsList = document.getElementById('questionsList');
  const emptyState = document.getElementById('emptyQuestions');
  
  questionsList.innerHTML = '';
  
  if (examQuestions.length === 0) {
    emptyState.classList.remove('d-none');
    return;
  }
  
  emptyState.classList.add('d-none');
  
  examQuestions.forEach((question, index) => {
    const questionCard = document.createElement('div');
    questionCard.className = 'card mb-3';
    questionCard.innerHTML = `
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h6 class="card-title mb-0">Question ${index + 1}</h6>
          <div class="d-flex gap-2">
            <button onclick="editQuestion(${question.question_id})" class="btn btn-sm btn-warning">
              <i class="fas fa-edit me-1"></i> Edit
            </button>
            <button onclick="deleteQuestion(${question.question_id})" class="btn btn-sm btn-danger">
              <i class="fas fa-trash me-1"></i> Delete
            </button>
          </div>
        </div>
        <p class="card-text mb-3">${question.question_text}</p>
        <div class="row g-2">
          <div class="col-md-6">
            <div class="p-2 ${question.correct_answer === question.option_a ? 'bg-light-success' : 'bg-light'} rounded">
              <strong>A:</strong> ${question.option_a}
              ${question.correct_answer === question.option_a ? '<span class="badge bg-success ms-2">Correct</span>' : ''}
            </div>
          </div>
          <div class="col-md-6">
            <div class="p-2 ${question.correct_answer === question.option_b ? 'bg-light-success' : 'bg-light'} rounded">
              <strong>B:</strong> ${question.option_b}
              ${question.correct_answer === question.option_b ? '<span class="badge bg-success ms-2">Correct</span>' : ''}
            </div>
          </div>
          <div class="col-md-6">
            <div class="p-2 ${question.correct_answer === question.option_c ? 'bg-light-success' : 'bg-light'} rounded">
              <strong>C:</strong> ${question.option_c}
              ${question.correct_answer === question.option_c ? '<span class="badge bg-success ms-2">Correct</span>' : ''}
            </div>
          </div>
          <div class="col-md-6">
            <div class="p-2 ${question.correct_answer === question.option_d ? 'bg-light-success' : 'bg-light'} rounded">
              <strong>D:</strong> ${question.option_d}
              ${question.correct_answer === question.option_d ? '<span class="badge bg-success ms-2">Correct</span>' : ''}
            </div>
          </div>
        </div>
      </div>
    `;
    questionsList.appendChild(questionCard);
  });
}

// Edit Question
function editQuestion(questionId) {
  const questions = JSON.parse(localStorage.getItem('questions')) || [];
  const question = questions.find(q => q.question_id === questionId);
  
  if (!question) return;
  
  // Populate modal fields
  document.getElementById('editQuestionId').value = question.question_id;
  document.getElementById('editQuestionText').value = question.question_text;
  document.getElementById('editOptionA').value = question.option_a;
  document.getElementById('editOptionB').value = question.option_b;
  document.getElementById('editOptionC').value = question.option_c;
  document.getElementById('editOptionD').value = question.option_d;
  document.getElementById('editCorrectAnswer').value = question.correct_answer;
  
  // Show modal
  const modal = new bootstrap.Modal(document.getElementById('editQuestionModal'));
  modal.show();
}

// Save Question Changes
function saveQuestionChanges() {
  const questionId = parseInt(document.getElementById('editQuestionId').value);
  const questionText = document.getElementById('editQuestionText').value.trim();
  const optionA = document.getElementById('editOptionA').value.trim();
  const optionB = document.getElementById('editOptionB').value.trim();
  const optionC = document.getElementById('editOptionC').value.trim();
  const optionD = document.getElementById('editOptionD').value.trim();
  const correctAnswer = document.getElementById('editCorrectAnswer').value.trim();
  
  // Validate correct answer
  if (![optionA, optionB, optionC, optionD].includes(correctAnswer)) {
    alert('Correct answer must match one of the options!');
    return;
  }
  
  let questions = JSON.parse(localStorage.getItem('questions')) || [];
  const questionIndex = questions.findIndex(q => q.question_id === questionId);
  
  if (questionIndex !== -1) {
    questions[questionIndex] = {
      ...questions[questionIndex],
      question_text: questionText,
      option_a: optionA,
      option_b: optionB,
      option_c: optionC,
      option_d: optionD,
      correct_answer: correctAnswer
    };
    
    localStorage.setItem('questions', JSON.stringify(questions));
    
    // Close modal and refresh questions list
    bootstrap.Modal.getInstance(document.getElementById('editQuestionModal')).hide();
    loadQuestions();
    
    alert('Question updated successfully!');
  }
}

// Delete Question
function deleteQuestion(questionId) {
  if (!confirm('Are you sure you want to delete this question?')) return;
  
  let questions = JSON.parse(localStorage.getItem('questions')) || [];
  questions = questions.filter(q => q.question_id !== questionId);
  
  localStorage.setItem('questions', JSON.stringify(questions));
  loadQuestions();
  
  alert('Question deleted successfully!');
}

// Navigation Functions
function goBack() {
  window.location.href = 'manage-exams.html';
}

function logout() {
  localStorage.removeItem('session');
  window.location.href = 'admin-login.html';
}