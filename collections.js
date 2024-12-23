document.querySelectorAll('.subjects').forEach((subject) => {
    subject.addEventListener('click', () => {
        document.querySelector('.text').innerHTML = `
        <h2>Select Level👇<h2>`;
        document.querySelector('.catogeries').innerHTML = ` 
        <div class="subjects Easy">Easy</div>
        <div class="subjects Medium">Medium</div>
        <div class="subjects Hard">Hard</div>
        <div class="subjects Anylevel">Anylevel</div>`;
        let timer = document.createElement('div');
        timer.id = 'timer';
        timer.textContent = '30s';
        document.querySelector('main').appendChild(timer);

        const api = async (category) => {
            const response = await fetch(`https://opentdb.com/api.php?amount=200&category=${category}`);
            const jsontojs = await response.json();
            const result = jsontojs.results;

            const easyQuestions = result.filter((i) => i.difficulty == 'easy');
            const mediumQuestions = result.filter((i) => i.difficulty == 'medium');
            const hardQuestions = result.filter((i) => i.difficulty == 'hard');

            function presentQuestions(questions) {
                let currentQuestionIndex = 0;
                let timeLeft = 30;
                let interval;


                function showQuestion() {
                    if (currentQuestionIndex >= questions.length) {
                        clearInterval(interval);
                        document.querySelector('.text').innerHTML = `<h2>Quiz Over!<h2>`;
                        document.querySelector('.catogeries').innerHTML = '<button>Homepage</button>';
                        document.getElementById('timer').remove();
                        document.querySelector('button').addEventListener('click',()=>renderHomepage())
                        return;
                    }

                    const question = questions[currentQuestionIndex];
                    document.querySelector('.text').innerHTML = `
                        <h2>${question.question}<h2>`;
                    document.querySelector('.catogeries').innerHTML = ` 
                        <div class="subjects">${question.incorrect_answers[0]}</div>
                        <div class="subjects">${question.incorrect_answers[1]}</div>
                        <div class="subjects ">${question.correct_answer}</div>
                        <div class="subjects">${question.incorrect_answers[2]}</div>`;

                    // Add click listeners to options
                    document.querySelectorAll('.subjects').forEach((option) => {
                            option.addEventListener('click', () => {
                            clearInterval(interval); // Stop the timer when an option is clicked
                            if(option.textContent === question.correct_answer){
                                option.style.backgroundColor='darkgreen'
                            }
                            else{
                                option.style.backgroundColor='red'
                            }
                            document.querySelectorAll('.subjects').forEach((opt) => {
                                if (opt.textContent === question.correct_answer) {
                                    opt.style.backgroundColor = 'green';
                                }
                            });
                            setTimeout(() => {
                                currentQuestionIndex++; // Move to the next question
                                timeLeft = 30; // Reset the timer
                                showQuestion(); // Display the next question
                            }, 1000); 
                        });
                    });

                    // Reset timer
                    timeLeft = 30;
                    document.getElementById('timer').textContent = `${timeLeft}s`;
                }

                // Timer countdown
                interval = setInterval(() => {
                    timeLeft--;
                    document.getElementById('timer').textContent = `${timeLeft}s`;
                    if (timeLeft === 0) {
                        clearInterval(interval);
                        currentQuestionIndex++; // Move to the next question
                        showQuestion(); // Show the next question
                    }
                }, 1000);

                // Start with the first question
                showQuestion();
            }

            // Level selection
            document.querySelector('.subjects.Easy').addEventListener('click', () => presentQuestions(easyQuestions));
            document.querySelector('.subjects.Medium').addEventListener('click', () => presentQuestions(mediumQuestions));
            document.querySelector('.subjects.Hard').addEventListener('click', () => presentQuestions(hardQuestions));
            document.querySelector('.subjects.Anylevel').addEventListener('click', () => presentQuestions(result));
        };

        // Select the category based on the subject
        const subjectMapping = {
            mythology: '20',
            sports: '21',
            geography: '22',
            history: '23',
            politics: '24',
            animals: '27',
        };

        const subjectName = subject.textContent.toLowerCase();
        if (subjectMapping[subjectName]) {
            api(subjectMapping[subjectName]);
        }
      
    });
});

function renderHomepage() {
    document.querySelector('.text').innerHTML = `
        <h2>Choose a Category👇</h2>`;
    document.querySelector('.catogeries').innerHTML = ` 
        <div class="subjects">mythology</div>
        <div class="subjects">sports</div>
        <div class="subjects">geography</div>
        <div class="subjects">history</div>
        <div class="subjects">politics</div>
        <div class="subjects">animals</div>`;
    const timer = document.getElementById('timer');
    if (timer) {
        timer.remove(); // Remove timer if it exists
    }
}
