let clozeData = [], currentClozeIndex = 0, clozeScore = 0, clozeTimer = 60, clozeTimerId = null, currentLanguage_cr;
let clozeTimerSpan, clozeScoreSpan, clozeSentenceEl, clozeOptionsContainer, clozeNextBtn, deckTitle;

function saveClozeProgress() {
    const progressKey = `cosy_cloze_progress_${currentLanguage_cr}`;
    const progress = { score: clozeScore, index: currentClozeIndex };
    localStorage.setItem(progressKey, JSON.stringify(progress));
}

function loadClozeProgress() {
    const progressKey = `cosy_cloze_progress_${currentLanguage_cr}`;
    const savedProgress = JSON.parse(localStorage.getItem(progressKey));
    if (savedProgress) {
        clozeScore = savedProgress.score || 0;
        currentClozeIndex = savedProgress.index || 0;
    } else {
        clozeScore = 0;
        currentClozeIndex = 0;
    }
}

function handleAnswerClick(selectedAnswer, correctAnswer, button) {
    const optionButtons = clozeOptionsContainer.querySelectorAll('button');
    optionButtons.forEach(btn => btn.disabled = true);
    if (selectedAnswer === correctAnswer) {
        clozeScore++;
        clozeScoreSpan.textContent = clozeScore;
        button.style.backgroundColor = 'lightgreen';
    } else {
        button.style.backgroundColor = 'lightcoral';
        optionButtons.forEach(btn => {
            if (btn.textContent === correctAnswer) {
                btn.style.backgroundColor = 'lightgreen';
            }
        });
    }
    currentClozeIndex++;
    saveClozeProgress();
    clozeNextBtn.textContent = 'Next Question';
    clozeNextBtn.style.display = 'block';
    clozeNextBtn.removeEventListener('click', startClozeRace);
    clozeNextBtn.addEventListener('click', displayNextSentence, { once: true });
}

function displayNextSentence() {
    if (currentClozeIndex >= clozeData.length) {
        endClozeRace('You completed all sentences!');
        return;
    }
    const sentenceObject = clozeData[currentClozeIndex];
    const sentenceText = sentenceObject.sentence_template.replace('___', '______');
    clozeSentenceEl.textContent = sentenceText;
    const options = [...sentenceObject.options, sentenceObject.correct_answer];
    options.sort(() => 0.5 - Math.random());
    clozeOptionsContainer.innerHTML = '';
    options.forEach(optionText => {
        const button = document.createElement('button');
        button.textContent = optionText;
        button.addEventListener('click', () => handleAnswerClick(optionText, sentenceObject.correct_answer, button));
        clozeOptionsContainer.appendChild(button);
    });
    clozeNextBtn.style.display = 'none';
}

function endClozeRace(message) {
    clearInterval(clozeTimerId);
    clozeSentenceEl.textContent = `${message} Final Score: ${clozeScore}`;
    clozeOptionsContainer.innerHTML = '';
    clozeNextBtn.textContent = 'Play Again?';
    clozeNextBtn.removeEventListener('click', displayNextSentence);
    clozeNextBtn.addEventListener('click', () => resetClozeRace(true), { once: true });
}

function startClozeRace() {
    clozeTimerId = setInterval(() => {
        clozeTimer--;
        clozeTimerSpan.textContent = clozeTimer;
        if (clozeTimer <= 0) {
            endClozeRace('Time is up!');
        }
    }, 1000);
    displayNextSentence();
}

function resetClozeRace(clearProgress = false) {
    clearInterval(clozeTimerId);
    if (clearProgress) {
        const progressKey = `cosy_cloze_progress_${currentLanguage_cr}`;
        localStorage.removeItem(progressKey);
        clozeScore = 0;
        currentClozeIndex = 0;
    }
    clozeTimer = 60;
    clozeScoreSpan.textContent = clozeScore;
    clozeTimerSpan.textContent = clozeTimer;
    clozeSentenceEl.textContent = 'Click "Start" to begin the race!';
    clozeOptionsContainer.innerHTML = '';
    clozeNextBtn.textContent = 'Start';
    clozeNextBtn.style.display = 'block';
    clozeNextBtn.removeEventListener('click', displayNextSentence);
    clozeNextBtn.addEventListener('click', startClozeRace, { once: true });
}

async function loadClozeRace(language) {
    currentLanguage_cr = language;
    try {
        const response = await fetch(`data/${language}_cloze.json`);
        const data = await response.json();
        clozeData = data.cloze_sentences;
        deckTitle.textContent = `${data.lang} ${data.level}`;
        loadClozeProgress();
        resetClozeRace(false);
    } catch (error) {
        console.error('Could not load cloze race data:', error);
        clozeSentenceEl.textContent = 'Error loading game data. Please try another language.';
    }
}

export function initClozeRace(lang, elements) {
    clozeTimerSpan = elements.clozeTimerSpan;
    clozeScoreSpan = elements.clozeScoreSpan;
    clozeSentenceEl = elements.clozeSentenceEl;
    clozeOptionsContainer = elements.clozeOptionsContainer;
    clozeNextBtn = elements.clozeNextBtn;
    deckTitle = elements.deckTitle;
    loadClozeRace(lang);
}
