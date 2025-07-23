// Result Page Logic
(function() {
  const session = JSON.parse(localStorage.getItem('session'));
  if (!session || session.role !== 'student') {
    window.location.href = 'StudentLogin.html';
    return;
  }
  // Get exam_id from query string
  const params = new URLSearchParams(window.location.search);
  const exam_id = parseInt(params.get('exam_id'), 10);
  if (!exam_id) {
    document.getElementById('result-container').innerHTML = '<p class="text-red-600 font-semibold">Invalid exam.</p>';
    return;
  }
  const results = JSON.parse(localStorage.getItem('results')) || [];
  const result = results.find(r => r.username === session.username && r.exam_id === exam_id);
  if (!result) {
    document.getElementById('result-container').innerHTML = '<p class="text-gray-600">No result found for this exam.</p>';
    return;
  }
  const questions = (JSON.parse(localStorage.getItem('questions')) || []).filter(q => q.exam_id === exam_id);
  document.getElementById('result-container').innerHTML = `
    <div class='bg-white p-6 rounded shadow max-w-2xl mx-auto'>
      <h1 class='text-2xl font-bold mb-4'>Exam Result</h1>
      <p class='mb-2'><b>Score:</b> ${result.mark} / ${result.total_questions} (${Math.round((result.mark/result.total_questions)*100)}%)</p>
      <p class='mb-4'><b>Attempted At:</b> ${new Date(result.attempted_at).toLocaleString()}</p>
      <h2 class='text-lg font-semibold mb-2'>Questions & Answers</h2>
      <ol class='list-decimal pl-6 space-y-2'>
        ${questions.map((q, i) => {
          const userAns = 'N/A'; // Not tracked per question in this mockup
          return `<li><b>Q${i+1}:</b> ${q.question_text}<br><b>Correct Answer:</b> ${q.correct_answer}</li>`;
        }).join('')}
      </ol>
      <a href='StudentDashboard.html' class='inline-block mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'>Back to Dashboard</a>
    </div>
  `;
})();
