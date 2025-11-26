/*const question = document.querySelector('.questiontext1');
const choices = Array.from( document.getElementsByClassName('choice-text'));

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let selectedChoice = ""
let classToApply = ""
let correctAnswer = ""

let questions = [
    {
        question: `Qual é a principal função do carboidrato no organismo?`,
        choice1: "Construção de Tecidos",
        choice2: "Fornecer Energia Rápida",
        choice3: "Proteger Contra Doenças",
        answer: 2
    },
    {
        question: `Qual nutriente ajuda na digestão?`,
        choice1: "Fibra",
        choice2: "Sal",
        choice3: "Proteína",
        answer: 1
    },
    {
        question: `Qual vitamina é conhecida por ajudar a prevenir gripes e resfriados?`,
        choice1: "Vitamina K",
        choice2: "Vitamina B12",
        choice3: "Vitamina C",
        answer: 3
    },
    {
        question: `Qual sistema do corpo é fortalecido com boa alimentação?`,
        choice1: "Sistema Muscular",
        choice2: "Sistema Visual",
        choice3: "Sistema Imunológico",
        answer: 1
    }
];

const CORRECT_BONUS = 1;
const MAX_QUESTIONS = 4;

const startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    console.log(availableQuestions);
    getNewQuestion();
};

const getNewQuestion = () => {

    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);
        return window.location.assign("./quizFINAL.html");
    }
    questionCounter++;
    
    document.querySelector("#inabar").style.width = `${questionCounter * 25}%`
    document.querySelector("#percent").innerHTML = `${questionCounter * 25}%`

    const questionIndex =Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = `<span class="question-number">${questionCounter}. </span>${currentQuestion.question}`;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        if(selectedAnswer == currentQuestion.answer) {
            classToApply = "correct";
            score = score + CORRECT_BONUS;
        } else {
            classToApply = "incorrect";
            correctAnswer = document.querySelector(`[data-number='${currentQuestion.answer}']`)
            correctAnswer.parentElement.classList.add("correct")
        }

        classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
        selectedChoice.parentElement.classList.add(classToApply);

        console.log(selectedAnswer == currentQuestion.answer);
        
    });
});

const button = document.querySelector('.next-button button');
button.addEventListener('click', () => {
    if (selectedChoice && selectedChoice.parentElement) {
    selectedChoice.parentElement.classList.remove(classToApply);
    }
    if (correctAnswer && correctAnswer.parentElement) {
    correctAnswer.parentElement.classList.remove("correct");
    }
    getNewQuestion();
});

startGame();*/

// pega elementos do DOM
const question = document.querySelector('.questiontext1');
const choiceContainers = Array.from(document.getElementsByClassName('choice-container'));
const button = document.querySelector('.the-real-button');
const indicator = document.getElementById("question-indicator");

// variáveis de controle do quiz
let answerHistory = [];
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let selectedChoice = "";
let classToApply = "";
let correctAnswer = "";

// array de perguntas
let questions = [
  {
    question: `Qual é a principal função do carboidrato no organismo?`,
    choice1: "Construção de Tecidos",
    choice2: "Fornecer Energia Rápida",
    choice3: "Proteger Contra Doenças",
    choice4: "Transporte de Oxigênio",
    answer: 2
  },
  {
    question: `Qual nutriente ajuda na digestão?`,
    choice1: "Fibra",
    choice2: "Sal",
    choice3: "Proteína",
    choice4: "Vitamina A",
    answer: 1
  },
  {
    question: `Qual vitamina é conhecida por ajudar a prevenir gripes e resfriados?`,
    choice1: "Vitamina K",
    choice2: "Vitamina B12",
    choice3: "Vitamina C",
    choice4: "Vitamina D",
    answer: 3
  },
  {
    question: `Qual sistema do corpo é fortalecido com boa alimentação?`,
    choice1: "Sistema Muscular",
    choice2: "Sistema Visual",
    choice3: "Sistema Imunológico",
    choice4: "Sistema Reprodutor",
    answer: 3
  },
  {
    question: `Qual nutriente é fundamental para a construção dos músculos?`,
    choice1: "Proteínas",
    choice2: "Carboidratos",
    choice3: "Gorduras",
    choice4: "Vitaminas",
    answer: 1
  },
  {
    question: `Qual mineral é essencial para ossos fortes?`,
    choice1: "Ferro",
    choice2: "Cálcio",
    choice3: "Potássio",
    choice4: "Magnésio",
    answer: 2
  }
];

