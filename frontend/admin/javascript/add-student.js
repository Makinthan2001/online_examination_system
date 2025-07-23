// Admin Session Check
function checkAdminSession() {
  const session = JSON.parse(localStorage.getItem('session'));
  if (!session || session.role !== 'admin') {
    window.location.href = 'admin-login.html';
    return false;
  }
  return true;
}

// Initialize Page
document.addEventListener('DOMContentLoaded', function() {
  if (!checkAdminSession()) return;
  
  // Setup form validation and submission
  setupStudentForm();
});

// Setup Form Submission
function setupStudentForm() {
  const form = document.getElementById('studentForm');
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }
    
    addStudent();
  });
}

// Add New Student
function addStudent() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const name = document.getElementById('name').value.trim();
  const age = document.getElementById('age').value;
  
  // Get existing users
  const users = JSON.parse(localStorage.getItem('users')) || [];
  
  // Check if username exists
  if (users.some(u => u.username === username)) {
    alert('Username already exists. Please choose another.');
    return;
  }
  
  // Age validation
  const ageNum = age ? parseInt(age) : null;
  if (ageNum && (ageNum < 1 || ageNum > 120)) {
    alert('Please enter a valid age between 1 and 120.');
    return;
  }
  
  // Create new student object
  const newStudent = {
    username,
    password,
    name: name || null,
    age: ageNum,
    role: 'student'
  };
  
  // Save to localStorage
  users.push(newStudent);
  localStorage.setItem('users', JSON.stringify(users));
  
  // Show success and redirect
  alert('Student added successfully!');
  window.location.href = 'manage-students.html';
}

// Logout Function
function logout() {
  localStorage.removeItem('session');
  window.location.href = 'admin-login.html';
}