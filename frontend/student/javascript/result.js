document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  const studentSession = JSON.parse(localStorage.getItem('studentSession'));
  if (!studentSession || !studentSession.loggedIn) {
    window.location.href = 'login.html';
    return;
  }

  // Get exam ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const examId = parseInt(urlParams.get('examId'));
  
  if (!examId) {
    window.location.href = 'dashboard.html';
    return;
  }

  // Find the result
  const results = JSON.parse(localStorage.getItem('examResults')) || [];
  const result = results.find(r => r.examId === examId);
  
  if (!result) {
    window.location.href = 'dashboard.html';
    return;
  }

  // Display summary
  document.getElementById('examName').textContent = result.examName;
  document.getElementById('scoreDisplay').textContent = `${result.score}/${result.totalQuestions}`;
  document.getElementById('resultSummary').textContent = 
    `Completed on ${new Date(result.date).toLocaleString()}`;

  // Display question details
  const questionResults = document.getElementById('questionResults');
  
  result.answers.forEach((answer, index) => {
    const questionDiv = document.createElement('div');
    questionDiv.className = `card mb-3 ${answer.isCorrect ? 'correct-answer' : 'incorrect-answer'}`;
    questionDiv.innerHTML = `
      <div class="card-body">
        <h5 class="card-title">Question ${index + 1}</h5>
        <p class="card-text">
          <i class="fas ${answer.isCorrect ? 'fa-check text-success' : 'fa-xmark text-danger'} me-2"></i>
          Your answer: <strong>${answer.selectedAnswer !== null ? 
            String.fromCharCode(65 + answer.selectedAnswer) : 'Not answered'}</strong>
        </p>
        <p class="card-text">
          Correct answer: <strong>${String.fromCharCode(65 + answer.correctAnswer)}</strong>
        </p>
      </div>
    `;
    questionResults.appendChild(questionDiv);
  });
});