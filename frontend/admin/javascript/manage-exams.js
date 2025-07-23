document.addEventListener('DOMContentLoaded', function() {
  // Check admin session
  const session = JSON.parse(localStorage.getItem('session'));
  if (!session || session.role !== 'admin') {
    window.location.href = 'admin-login.html';
    return;
  }

  // Load and render exams
  renderExams();
});

function getExams() {
  return JSON.parse(localStorage.getItem('exams') || '[]');
}

function getQuestions(examId) {
  const allQuestions = JSON.parse(localStorage.getItem('questions') || '[]');
  return allQuestions.filter(q => q.exam_id === examId);
}

function renderExams() {
  const examList = document.getElementById('examList');
  const emptyState = document.getElementById('emptyState');
  const exams = getExams();

  // Clear existing content
  examList.innerHTML = '';

  if (exams.length === 0) {
    emptyState.classList.remove('d-none');
    return;
  }

  emptyState.classList.add('d-none');

  exams.forEach(exam => {
    const questionCount = getQuestions(exam.exam_id).length;
    const statusClass = questionCount > 0 ? 'badge bg-success' : 'badge bg-warning text-dark';
    const statusText = questionCount > 0 ? 'Ready' : 'Draft';

    const examCard = document.createElement('div');
    examCard.className = 'col';
    examCard.innerHTML = `
      <div class="card h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h5 class="card-title mb-1">${exam.exam_name}</h5>
              <p class="card-subtitle text-muted small">${exam.subject}</p>
            </div>
            <span class="badge ${statusClass}">${statusText}</span>
          </div>
          
          <ul class="list-unstyled small text-muted mb-3">
            <li class="mb-1"><i class="fas fa-clock me-2"></i> Duration: ${exam.duration} minutes</li>
            <li><i class="fas fa-question-circle me-2"></i> Questions: ${questionCount}</li>
          </ul>
          
          ${questionCount === 0 ? `
            <div class="alert alert-warning alert-dismissible fade show py-2 mb-3" role="alert">
              <small>This exam has no questions yet.</small>
            </div>
          ` : ''}
          
          <div class="d-grid gap-2">
            <a href="add-question.html?examId=${exam.exam_id}" class="btn btn-sm btn-primary">
              <i class="fas fa-plus me-1"></i> ${questionCount === 0 ? 'Add Questions' : 'Add More'}
            </a>
            
            <div class="d-flex gap-2 mt-2">
              ${questionCount > 0 ? `
                <button onclick="viewQuestions('${exam.exam_id}')" class="btn btn-sm btn-info flex-grow-1">
                  <i class="fas fa-eye me-1"></i> View
                </button>
              ` : ''}
              
              
              <button onclick="deleteExam('${exam.exam_id}')" class="btn btn-sm btn-danger">
                <i class="fas fa-trash"></i> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    examList.appendChild(examCard);
  });
}

function viewQuestions(examId) {
  window.location.href = `view-questions.html?examId=${examId}`;
}

function deleteExam(examId) {
  if (!confirm('Are you sure you want to delete this exam and all its questions?')) return;
  
  // Remove exam
  let exams = getExams();
  exams = exams.filter(exam => exam.exam_id.toString() !== examId.toString());
  localStorage.setItem('exams', JSON.stringify(exams));
  
  // Remove associated questions
  let questions = JSON.parse(localStorage.getItem('questions')) || [];
  questions = questions.filter(q => q.exam_id.toString() !== examId.toString());
  localStorage.setItem('questions', JSON.stringify(questions));
  
  // Refresh the list
  renderExams();
}

function logout() {
  localStorage.removeItem('session');
  window.location.href = 'admin-login.html';
}