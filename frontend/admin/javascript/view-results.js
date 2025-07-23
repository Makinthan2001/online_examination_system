document.addEventListener('DOMContentLoaded', function() {
  // Check admin session
  const session = JSON.parse(localStorage.getItem('session') || '{}');
  if (!session || session.role !== 'admin') {
    window.location.href = 'admin-login.html';
    return;
  }

  // Load and render results
  renderResults();

  // Make logout function available globally
  window.logout = logout;
});

function renderResults() {
  const results = JSON.parse(localStorage.getItem('results') || []);
  const exams = JSON.parse(localStorage.getItem('exams') || []);
  const resultsTable = document.getElementById('resultsTable');
  const resultCount = document.getElementById('resultCount');
  const emptyState = document.getElementById('emptyState');

  // Clear existing content
  resultsTable.innerHTML = '';
  resultCount.textContent = results.length;

  if (results.length === 0) {
    emptyState.classList.remove('d-none');
    return;
  }

  emptyState.classList.add('d-none');

  results.forEach(result => {
    const exam = exams.find(e => e.exam_id === result.exam_id);
    const percentage = Math.round((result.mark / result.total_questions) * 100);
    const percentageClass = percentage >= 50 ? 'text-pass' : 'text-fail';

    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="align-middle">${result.username}</td>
      <td class="align-middle">${exam ? exam.exam_name : `Exam #${result.exam_id}`}</td>
      <td class="align-middle">${result.mark}</td>
      <td class="align-middle">${result.total_questions}</td>
      <td class="align-middle">${new Date(result.attempted_at).toLocaleString()}</td>
      <td class="align-middle text-end ${percentageClass}">
        ${percentage}%
      </td>
    `;
    resultsTable.appendChild(row);
  });
}

function logout() {
  localStorage.removeItem('session');
  window.location.href = 'admin-login.html';
}