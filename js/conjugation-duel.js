// js/conjugation-duel.js

// --- State ---
let verbs = [];
let playerScore = 0;
let opponentScore = 0;
let currentChallenge = {};
let gameActive = false;
let aiTimer = null;
let domElements = {};

// --- Core Functions ---

async function loadData(language) {
    const verbFile = `data/${language}_verbs.json`;
    try {
        const response = await fetch(verbFile);
        if (!response.ok) throw new Error(`HTTP error!`);
        verbs = (await response.json()).verbs;
        return true;
    } catch (error) {
        console.error("Could not load Conjugation Duel data:", error);
        return false;
    }
}

function startRound() {
    gameActive = false; // Prevent input while setting up
    clearTimeout(aiTimer);

    // UI Reset
    domElements.playerInput.value = '';
    domElements.playerInput.disabled = false;
    domElements.feedback.textContent = '';

    // Reset and start AI progress bar animation
    const aiTime = (3 + Math.random() * 3) * 1000; // AI answers in 3-6 seconds
    const progressEl = domElements.opponentProgress;
    progressEl.style.transition = 'none';
    progressEl.style.width = '0%';
    // Trigger reflow to apply the transition reset immediately
    progressEl.offsetHeight;
    progressEl.style.transition = `width ${aiTime}ms linear`;
    progressEl.style.width = '100%';

    // Select new challenge
    const verbData = verbs[Math.floor(Math.random() * verbs.length)];
    const tenses = Object.keys(verbData.conjugations);
    const tense = tenses[Math.floor(Math.random() * tenses.length)];
    const subjects = Object.keys(verbData.conjugations[tense]);
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const correctAnswer = verbData.conjugations[tense][subject];

    currentChallenge = { verb: verbData.verb, tense, subject, correctAnswer };

    // Display prompt
    domElements.verb.textContent = currentChallenge.verb;
    domElements.subject.textContent = currentChallenge.subject;
    domElements.tense.textContent = currentChallenge.tense;

    gameActive = true;
    domElements.playerInput.focus();

    aiTimer = setTimeout(aiWinsRound, aiTime);
}

function checkPlayerAnswer() {
    if (!gameActive) return;

    const playerAnswer = domElements.playerInput.value.trim().toLowerCase();
    const correctAnswer = currentChallenge.correctAnswer.toLowerCase();

    if (playerAnswer === correctAnswer) {
        gameActive = false;
        clearTimeout(aiTimer);
        domElements.opponentProgress.style.transition = 'none'; // Stop animation
        playerScore++;
        domElements.playerScore.textContent = playerScore;
        domElements.feedback.textContent = 'You win!';
        domElements.feedback.style.color = 'green';
        setTimeout(startRound, 2000);
    } else {
        domElements.feedback.textContent = 'Incorrect. Try again!';
        domElements.feedback.style.color = 'red';
        // Shake animation for feedback
        domElements.playerInput.classList.add('shake');
        setTimeout(() => domElements.playerInput.classList.remove('shake'), 500);
    }
}

function aiWinsRound() {
    if (!gameActive) return;
    gameActive = false;

    domElements.playerInput.disabled = true;
    opponentScore++;
    domElements.opponentScore.textContent = opponentScore;
    domElements.feedback.textContent = `Too slow! The answer was: ${currentChallenge.correctAnswer}`;
    domElements.feedback.style.color = 'orange';

    setTimeout(startRound, 2500);
}


// --- Initialization ---

export async function initConjugationDuel(language, elements) {
    domElements = elements;
    playerScore = 0;
    opponentScore = 0;
    domElements.playerScore.textContent = playerScore;
    domElements.opponentScore.textContent = opponentScore;

    const loaded = await loadData(language);
    if (loaded) {
        domElements.playerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                checkPlayerAnswer();
            }
        });
        startRound();
    } else {
        domElements.feedback.textContent = 'Error loading game data for this language. Please select another.';
    }
}
