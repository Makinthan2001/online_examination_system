document.addEventListener('DOMContentLoaded', function() {
  if (!checkAdminSession()) return;
  setCurrentDate();
  loadDashboardData();
});

function checkAdminSession() {
  const session = JSON.parse(localStorage.getItem('session'));
  if (!session || session.role !== 'admin') {
    window.location.href = 'admin-login.html';
    return false;
  }
  document.getElementById('admin-username').textContent = session.username;
  return true;
}

function setCurrentDate() {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', options);
}

function logout() {
  localStorage.removeItem('session');
  window.location.href = 'admin-login.html';
}

function loadDashboardData() {
  // Debug: Check what's in localStorage
  console.log("LocalStorage contents:", localStorage);
  
  const users = JSON.parse(localStorage.getItem('users') || '[]').filter(u => u.role === 'student');
  const exams = JSON.parse(localStorage.getItem('exams') || '[]');
  let results = JSON.parse(localStorage.getItem('results') || '[]');

  // If no results, create sample data for testing
  if (results.length === 0) {
    console.warn("No results found, creating sample data");
    results = [
      {
        username: "sample_student",
        exam_id: exams.length > 0 ? exams[0].id : 1,
        mark: 7,
        total_questions: 10,
        timestamp: new Date().getTime()
      }
    ];
    localStorage.setItem('results', JSON.stringify(results));
  }

  // Debug: Print the data being used
  console.log("Users:", users);
  console.log("Exams:", exams);
  console.log("Results:", results);

  const avgScore = results.length 
    ? Math.round(results.reduce((acc, r) => acc + (r.mark / r.total_questions) * 100, 0) / results.length)
    : 0;

  renderStats(users, exams, results, avgScore);
  renderRecentActivities(results, exams);
}

function renderStats(users, exams, results, avgScore) {
  const stats = [
    { title: "Total Students", value: users.length, color: "bg-blue-100", icon: "fas fa-users" },
    { title: "Total Exams", value: exams.length, color: "bg-green-100", icon: "fas fa-book" },
    { title: "Exam Attempts", value: results.length, color: "bg-yellow-100", icon: "fas fa-clipboard-list" },
    { title: "Average Score", value: avgScore + "%", color: "bg-purple-100", icon: "fas fa-chart-line" }
  ];

  document.getElementById('stats-section').innerHTML = stats.map(stat => `
    <div class="col-md-6 col-lg-3">
      <div class="card h-100">
        <div class="card-body d-flex justify-content-between align-items-center">
          <div>
            <h6 class="card-subtitle mb-2 text-muted">${stat.title}</h6>
            <h3 class="card-title mb-0">${stat.value}</h3>
          </div>
          <div class="p-3 rounded-circle ${stat.color}">
            <i class="${stat.icon}"></i>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

function renderRecentActivities(results, exams) {
  const activitySection = document.getElementById('recent-activity');
  
  if (results.length > 0) {
    activitySection.innerHTML = results
      .slice(-5)
      .reverse()
      .map(result => {
        const percent = Math.round((result.mark / result.total_questions) * 100);
        const exam = exams.find(e => e.id === result.exam_id);
        const examTitle = exam ? exam.title : `Exam #${result.exam_id}`;
        const textClass = percent >= 50 ? 'text-success' : 'text-danger';
        
        return `
        <div class="list-group-item">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
              <div class="me-3 p-2 rounded-circle bg-primary bg-opacity-10 text-primary">
                <i class="fas fa-clipboard-check"></i>
              </div>
              <div>
                <h6 class="mb-0">${result.username}</h6>
                <small class="text-muted">Completed ${examTitle}</small>
              </div>
            </div>
            <div class="text-end">
              <div class="fw-semibold">${result.mark}/${result.total_questions}</div>
              <small class="${textClass}">
                ${percent}% ${percent >= 50 ? '👍' : '👎'}
              </small>
            </div>
          </div>
        </div>
        `;
      })
      .join('');
  } else {
    activitySection.innerHTML = `
      <div class="list-group-item text-center py-4">
        <i class="fas fa-info-circle fa-2x text-muted mb-2"></i>
        <p class="text-muted mb-0">No recent activity found</p>
      </div>
    `;
  }
}