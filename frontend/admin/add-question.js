// Add Question Page Logic
(function() {
  // Session check
  const session = JSON.parse(localStorage.getItem('session'));
  if (!session || session.role !== 'admin') {
    window.location.href = '../admin-login.html';
    return;
  }

  // Populate exam dropdown
  const exams = JSON.parse(localStorage.getItem('exams')) || [];
  const examSelect = document.getElementById('examSelect');
  exams.forEach(exam => {
    const opt = document.createElement('option');
    opt.value = exam.exam_id;
    opt.textContent = `${exam.exam_name} (${exam.subject})`;
    examSelect.appendChild(opt);
  });

  document.getElementById('addQuestionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const exam_id = parseInt(document.getElementById('examSelect').value, 10);
    const question_text = document.getElementById('questionText').value.trim();
    const option_a = document.getElementById('optionA').value.trim();
    const option_b = document.getElementById('optionB').value.trim();
    const option_c = document.getElementById('optionC').value.trim();
    const option_d = document.getElementById('optionD').value.trim();
    const correct_answer = document.getElementById('correctAnswer').value;
    if (!exam_id || !question_text || !option_a || !option_b || !option_c || !option_d || !correct_answer) {
      alert('Please fill all fields correctly.');
      return;
    }
    let questions = JSON.parse(localStorage.getItem('questions')) || [];
    const question_id = questions.length ? Math.max(...questions.map(q => q.question_id)) + 1 : 1;
    let answer_value = '';
    if (correct_answer === 'A') answer_value = option_a;
    if (correct_answer === 'B') answer_value = option_b;
    if (correct_answer === 'C') answer_value = option_c;
    if (correct_answer === 'D') answer_value = option_d;
    questions.push({ question_id, exam_id, question_text, option_a, option_b, option_c, option_d, correct_answer: answer_value });
    localStorage.setItem('questions', JSON.stringify(questions));
    document.getElementById('successMsg').classList.remove('hidden');
    this.reset();
  });
})();

function logout() {
  localStorage.removeItem('session');
  window.location.href = '../admin-login.html';
}
