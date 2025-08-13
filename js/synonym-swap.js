let synonymData = [], currentChallengeIndex = 0, synonymScore = 0, currentLanguage_ss;
let sentenceEl, optionsContainer, scoreSpan, nextBtn, deckTitle;

function saveSynonymProgress() {
    const progressKey = `cosy_synonym_progress_${currentLanguage_ss}`;
    const progress = { score: synonymScore, index: currentChallengeIndex };
    localStorage.setItem(progressKey, JSON.stringify(progress));
}

function loadSynonymProgress() {
    const progressKey = `cosy_synonym_progress_${currentLanguage_ss}`;
    const savedProgress = JSON.parse(localStorage.getItem(progressKey));
    if (savedProgress) {
        synonymScore = savedProgress.score || 0;
        currentChallengeIndex = savedProgress.index || 0;
    } else {
        synonymScore = 0;
        currentChallengeIndex = 0;
    }
}

function handleAnswer(selectedAnswer, correctAnswer, button) {
    const optionButtons = optionsContainer.querySelectorAll('button');
    optionButtons.forEach(btn => btn.disabled = true);

    if (selectedAnswer === correctAnswer) {
        synonymScore++;
        scoreSpan.textContent = synonymScore;
        button.style.backgroundColor = 'lightgreen';
    } else {
        button.style.backgroundColor = 'lightcoral';
        optionButtons.forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.style.backgroundColor = 'lightgreen';
            }
        });
    }
    currentChallengeIndex++;
    saveSynonymProgress();
    nextBtn.textContent = 'Next';
    nextBtn.style.display = 'block';
}

function displayNextChallenge() {
    if (currentChallengeIndex >= synonymData.length) {
        endGame();
        return;
    }

    const challenge = synonymData[currentChallengeIndex];
    const sentenceText = challenge.sentence_template.replace('___', `[${challenge.target_word}]`);
    sentenceEl.textContent = sentenceText;

    const options = [...challenge.options, challenge.correct_answer];
    options.sort(() => 0.5 - Math.random());

    optionsContainer.innerHTML = '';
    options.forEach(optionText => {
        const button = document.createElement('button');
        button.textContent = optionText;
        button.addEventListener('click', () => handleAnswer(optionText, challenge.correct_answer, button));
        optionsContainer.appendChild(button);
    });

    nextBtn.style.display = 'none';
}

function endGame() {
    sentenceEl.textContent = `Game over! Your final score is ${synonymScore} out of ${synonymData.length}.`;
    optionsContainer.innerHTML = '';
    nextBtn.textContent = 'Play Again?';
    nextBtn.style.display = 'block';
}

function resetGame() {
    const progressKey = `cosy_synonym_progress_${currentLanguage_ss}`;
    localStorage.removeItem(progressKey);
    synonymScore = 0;
    currentChallengeIndex = 0;
    scoreSpan.textContent = synonymScore;
    displayNextChallenge();
}

async function loadSynonymData(language) {
    currentLanguage_ss = language;
    try {
        const response = await fetch(`data/${language}_synonym.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        synonymData = data.synonym_challenges;
        deckTitle.textContent = `${data.lang} ${data.level} - Synonym Swap`;
        loadSynonymProgress();
        scoreSpan.textContent = synonymScore;
        displayNextChallenge();
    } catch (error) {
        console.error('Could not load synonym swap data:', error);
        sentenceEl.textContent = 'Error loading game data. Please select another language or game.';
        optionsContainer.innerHTML = '';
    }
}

export function initSynonymSwap(lang, elements) {
    sentenceEl = elements.sentenceEl;
    optionsContainer = elements.optionsContainer;
    scoreSpan = elements.scoreSpan;
    nextBtn = elements.nextBtn;
    deckTitle = elements.deckTitle;

    nextBtn.addEventListener('click', () => {
        if (nextBtn.textContent === 'Play Again?') {
            resetGame();
        } else {
            displayNextChallenge();
        }
    });

    loadSynonymData(lang);
}
