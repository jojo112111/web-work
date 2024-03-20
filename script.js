document.addEventListener('DOMContentLoaded', () => {
    fetch('questionnaire.json')
        .then(response => response.json())
        .then(questions => {
            console.log('Questions loaded:', questions);
            startQuiz(questions);
        })
        .catch(error => console.error("Error loading quiz:", error));
});

let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
// Ajouter un tableau pour suivre les réponses de l'utilisateur à chaque question.
let userAnswers = [];

function startQuiz(questions) {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const submitButton = document.getElementById('submit');
    const resultsElement = document.getElementById('results');
    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('prev');
    const timerElement = document.getElementById('timer');

    function updateScoreAndProgress() {
        document.getElementById('score').textContent = `Score : ${score} sur ${questions.length}`;
        document.getElementById('progress').textContent = `Question ${currentQuestionIndex + 1} sur ${questions.length}`;
    }

    function showQuestion(question) {
        clearInterval(timerInterval);
        startTimer();
        
        questionElement.textContent = question.question;
        optionsElement.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.textContent = option;
            button.onclick = () => selectOption(index, questions);
            optionsElement.appendChild(button);
        });

        updateScoreAndProgress();
    }

    function startTimer() {
        let time = 30; // Durée du timer pour chaque question en secondes
        timerElement.textContent = `Temps : ${time}`;
        timerInterval = setInterval(() => {
            time--;
            timerElement.textContent = `Temps : ${time}`;
            if (time <= 0) {
                clearInterval(timerInterval);
                moveToNextQuestion();
            }
        }, 1000);
    }

    function selectOption(selectedIndex, questions) {
        clearInterval(timerInterval); // Arrêter le timer lorsqu'une réponse est sélectionnée
        
        // Enregistrer ou mettre à jour la réponse de l'utilisateur
        userAnswers[currentQuestionIndex] = selectedIndex;
        
        // Mettre à jour le score basé sur les réponses
        updateScore(questions);

        if (selectedIndex === questions[currentQuestionIndex].answer) {
            resultsElement.textContent = 'Correct !';
        } else {
            resultsElement.textContent = 'Incorrect.';
        }
    }

    function updateScore(questions) {
        score = userAnswers.reduce((acc, answer, index) => {
            return acc + (answer === questions[index].answer ? 1 : 0);
        }, 0);

        updateScoreAndProgress();
    }

    function moveToNextQuestion() {
        clearInterval(timerInterval); // Arrêtez le timer
    
        // Vérifier si l'utilisateur est à la dernière question
        if (currentQuestionIndex === questions.length - 1) {
            // Supprimer tous les éléments du conteneur du quiz
            const quizContainer = document.getElementById('quiz-container');
            while (quizContainer.firstChild) {
                quizContainer.removeChild(quizContainer.firstChild);
            }
    
            // Créer et afficher le message de fin avec le score
            const scoreMessage = document.createElement('div');
            scoreMessage.innerHTML = `<h1>Quiz terminé !</h1><p>Votre score est de ${score} sur ${questions.length}. Merci d'avoir testé notre quiz.</p>`;
            quizContainer.appendChild(scoreMessage);
        } else {
            // Si ce n'est pas la dernière question, passer à la question suivante
            currentQuestionIndex++;
            showQuestion(questions[currentQuestionIndex]);
        }
    }
    
    

    function moveToPrevQuestion() {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            showQuestion(questions[currentQuestionIndex]);
        }
    }

    nextButton.addEventListener('click', moveToNextQuestion);
    prevButton.addEventListener('click', moveToPrevQuestion);

    showQuestion(questions[currentQuestionIndex]);
}
