// Add Student Page Logic
(function() {
  // Session check
  const session = JSON.parse(localStorage.getItem('session'));
  if (!session || session.role !== 'admin') {
    window.location.href = '../admin-login.html';
    return;
  }

  document.getElementById('addStudentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const name = document.getElementById('name').value.trim();
    const age = parseInt(document.getElementById('age').value, 10);
    if (!username || !password || !name || !age || age < 1) {
      alert('Please fill all fields correctly.');
      return;
    }
    let users = JSON.parse(localStorage.getItem('users')) || [];
    if (users.some(u => u.username === username)) {
      alert('Username already exists.');
      return;
    }
    users.push({ username, password, name, age, role: 'student' });
    localStorage.setItem('users', JSON.stringify(users));
    document.getElementById('successMsg').classList.remove('hidden');
    this.reset();
  });
})();

function logout() {
  localStorage.removeItem('session');
  window.location.href = '../admin-login.html';
}
