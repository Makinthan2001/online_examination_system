// Dummy student login functionality

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('studentLoginForm');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    if (username === 'student' && password === 'student123') {
      window.location.href = 'StudentDashboard.html';
    } else {
      alert('Invalid username or password');
    }
  });
});
