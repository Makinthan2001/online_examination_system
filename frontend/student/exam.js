// Exam Page Logic
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
    document.getElementById('exam-container').innerHTML = '<p class="text-red-600 font-semibold">Invalid exam.</p>';
    return;
  }
  // Check if already attempted
  const results = JSON.parse(localStorage.getItem('results')) || [];
  if (results.some(r => r.username === session.username && r.exam_id === exam_id)) {
    document.getElementById('exam-container').innerHTML = '<p class="text-green-600 font-semibold">You have already attempted this exam.</p>';
    return;
  }
  // Get questions
  const questions = (JSON.parse(localStorage.getItem('questions')) || []).filter(q => q.exam_id === exam_id);
  if (!questions.length) {
    document.getElementById('exam-container').innerHTML = '<p class="text-gray-600">No questions found for this exam.</p>';
    return;
  }
  // Render form
  const form = document.createElement('form');
  form.className = 'space-y-6 bg-white p-6 rounded shadow max-w-2xl mx-auto';
  form.innerHTML = `<h1 class='text-2xl font-bold mb-4'>${questions[0].exam_name || 'Exam'}</h1>` +
    questions.map((q, i) => `
      <div>
        <p class='font-semibold mb-2'>Q${i+1}. ${q.question_text}</p>
        <div class='space-y-1'>
          <label><input type='radio' name='q${q.question_id}' value='${q.option_a}' required> ${q.option_a}</label><br>
          <label><input type='radio' name='q${q.question_id}' value='${q.option_b}'> ${q.option_b}</label><br>
          <label><input type='radio' name='q${q.question_id}' value='${q.option_c}'> ${q.option_c}</label><br>
          <label><input type='radio' name='q${q.question_id}' value='${q.option_d}'> ${q.option_d}</label>
        </div>
      </div>
    `).join('') +
    `<button type='submit' class='w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700'>Submit Exam</button>`;
  form.onsubmit = function(e) {
    e.preventDefault();
    let score = 0;
    questions.forEach(q => {
      const ans = form[`q${q.question_id}`].value;
      if (ans === q.correct_answer) score++;
    });
    results.push({
      username: session.username,
      exam_id,
      mark: score,
      total_questions: questions.length,
      attempted_at: new Date().toISOString()
    });
    localStorage.setItem('results', JSON.stringify(results));
    window.location.href = `result.html?exam_id=${exam_id}`;
  };
  document.getElementById('exam-container').appendChild(form);
})();
