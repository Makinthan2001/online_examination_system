document.addEventListener('DOMContentLoaded', function() {
  // Load sidebar with correct path (from dashboard.html to partials/sidebar.html)
  fetch('partials/sidebar.html')
    .then(response => {
      if (!response.ok) throw new Error('Sidebar not found');
      return response.text();
    })
    .then(html => {
      document.getElementById('sidebar').innerHTML = html;
      
      // Set active link
      document.querySelector('#dashboardLink').classList.add('active');
      
      // Set student name if needed
      const student = JSON.parse(localStorage.getItem('studentSession'));
      if (student) {
        document.getElementById('studentName').textContent = student.username;
      }
      
      // Initialize logout button
      setupLogoutButton();
      
      // Load exams
      loadExams();
    })
    .catch(error => {
      console.error('Error loading sidebar:', error);
      document.getElementById('sidebar').innerHTML = `
        <div class="alert alert-danger">
          Navigation failed to load. <a href="dashboard.html">Refresh</a>
        </div>
      `;
      loadExams();
    });

  function setupLogoutButton() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Clear the student session
        localStorage.removeItem('studentSession');
        
        // Redirect to login page
        window.location.href = 'StudentLogin.html';
      });
    }
  }

  function loadExams() {
    const exams = [
      { id: 1, name: 'JavaScript Basics', subject: 'JavaScript', duration: 30, questions: 5 },
      { id: 2, name: 'HTML Fundamentals', subject: 'HTML', duration: 20, questions: 3 },
      { id: 3, name: 'CSS Styling', subject: 'CSS', duration: 25, questions: 4 }
    ];

    const results = JSON.parse(localStorage.getItem('examResults')) || [];
    const examList = document.getElementById('examList');

    examList.innerHTML = '';

    exams.forEach(exam => {
      const isAttempted = results.some(r => r.examId === exam.id);
      
      const examCard = document.createElement('div');
      examCard.className = 'col-md-6 col-lg-4';
      examCard.innerHTML = `
        <div class="card exam-card h-100">
          <div class="card-body">
            <div class="d-flex justify-content-between">
              <h5 class="card-title">${exam.name}</h5>
              ${isAttempted ? '<span class="badge bg-success">Attempted</span>' : ''}
            </div>
            <p class="text-muted">${exam.subject}</p>
            <ul class="list-unstyled small">
              <li><i class="fas fa-clock me-2"></i> Duration: ${exam.duration} mins</li>
              <li><i class="fas fa-question-circle me-2"></i> Questions: ${exam.questions}</li>
            </ul>
            ${!isAttempted ? 
              `<a href="exam.html?examId=${exam.id}" class="btn btn-primary btn-sm">Start Exam</a>` : 
              `<a href="my-result.html?examId=${exam.id}" class="btn btn-outline-secondary btn-sm">View Result</a>`}
          </div>
        </div>
      `;
      
      examList.appendChild(examCard);
    });
  }
});