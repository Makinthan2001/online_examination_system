document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  const studentSession = JSON.parse(localStorage.getItem('studentSession'));
  if (!studentSession || !studentSession.loggedIn) {
    window.location.href = 'StudentLogin.html';
    return;
  }

  // Load sidebar first
  fetch('partials/sidebar.html')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(html => {
      document.getElementById('sidebar').innerHTML = html;
      
      // Set active link
      const currentPage = window.location.pathname.split('/').pop();
      const activeLink = document.querySelector(`.nav-link[href="${currentPage}"]`);
      if (activeLink) {
        activeLink.classList.add('active');
      }
      
      // Set student name
      document.getElementById('studentName').textContent = studentSession.username;
      
      // Add logout handler
      document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('studentSession');
        localStorage.removeItem('examResults'); // Optional: Clear exam results on logout
        window.location.href = 'login.html';
      });

      // Now load exams after sidebar is set up
      loadExams();
    })
    .catch(error => {
      console.error('Error loading sidebar:', error);
      loadExams(); // Still try to load exams even if sidebar fails
    });

  function loadExams() {
    const exams = [
      { id: 1, name: 'JavaScript Basics', subject: 'JavaScript', duration: 30, questions: 5 },
      { id: 2, name: 'HTML Fundamentals', subject: 'HTML', duration: 20, questions: 3 },
      { id: 3, name: 'CSS Styling', subject: 'CSS', duration: 25, questions: 4 }
    ];

    const results = JSON.parse(localStorage.getItem('examResults')) || [];
    const examList = document.getElementById('examList');

    // Clear existing content
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
              `<a href="result.html?examId=${exam.id}" class="btn btn-outline-secondary btn-sm">View Result</a>`}
          </div>
        </div>
      `;
      
      examList.appendChild(examCard);
    });
  }
});