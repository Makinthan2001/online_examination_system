document.addEventListener('DOMContentLoaded', function() {
  // Load sidebar with correct path (from root to partials)
  fetch('partials/sidebar.html')
    .then(response => {
      if (!response.ok) throw new Error('Sidebar not found');
      return response.text();
    })
    .then(html => {
      document.getElementById('sidebar').innerHTML = html;
      
      // Set active link
      document.querySelector('#resultsLink').classList.add('active');
      
      // Set student name if needed
      const student = JSON.parse(localStorage.getItem('studentSession'));
      if (student) {
        document.getElementById('studentName').textContent = student.username;
      }
      
      // Initialize results after sidebar is loaded
      initResults();
    })
    .catch(error => {
      console.error('Error loading sidebar:', error);
      document.getElementById('sidebar').innerHTML = `
        <div class="alert alert-danger">
          Navigation failed to load. <a href="dashboard.html">Refresh</a>
        </div>
      `;
      initResults();
    });

  function initResults() {
    // Get exam ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const examId = parseInt(urlParams.get('examId'));
    
    if (!examId) {
      // If no examId, show all results
      showAllResults();
      return;
    }

    // Find the specific result
    const results = JSON.parse(localStorage.getItem('examResults')) || [];
    const result = results.find(r => r.examId === examId);
    
    if (!result) {
      window.location.href = 'dashboard.html';
      return;
    }

    // Display single exam result
    displaySingleResult(result);
  }

  function showAllResults() {
    const results = JSON.parse(localStorage.getItem('examResults')) || [];
    const questionResults = document.getElementById('questionResults');
    
    if (results.length === 0) {
      questionResults.innerHTML = `
        <div class="alert alert-info">
          No exam results available. Please take an exam first.
        </div>
      `;
      return;
    }

    questionResults.innerHTML = '<h4 class="mb-4">All Exam Results</h4>';
    
    results.forEach(result => {
      const resultCard = document.createElement('div');
      resultCard.className = 'card mb-4';
      resultCard.innerHTML = `
        <div class="card-body">
          <div class="d-flex justify-content-between">
            <h5>${result.examName}</h5>
            <a href="my-result.html?examId=${result.examId}" class="btn btn-sm btn-outline-primary">
              View Details
            </a>
          </div>
          <p class="mb-1">Score: ${result.score}/${result.totalQuestions}</p>
          <small class="text-muted">Completed on ${new Date(result.date).toLocaleString()}</small>
        </div>
      `;
      questionResults.appendChild(resultCard);
    });
  }

  function displaySingleResult(result) {
    // Display summary
    document.getElementById('examName').textContent = result.examName;
    document.getElementById('scoreDisplay').textContent = `${result.score}/${result.totalQuestions}`;
    document.getElementById('resultSummary').textContent = 
      `Completed on ${new Date(result.date).toLocaleString()}`;

    // Display question details
    const questionResults = document.getElementById('questionResults');
    questionResults.innerHTML = '<h4 class="mb-3"><i class="fas fa-list-check me-2"></i>Question Details</h4>';
    
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

    // Add back button with corrected path
    const backButton = document.createElement('a');
    backButton.href = 'my-result.html';
    backButton.className = 'btn btn-secondary mt-3';
    backButton.innerHTML = '<i class="fas fa-arrow-left me-2"></i> Back to All Results';
    questionResults.appendChild(backButton);
  }
});