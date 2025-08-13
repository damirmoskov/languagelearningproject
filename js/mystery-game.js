let mysteryData = [], currentMysteryIndex = 0, revealedClues = 0, totalScore = 0, currentLanguage_mg;
let cluesListEl, guessInput, guessBtn, nextClueBtn, feedbackEl, scoreEl, deckTitle;

function startNewMystery() {
    revealedClues = 0;
    guessInput.value = '';
    feedbackEl.textContent = '';
    guessInput.disabled = false;
    guessBtn.disabled = false;
    nextClueBtn.disabled = false;
    cluesListEl.innerHTML = '';

    if (currentMysteryIndex >= mysteryData.length) {
        cluesListEl.innerHTML = `<li>Game Over! You have completed all mysteries.</li>`;
        feedbackEl.textContent = `Final Score: ${totalScore}`;
        guessInput.style.display = 'none';
        guessBtn.style.display = 'none';
        nextClueBtn.textContent = 'Play Again?';
        return;
    }

    revealNextClue();
}

function revealNextClue() {
    if (revealedClues >= 5) {
        feedbackEl.textContent = "All clues revealed! Try to guess.";
        nextClueBtn.disabled = true;
        return;
    }

    const currentMystery = mysteryData[currentMysteryIndex];
    const newClue = document.createElement('li');
    newClue.textContent = currentMystery.clues[revealedClues];
    cluesListEl.appendChild(newClue);
    revealedClues++;

    if (revealedClues >= 5) {
        nextClueBtn.disabled = true;
    }
}

function handleGuess() {
    const userGuess = guessInput.value.trim().toLowerCase();
    const correctAnswer = mysteryData[currentMysteryIndex].answer.toLowerCase();

    if (userGuess === correctAnswer) {
        const points = 6 - revealedClues;
        totalScore += points;
        scoreEl.textContent = totalScore;
        feedbackEl.textContent = `Correct! You earned ${points} points.`;

        guessInput.disabled = true;
        guessBtn.disabled = true;
        nextClueBtn.disabled = true;

        currentMysteryIndex++;

        setTimeout(() => {
            startNewMystery();
        }, 2000);

    } else {
        feedbackEl.textContent = "Not quite, try again!";
        guessInput.value = '';
    }
}

async function loadMysteryData(language) {
    currentLanguage_mg = language;
    try {
        const response = await fetch(`data/${language}_mystery.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        mysteryData = data.mysteries;
        deckTitle.textContent = `${data.lang} ${data.level} - 5 Clues Mystery`;

        // For simplicity, we'll just shuffle the mysteries each time.
        mysteryData.sort(() => 0.5 - Math.random());

        currentMysteryIndex = 0;
        totalScore = 0;
        scoreEl.textContent = totalScore;

        guessInput.style.display = 'inline-block';
        guessBtn.style.display = 'inline-block';
        nextClueBtn.textContent = 'Next Clue';

        startNewMystery();

    } catch (error) {
        console.error('Could not load mystery game data:', error);
        cluesListEl.innerHTML = '<li>Error loading game data. Please try another language.</li>';
    }
}

export function initMysteryGame(lang, elements) {
    cluesListEl = elements.cluesListEl;
    guessInput = elements.guessInput;
    guessBtn = elements.guessBtn;
    nextClueBtn = elements.nextClueBtn;
    feedbackEl = elements.feedbackEl;
    scoreEl = elements.scoreEl;
    deckTitle = elements.deckTitle;

    guessBtn.addEventListener('click', handleGuess);
    nextClueBtn.addEventListener('click', () => {
        if (nextClueBtn.textContent === 'Play Again?') {
            loadMysteryData(currentLanguage_mg);
        } else {
            revealNextClue();
        }
    });
    guessInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleGuess();
        }
    });

    loadMysteryData(lang);
}
