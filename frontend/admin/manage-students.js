// Manage Students Page Logic
(function() {
  // Session check
  const session = JSON.parse(localStorage.getItem('session'));
  if (!session || session.role !== 'admin') {
    window.location.href = '../admin-login.html';
    return;
  }

  function renderTable() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const students = users.filter(u => u.role === 'student');
    const tbody = document.getElementById('studentsTable');
    tbody.innerHTML = '';
    students.forEach(student => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td class="px-4 py-2 border-b">${student.username}</td>
        <td class="px-4 py-2 border-b">${student.name}</td>
        <td class="px-4 py-2 border-b">${student.age}</td>
        <td class="px-4 py-2 border-b">
          <button class="text-blue-600 mr-2" onclick="editStudent('${student.username}')">Edit</button>
          <button class="text-red-600" onclick="deleteStudent('${student.username}')">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  window.editStudent = function(username) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const student = users.find(u => u.username === username);
    if (!student) return;
    document.getElementById('editUsername').value = student.username;
    document.getElementById('editName').value = student.name;
    document.getElementById('editAge').value = student.age;
    document.getElementById('editModal').classList.remove('hidden');
  };

  window.deleteStudent = function(username) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    let users = JSON.parse(localStorage.getItem('users')) || [];
    users = users.filter(u => u.username !== username);
    localStorage.setItem('users', JSON.stringify(users));
    renderTable();
  };

  document.getElementById('editStudentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('editUsername').value;
    const name = document.getElementById('editName').value.trim();
    const age = parseInt(document.getElementById('editAge').value, 10);
    if (!name || !age || age < 1) {
      alert('Please fill all fields correctly.');
      return;
    }
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const idx = users.findIndex(u => u.username === username);
    if (idx !== -1) {
      users[idx].name = name;
      users[idx].age = age;
      localStorage.setItem('users', JSON.stringify(users));
    }
    document.getElementById('editModal').classList.add('hidden');
    renderTable();
  });

  document.getElementById('cancelEdit').onclick = function() {
    document.getElementById('editModal').classList.add('hidden');
  };

  renderTable();
})();

function logout() {
  localStorage.removeItem('session');
  window.location.href = '../admin-login.html';
}
