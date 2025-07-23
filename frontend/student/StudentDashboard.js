// Student Dashboard session check and exam list
(function() {
  const session = JSON.parse(localStorage.getItem('session'));
  if (!session || session.role !== 'student') {
    window.location.href = 'StudentLogin.html';
    return;
  }
  // Optionally, render dashboard content here or use inline script as in your current file
})();
