// View Results Page Logic
(function() {
  // Session check
  const session = JSON.parse(localStorage.getItem('session'));
  if (!session || session.role !== 'admin') {
    window.location.href = '../admin-login.html';
    return;
  }

  const results = JSON.parse(localStorage.getItem('results')) || [];
  const exams = JSON.parse(localStorage.getItem('exams')) || [];
  const tbody = document.getElementById('resultsTable');
  tbody.innerHTML = '';
  results.forEach(r => {
    const exam = exams.find(e => e.exam_id === r.exam_id);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="px-4 py-2 border-b">${r.username}</td>
      <td class="px-4 py-2 border-b">${exam ? exam.exam_name : r.exam_id}</td>
      <td class="px-4 py-2 border-b">${r.mark}</td>
      <td class="px-4 py-2 border-b">${r.total_questions}</td>
      <td class="px-4 py-2 border-b">${new Date(r.attempted_at).toLocaleString()}</td>
    `;
    tbody.appendChild(tr);
  });
})();

function logout() {
  localStorage.removeItem('session');
  window.location.href = '../admin-login.html';
}
