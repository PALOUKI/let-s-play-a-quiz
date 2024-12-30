const welcomeScreen = document.querySelector(".welcome");
const startQuizBtn = document.getElementById("startQuizBtn");
const quizScreen = document.querySelector(".quizTime");
const questionElement = document.getElementById("question");
const propositionsContainer = document.getElementById("propositions");
const nextBtn = document.querySelector(".next");
const restartBtn = document.getElementById("restart");
const quizTimeTitle = document.getElementById("styleQuizTime"); // Élément pour afficher le score

let currentQuestionIndex = 0;
let score = 0;
let shuffledQuestions = []; // Questions mélangées

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

function resetState() {
    propositionsContainer.innerHTML = "";
    Array.from(propositionsContainer.children).forEach((button) => {
        button.classList.remove("correct", "wrong");
        button.classList.remove("show");
    });
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === "true";
    if (correct) score++; // Incrémenter le score si la réponse est correcte

    Array.from(propositionsContainer.children).forEach((button) => {
        setStatusClass(button, button.dataset.correct === "true");
    });

    nextBtn.classList.remove("hide");
    updateScoreDisplay(); // Mettre à jour le score immédiatement après la réponse
}

function setStatusClass(button, correct) {
    button.classList.remove("correct", "wrong");
    if (correct) {
        button.classList.add("correct");
    } else {
        button.classList.add("wrong");
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
