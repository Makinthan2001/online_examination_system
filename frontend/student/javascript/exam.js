document.addEventListener('DOMContentLoaded', function() {
  // Check authentication
  const studentSession = JSON.parse(localStorage.getItem('studentSession'));
  if (!studentSession || !studentSession.loggedIn) {
    window.location.href = 'login.html';
    return;
  }

  // Get exam ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const examId = parseInt(urlParams.get('examId'));
  
  if (!examId) {
    window.location.href = 'dashboard.html';
    return;
  }

  // Check if already attempted
  const results = JSON.parse(localStorage.getItem('examResults')) || [];
  if (results.some(r => r.examId === examId)) {
    alert('You have already attempted this exam');
    window.location.href = 'dashboard.html';
    return;
  }

  // Load exam data
  const exams = [
    { id: 1, name: 'JavaScript Basics', duration: 30, questions: 5 },
    { id: 2, name: 'HTML Fundamentals', duration: 20, questions: 3 },
    { id: 3, name: 'CSS Styling', duration: 25, questions: 4 }
  ];
  
  const exam = exams.find(e => e.id === examId);
  
  if (!exam) {
    window.location.href = 'dashboard.html';
    return;
  }

  document.getElementById('examTitle').textContent = exam.name;

  // Timer functionality
  let timeLeft = exam.duration * 60;
  updateTimer();
  const timerInterval = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      submitExam();
    }
  }, 1000);

  // Generate questions
  const questions = generateQuestions(exam.id, exam.questions);
  renderQuestions(questions);

  // Form submission
  document.getElementById('examForm').addEventListener('submit', function(e) {
    e.preventDefault();
    clearInterval(timerInterval);
    submitExam();
  });

  function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = 
      `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  function generateQuestions(examId, count) {
    const questions = [];
    for (let i = 1; i <= count; i++) {
      questions.push({
        id: examId * 100 + i,
        text: `Question ${i} for ${exam.name}`,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: Math.floor(Math.random() * 4)
      });
    }
    return questions;
  }

  function renderQuestions(questions) {
    const container = document.getElementById('questionsContainer');
    container.innerHTML = '';
    
    questions.forEach((q, index) => {
      const questionDiv = document.createElement('div');
      questionDiv.className = 'card question-card mb-4';
      questionDiv.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">Question ${index + 1}</h5>
          <p class="card-text">${q.text}</p>
          <div class="form-group">
            ${q.options.map((opt, i) => `
              <div class="form-check mb-2">
                <input class="form-check-input" type="radio" name="q${q.id}" id="q${q.id}_opt${i}" value="${i}">
                <label class="form-check-label" for="q${q.id}_opt${i}">${opt}</label>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      container.appendChild(questionDiv);
    });
  }

  function submitExam() {
    const questions = document.querySelectorAll('.question-card');
    let score = 0;
    const answers = [];
    
    questions.forEach(q => {
      const questionId = parseInt(q.querySelector('input').name.replace('q', ''));
      const selectedOption = q.querySelector('input:checked');
      const selectedAnswer = selectedOption ? parseInt(selectedOption.value) : null;
      
      const question = generateQuestions(examId, exam.questions)
        .find(q => q.id === questionId);
      
      const isCorrect = selectedAnswer === question.correctAnswer;
      if (isCorrect) score++;
      
      answers.push({
        questionId: questionId,
        selectedAnswer: selectedAnswer,
        isCorrect: isCorrect,
        correctAnswer: question.correctAnswer
      });
    });
    
    // Save result
    const result = {
      examId: examId,
      examName: exam.name,
      score: score,
      totalQuestions: exam.questions,
      date: new Date().toISOString(),
      answers: answers
    };
    
    const results = JSON.parse(localStorage.getItem('examResults')) || [];
    results.push(result);
    localStorage.setItem('examResults', JSON.stringify(results));
    
    window.location.href = `result.html?examId=${examId}`;
  }
});