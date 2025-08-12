// --- DOM Elements ---
let promptTextEl, userSpeechEl, feedbackEl, scoreEl, startBtnEl, listenBtnEl, recordBtn, deckTitleEl;

// --- Game State ---
let prompts = [];
let currentPrompt = null;
let score = 0;
let currentLanguage_ps;

// --- Web Speech API ---
let recognition;
const langCodeMap = {
    english: 'en-US',
    french: 'fr-FR',
    spanish: 'es-ES',
    italian: 'it-IT',
    german: 'de-DE',
    russian: 'ru-RU',
    portuguese: 'pt-BR',
    greek: 'el-GR',
};

function speak(text, lang) {
    if (!window.speechSynthesis) {
        console.warn("Browser does not support speech synthesis.");
        return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = langCodeMap[lang.split('_')[0]];
    if (langCode) {
        utterance.lang = langCode;
    }
    window.speechSynthesis.speak(utterance);
}

function setupRecognition() {
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!window.SpeechRecognition) {
        feedbackEl.textContent = "Speech recognition not supported in this browser.";
        listenBtnEl.disabled = true;
        return;
    }
    recognition = new SpeechRecognition();
    const langCode = langCodeMap[currentLanguage_ps.split('_')[0]] || 'en-US';
    recognition.lang = langCode;
    recognition.interimResults = false;

    recognition.onstart = () => {
        userSpeechEl.textContent = "Listening...";
        feedbackEl.textContent = "";
    };

    recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        userSpeechEl.textContent = speechResult;
        checkAnswer(speechResult);
    };

    recognition.onerror = (event) => {
        feedbackEl.textContent = `Recognition error: ${event.error}`;
    };

    recognition.onend = () => {
        if (recordBtn) recordBtn.disabled = false;
    };
}

function checkAnswer(userAnswer) {
    if (!currentPrompt) return;

    const correctAnswer = currentPrompt.prompt.trim().toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");
    const formattedUserAnswer = userAnswer.trim().toLowerCase();

    if (correctAnswer === formattedUserAnswer) {
        feedbackEl.textContent = "Correct! Well done.";
        feedbackEl.style.color = 'green';
        score++;
        scoreEl.textContent = score;
        setTimeout(nextPrompt, 1500);
    } else {
        feedbackEl.textContent = "Not quite. Try again!";
        feedbackEl.style.color = 'red';
    }
}

function startListening() {
    if (recognition && currentPrompt) {
        if (recordBtn) recordBtn.disabled = true;
        recognition.start();
    }
}

function nextPrompt() {
    if (prompts.length === 0) {
        promptTextEl.textContent = "No prompts available for this language.";
        listenBtnEl.disabled = true;
        return;
    }
    const randomIndex = Math.floor(Math.random() * prompts.length);
    currentPrompt = prompts[randomIndex];
    promptTextEl.textContent = currentPrompt.prompt;
    userSpeechEl.textContent = "...";
    feedbackEl.textContent = "";
    listenBtnEl.disabled = false;
}

function startGame() {
    score = 0;
    scoreEl.textContent = score;
    startBtnEl.textContent = "Next Prompt";
    listenBtnEl.disabled = false;
    if (recordBtn) recordBtn.disabled = false;
    nextPrompt();
}

async function loadPrompts(language) {
    currentLanguage_ps = language;
    const dataFile = `data/${language}_pronunciation.json`;
    try {
        const response = await fetch(dataFile);
        if (!response.ok) {
            prompts = [];
            throw new Error(`Data file not found: ${dataFile}`);
        }
        const data = await response.json();
        prompts = data.prompts || [];
        deckTitleEl.textContent = `${data.lang} ${data.level} - Pronunciation`;
    } catch (error) {
        console.error('Could not load pronunciation prompts:', error);
        prompts = [];
    } finally {
        // Don't auto-start, wait for button click
        promptTextEl.textContent = 'Press "Start Game" to begin.';
    }
}

export function initPronunciationSprint(lang, elements) {
    // Store DOM elements from main.js
    promptTextEl = elements.promptText;
    userSpeechEl = elements.userSpeech;
    feedbackEl = elements.feedback;
    scoreEl = elements.score;
    startBtnEl = elements.startBtn;
    listenBtnEl = elements.listenBtn;
    recordBtn = elements.recordBtn; // Assign to module-level variable
    deckTitleEl = elements.deckTitle;

    // Attach event listeners
    startBtnEl.addEventListener('click', startGame);
    listenBtnEl.addEventListener('click', () => {
        if (currentPrompt) {
            speak(currentPrompt.prompt, currentLanguage_ps);
        }
    });
    recordBtn.addEventListener('click', startListening);

    // Initial setup
    loadPrompts(lang).then(() => {
        setupRecognition();
    });
}
