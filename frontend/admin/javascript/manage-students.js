document.addEventListener('DOMContentLoaded', function() {
  // Check admin session
  const session = JSON.parse(localStorage.getItem('session') || '{}');
  if (!session || session.role !== 'admin') {
    window.location.href = 'admin-login.html';
    return;
  }

  // Initialize elements
  const searchInput = document.getElementById('searchInput');
  const studentTableBody = document.getElementById('studentTableBody');
  const studentCount = document.getElementById('studentCount');
  const emptyState = document.getElementById('emptyState');
  const emptyTitle = document.getElementById('emptyTitle');
  const emptySub = document.getElementById('emptySub');
  const editModal = new bootstrap.Modal(document.getElementById('editModal'));

  // Initialize the page
  renderStudents();

  // Search functionality
  searchInput.addEventListener('input', renderStudents);

  // Edit form submission
  document.getElementById('editStudentForm').addEventListener('submit', function(e) {
    e.preventDefault();
    saveStudentChanges();
  });

  // Make functions available globally
  window.editStudent = editStudent;
  window.deleteStudent = deleteStudent;
  window.logout = logout;

  function renderStudents() {
    const term = searchInput.value.toLowerCase();
    const students = getStudents().filter(s =>
      s.username.toLowerCase().includes(term) ||
      (s.name && s.name.toLowerCase().includes(term))
    );

    studentTableBody.innerHTML = '';
    studentCount.textContent = students.length;

    if (students.length === 0) {
      emptyState.classList.remove('d-none');
      if (term) {
        emptyTitle.textContent = 'No students found';
        emptySub.textContent = 'Try adjusting your search criteria';
      } else {
        emptyTitle.textContent = 'No students registered';
        emptySub.textContent = 'Get started by adding your first student';
      }
      return;
    } else {
      emptyState.classList.add('d-none');
    }

    students.forEach(student => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="align-middle">${student.username}</td>
        <td class="align-middle">${student.name || 'N/A'}</td>
        <td class="align-middle">${student.age || 'N/A'}</td>
        <td class="align-middle"><span class="badge badge-active">Active</span></td>
        <td class="align-middle text-end">
          <div class="btn-group">
            <button onclick="editStudent('${student.username}')" class="btn btn-sm btn-outline-primary">
              <i class="fas fa-edit"></i>
            </button>
            <button onclick="deleteStudent('${student.username}')" class="btn btn-sm btn-outline-danger">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      `;
      studentTableBody.appendChild(row);
    });
  }

  function getStudents() {
    const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
    return allUsers.filter(user => user.role === 'student');
  }

  function editStudent(username) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const student = users.find(u => u.username === username);
    if (!student) return;

    document.getElementById('editUsername').value = student.username;
    document.getElementById('editName').value = student.name || '';
    document.getElementById('editAge').value = student.age || '';
    editModal.show();
  }

  function saveStudentChanges() {
    const username = document.getElementById('editUsername').value;
    const name = document.getElementById('editName').value.trim();
    const age = parseInt(document.getElementById('editAge').value);

    if (!name || !age || age < 1) {
      alert('Please fill all fields correctly.');
      return;
    }

    let users = JSON.parse(localStorage.getItem('users') || '[]');
    const idx = users.findIndex(u => u.username === username);
    if (idx !== -1) {
      users[idx].name = name;
      users[idx].age = age;
      localStorage.setItem('users', JSON.stringify(users));
      editModal.hide();
      renderStudents();
      alert('Student updated successfully.');
    }
  }

  function deleteStudent(username) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    users = users.filter(u => u.username !== username);
    localStorage.setItem('users', JSON.stringify(users));
    renderStudents();
    alert('Student deleted successfully.');
  }

  function logout() {
    localStorage.removeItem('session');
    window.location.href = 'admin-login.html';
  }
});