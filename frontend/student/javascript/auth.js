document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('loginForm');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      
      // Simple validation
      if (!username || !password) {
        alert('Please enter both username and password');
        return;
      }
      
      // Check credentials
      if ((username === 'student' && password === 'student123') || 
          (username === 'stud01' && password === '1234')) {
        // Store session
        localStorage.setItem('studentSession', JSON.stringify({
          username: username,
          loggedIn: true,
          timestamp: new Date().getTime()
        }));
        
        // Initialize exam data if not exists
        if (!localStorage.getItem('examResults')) {
          localStorage.setItem('examResults', JSON.stringify([]));
        }
        
        window.location.href = 'dashboard.html';
      } else {
        alert('Invalid username or password');
      }
    });
  }
});

// Add this to your existing auth.js file
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

// Call this function after loading the sidebar in each of your JS files
// For example, in dashboard.js, exam.js, and my-result.js, after loading the sidebar:
// Add this inside the .then() block after setting the sidebar HTML:
setupLogoutButton();