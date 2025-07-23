// Mock data initialization for localStorage
(function() {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([
      { username: 'admin1', password: 'admin123', role: 'admin' },
      { username: 'stud01', password: '1234', name: 'Madhan', age: 20, role: 'student' }
    ]));
  }
  if (!localStorage.getItem('exams')) {
    localStorage.setItem('exams', JSON.stringify([
      { exam_id: 1, exam_name: 'Math Test', subject: 'Math', duration: 30 }
    ]));
  }
  if (!localStorage.getItem('questions')) {
    localStorage.setItem('questions', JSON.stringify([
      {
        question_id: 101,
        exam_id: 1,
        question_text: 'What is 2 + 2?',
        option_a: '3', option_b: '4', option_c: '5', option_d: '6',
        correct_answer: '4'
      }
    ]));
  }
  if (!localStorage.getItem('results')) {
    localStorage.setItem('results', JSON.stringify([]));
  }
})();
