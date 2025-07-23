document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('adminLoginForm');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();
      
      // Check credentials (in a real app, this would be server-side)
      if ((username === 'admin1' && password === 'admin123') || 
          (username === 'admin' && password === 'admin123')) {
        
        // Create admin session
        localStorage.setItem('session', JSON.stringify({
          username: username,
          role: 'admin',
          loggedIn: true,
          timestamp: new Date().getTime()
        }));
        
        // Redirect to dashboard
        window.location.href = 'admin-dashboard.html';
      } else {
        alert('Invalid credentials. Try: admin1/admin123 or admin/admin123');
      }
    });
  }
});