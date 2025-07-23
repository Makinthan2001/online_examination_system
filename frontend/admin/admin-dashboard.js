// Admin Dashboard Script
document.addEventListener('DOMContentLoaded', function() {
  // Check admin session
  checkAdminSession();
  
  // Set current date
  document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Load dashboard data
  loadDashboardData();
});

function checkAdminSession() {
  const session = JSON.parse(localStorage.getItem('session'));
  
  if (!session || session.role !== 'admin') {
    window.location.href = 'admin-login.html';
    return;
  }
  
  // Display admin username
  document.getElementById('admin-username').textContent = session.username;
}

function logout() {
  localStorage.removeItem('session');
  window.location.href = 'admin-login.html';
}

function loadDashboardData() {
  // Get data from localStorage
  const users = JSON.parse(localStorage.getItem('users') || '[]').filter(u => u.role === 'student');
  const exams = JSON.parse(localStorage.getItem('exams') || '[]');
  const results = JSON.parse(localStorage.getItem('results') || '[]');
  
  // Calculate average score
  const avgScore = results.length 
    ? Math.round(results.reduce((acc, r) => acc + (r.mark / r.total_questions) * 100, 0) / results.length)
    : 0;
  
  // Stats data
  const stats = [
    { title: "Total Students", value: users.length, color: "bg-blue-100 text-blue-700", icon: "fas fa-users" },
    { title: "Total Exams", value: exams.length, color: "bg-green-100 text-green-700", icon: "fas fa-book" },
    { title: "Exam Attempts", value: results.length, color: "bg-yellow-100 text-yellow-700", icon: "fas fa-clipboard-list" },
    { title: "Average Score", value: avgScore + "%", color: "bg-purple-100 text-purple-700", icon: "fas fa-chart-line" }
  ];
  
  // Render stats cards
  const statsSection = document.getElementById('stats-section');
  statsSection.innerHTML = stats.map(stat => `
    <div class="bg-white p-6 rounded-xl shadow-sm flex justify-between items-center">
      <div>
        <p class="text-sm text-gray-500">${stat.title}</p>
        <p class="text-2xl font-bold text-gray-800">${stat.value}</p>
      </div>
      <div class="p-3 rounded-full ${stat.color}">
        <i class="${stat.icon}"></i>
      </div>
    </div>
  `).join('');
  
  // Render recent activity
  const activitySection = document.getElementById('recent-activity');
  
  if (results.length > 0) {
    activitySection.innerHTML = results
      .slice(-5)
      .reverse()
      .map(result => {
        const percent = Math.round((result.mark / result.total_questions) * 100);
        const exam = exams.find(e => e.id === result.exam_id);
        const examTitle = exam ? exam.title : `Exam #${result.exam_id}`;
        
        return `
        <div class="p-4 hover:bg-gray-50 transition">
          <div class="flex justify-between items-center">
            <div class="flex items-center space-x-4">
              <div class="p-2 rounded-full bg-blue-100 text-blue-600">
                <i class="fas fa-clipboard-check"></i>
              </div>
              <div>
                <p class="font-medium">${result.username}</p>
                <p class="text-sm text-gray-500">Completed ${examTitle}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="font-medium">${result.mark}/${result.total_questions}</p>
              <p class="text-sm ${percent >= 50 ? 'text-green-600' : 'text-red-600'}">
                ${percent}% ${percent >= 50 ? '👍' : '👎'}
              </p>
            </div>
          </div>
        </div>
        `;
      })
      .join('');
  } else {
    activitySection.innerHTML = `
      <div class="p-8 text-center text-gray-500">
        <i class="fas fa-info-circle text-2xl mb-2"></i>
        <p>No recent activity found</p>
      </div>
    `;
  }
}