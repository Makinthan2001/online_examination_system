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