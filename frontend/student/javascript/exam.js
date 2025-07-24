document.addEventListener('DOMContentLoaded', function() {
  // Load sidebar with correct path
  fetch('partials/sidebar.html')
    .then(response => {
      if (!response.ok) throw new Error('Sidebar not found');
      return response.text();
    })
    .then(html => {
      document.getElementById('sidebar').innerHTML = html;
      
      // Set student name if needed
      const student = JSON.parse(localStorage.getItem('studentSession'));
      if (student) {
        document.getElementById('studentName').textContent = student.username;
      }
      
      // Initialize exam after sidebar is loaded
      initExam();
    })
    .catch(error => {
      console.error('Error loading sidebar:', error);
      document.getElementById('sidebar').innerHTML = `
        <div class="alert alert-danger">
          Navigation failed to load. <a href="dashboard.html">Refresh</a>
        </div>
      `;
      initExam();
    });

  function initExam() {
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
    document.getElementById('examForm').querySelector('button').disabled = false;

    // Generate questions
    const questions = generateQuestions(exam.id, exam.questions);
    renderQuestions(questions);

    // Form submission
    document.getElementById('examForm').addEventListener('submit', function(e) {
      e.preventDefault();
      submitExam();
    });

    function generateQuestions(examId, count) {
      const questions = [];
      for (let i = 1; i <= count; i++) {
        questions.push({
          id: examId * 100 + i,
          text: `What is ${i} + ${i}?`, // Example question format
          options: [
            `Answer ${i}`, 
            `Answer ${i+1}`, 
            `Answer ${i+2}`, 
            `${i*2} (correct)` // Correct answer
          ],
          correctAnswer: 3 // Last option is correct (i*2)
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
            <p class="card-text mb-4">${q.text}</p>
            <div class="container-fluid">
              <div class="row g-3">
                ${q.options.map((opt, i) => `
                  <div class="col-sm-6 mb-3">
                    <div class="option-item">
                      <div class="form-check h-100">
                        <input class="form-check-input" type="radio" 
                               name="q${q.id}" id="q${q.id}_opt${i}" 
                               value="${i}" required>
                        <label class="form-check-label w-100" 
                               for="q${q.id}_opt${i}">
                          ${opt}
                        </label>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
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
      let allAnswered = true;
      
      questions.forEach(q => {
        const questionId = parseInt(q.querySelector('input').name.replace('q', ''));
        const selectedOption = q.querySelector('input:checked');
        const selectedAnswer = selectedOption ? parseInt(selectedOption.value) : null;
        
        if (selectedAnswer === null) {
          allAnswered = false;
          q.querySelector('.card-body').classList.add('bg-warning', 'bg-opacity-10');
          return;
        }
        
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
      
      if (!allAnswered) {
        alert('Please answer all questions before submitting');
        return;
      }
      
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
      
      window.location.href = `my-result.html?examId=${examId}`;
    }
  }
});