// configurações do quiz
const CORRECT_BONUS = 1; // pontos por acerto
const MAX_QUESTIONS = questions.length; // total de perguntas

// ==================== INICIA O JOGO ====================
const startGame = () => {
  questionCounter = 0; // reinicia contador
  score = 0;           // reinicia pontuação
  availableQuestions = [...questions]; // copia perguntas disponíveis
  getNewQuestion();    // carrega primeira pergunta
};

// pega nova pergunta
const getNewQuestion = () => {
    // se não houver mais perguntas, salva pontuação e vai para tela final
    if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
      localStorage.setItem("mostRecentScore", score);
      return window.location.assign("./quizFINAL.html");
    }
  
    questionCounter++; // atualiza contador
    indicator.innerText = `PERGUNTA ${questionCounter} DE ${MAX_QUESTIONS}`; // mostra indicador

    // atualiza barra de progresso
    const percentage = ((questionCounter / MAX_QUESTIONS) * 100).toFixed(0);
    document.querySelector("#inabar").style.width = `${percentage}%`;
    document.querySelector("#percent").innerHTML = `${percentage}%`;

    // seleciona pergunta aleatória
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerHTML = `<span class="question-number">${questionCounter}. </span>${currentQuestion.question}`;

    // mostra escolhas na tela
    choiceContainers.forEach((container, index) => {
      const number = index + 1;
      const choiceText = container.querySelector('.choice-text');
      choiceText.innerText = currentQuestion['choice' + number];
      container.classList.remove("correct", "incorrect", "selected");
      choiceText.dataset.number = number; // guarda número da escolha
    });

    availableQuestions.splice(questionIndex, 1); // remove pergunta usada
    acceptingAnswers = true; // permite respostas
    selectedChoice = "";
    classToApply = "";
    correctAnswer = "";

    button.innerText = "RESPONDER"; // reset botão
};

// seleciona escolha
choiceContainers.forEach(container => {
  container.addEventListener('click', () => {
    if (!acceptingAnswers) return; // ignora se não aceitar respostas

    choiceContainers.forEach(c => c.classList.remove("selected")); // remove seleção anterior
    selectedChoice = container.querySelector('.choice-text'); // define escolha atual
    container.classList.add("selected"); // marca visualmente
  });
});

// botão responder/próxima pergunta
button.addEventListener('click', () => {
  if (acceptingAnswers && selectedChoice) {
    acceptingAnswers = false; // bloqueia novas respostas
    const selectedAnswer = selectedChoice.dataset['number']; // pega resposta
    selectedChoice.closest(".choice-container").classList.remove("selected");

    // verifica acerto
    if (selectedAnswer == currentQuestion.answer) {
      classToApply = "correct"; // acerto
      score += CORRECT_BONUS;
    } else {
      classToApply = "incorrect"; // erro
      correctAnswer = document.querySelector(`[data-number='${currentQuestion.answer}']`).closest(".choice-container");
      correctAnswer.classList.add("correct"); // mostra correta
    }

    selectedChoice.closest(".choice-container").classList.add(classToApply);
    button.innerText = "PRÓXIMA PERGUNTA"; // muda texto botão

  } else if (!acceptingAnswers) {
    // remove classes e vai para próxima pergunta
    if (selectedChoice) {
      selectedChoice.closest(".choice-container").classList.remove(classToApply, "selected");
    }
    if (correctAnswer) {
      correctAnswer.classList.remove("correct");
    }
    getNewQuestion();
  }
});

// inicia o jogo
startGame();

// ==================== MODAL DE SAÍDA ====================
const exitBtn = document.getElementById("exit-btn");
const modal = document.getElementById("exit-modal");
const confirmExit = document.getElementById("confirm-exit");
const cancelExit = document.getElementById("cancel-exit");

// abre modal ao clicar em sair
exitBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

// cancela saída
cancelExit.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// confirma saída e vai para menu principal
confirmExit.addEventListener("click", () => {
  window.location.href = "./quizPRINCIPAL.html";
});

