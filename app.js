const welcomeScreen = document.querySelector(".welcome");
const startQuizBtn = document.getElementById("startQuizBtn");
const quizScreen = document.querySelector(".quizTime");
const questionElement = document.getElementById("question");
const propositionsContainer = document.getElementById("propositions");
const nextBtn = document.querySelector(".next");
const restartBtn = document.getElementById("restart");
const quizTimeTitle = document.getElementById("styleQuizTime"); // Élément pour afficher le score
let timerElement = null; // Élément pour afficher le timer
const progressBar = document.querySelector(".progress-bar");
const progressText = document.querySelector(".progress-text");

let currentQuestionIndex = 0;
let score = 0;
let shuffledQuestions = []; // Questions mélangées
let timeLeft = 30; // Temps en secondes pour répondre
let timerId = null; // ID du timer pour pouvoir l'arrêter

startQuizBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
        loadQuestion();
    } else {
        endQuiz();
    }
});

restartBtn.addEventListener("click", () => {
    // Réinitialisation des variables
    currentQuestionIndex = 0;
    score = 0;

    // Réinitialiser l'affichage
    restartBtn.classList.add("hide");
    quizScreen.style.display = "none";
    welcomeScreen.style.display = "block";
});

function startQuiz() {
    welcomeScreen.style.display = "none";
    quizScreen.style.display = "block";
    currentQuestionIndex = 0;
    score = 0;

    // Initialiser la barre de progression
    updateProgressBar();

    // Créer et insérer le timer s'il n'existe pas déjà
    if (!timerElement) {
        timerElement = document.createElement("div");
        timerElement.classList.add("timer");
        const questionsPropositions = document.querySelector(".questionsPropositions");
        quizScreen.insertBefore(timerElement, questionsPropositions);
    }

    // Afficher le score dès le début
    quizTimeTitle.classList.add("show");
    updateScoreDisplay(); // Mettre à jour le score initial
    shuffledQuestions = shuffleArray([...questions]); // Crée une copie mélangée
    loadQuestion();
}

function loadQuestion() {
    resetState();
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;
    
    // Mettre à jour la barre de progression
    updateProgressBar();
    
    // Démarrer le timer
    timeLeft = 30;
    startTimer();

    // Ajouter l'animation à la question
    questionElement.classList.add("show");

    // Mélanger les réponses avant de les afficher
    const shuffledAnswers = shuffleArray([...currentQuestion.answers]);

    shuffledAnswers.forEach((answer) => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("btn");
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        propositionsContainer.appendChild(button);

        // Ajouter l'animation aux propositions
        setTimeout(() => {
            button.classList.add("show");
        }, 100); // Délai pour l'animation des boutons
    });

    nextBtn.classList.add("hide");
}
function selectAnswer(e) {
    // Arrêter le timer quand une réponse est sélectionnée
    clearInterval(timerId);
    timerId = null;
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === "true";
    if (correct) score++; // Incrémenter le score si la réponse est correcte

    Array.from(propositionsContainer.children).forEach((button) => {
        setStatusClass(button, button.dataset.correct === "true");
    });

    // Mise à jour de l'icône en fonction de la réponse
    const resultIcon = document.getElementById("resultIcon");
    if (correct) {
        resultIcon.src = "img/checkmark-icon.png"; // Icône verte
    } else {
        resultIcon.src = "img/cross-icon.png"; // Icône rouge
    }
    resultIcon.style.display = "inline-block"; // Afficher l'icône

    nextBtn.classList.remove("hide");
    updateScoreDisplay(); // Mettre à jour le score immédiatement après la réponse
}

// Réinitialiser l'icône à chaque nouvelle question
function resetState() {
    propositionsContainer.innerHTML = "";
    const resultIcon = document.getElementById("resultIcon");
    resultIcon.style.display = "none"; // Masquer l'icône
    resultIcon.src = ""; // Réinitialiser l'image source
    
    // Arrêter le timer précédent s'il existe
    if (timerId) {
        clearInterval(timerId);
        timerId = null;
    }
}


function setStatusClass(button, correct) {
    button.classList.remove("correct", "wrong");
    if (correct) {
        button.classList.add("correct");
    } else {
        button.classList.add("wrong");
    }
}

// Fonction pour gérer le timer
function startTimer() {
    updateTimerDisplay();
    timerId = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerId);
            timerId = null;
            // Passer automatiquement à la question suivante
            currentQuestionIndex++;
            if (currentQuestionIndex < shuffledQuestions.length) {
                loadQuestion();
            } else {
                endQuiz();
            }
        }
    }, 1000);
}

// Fonction pour mettre à jour l'affichage du timer
function updateTimerDisplay() {
    timerElement.textContent = `Temps restant : ${timeLeft} secondes`;
    if (timeLeft <= 10) {
        timerElement.style.color = "red";
    } else {
        timerElement.style.color = "black";
    }
}

function endQuiz() {
    quizScreen.style.display = "block";
    questionElement.innerText = `Quiz terminé ! Vous avez obtenu ${score}/${shuffledQuestions.length} points.`;

    // Ajouter l'animation du score
    quizTimeTitle.classList.add("show");

    propositionsContainer.innerHTML = ""; // Supprimer les boutons de réponse
    nextBtn.classList.add("hide"); // Masquer le bouton "Next"
    restartBtn.classList.remove("hide"); // Afficher le bouton "Rejouer"
    updateScoreDisplay(); // Score final
}

// Fonction pour afficher le score
function updateScoreDisplay() {
    quizTimeTitle.innerText = `QUIZ TIME | Score : ${score}/${shuffledQuestions.length}`;
}

// Fonction pour mélanger un tableau
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Échange des éléments
    }
    return array;
}

// Fonction pour mettre à jour la barre de progression
function updateProgressBar() {
    const totalQuestions = shuffledQuestions.length;
    const currentQuestion = currentQuestionIndex + 1;
    const progressPercentage = (currentQuestion / totalQuestions) * 100;
    
    progressBar.style.width = `${progressPercentage}%`;
    progressText.textContent = `Question ${currentQuestion}/${totalQuestions}`;
}
