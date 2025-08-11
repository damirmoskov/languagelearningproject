let clozeData = [];
let currentClozeIndex = 0;
let clozeScore = 0;
let clozeTimer = 60;
let clozeTimerId = null;
let currentLanguage_cr;
let clozeTimerSpan, clozeScoreSpan, clozeSentenceEl, clozeOptionsContainer, clozeNextBtn, deckTitle;

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
    const sentenceData = clozeData[currentClozeIndex];
    const sentenceText = sentenceData.sentence_template.replace('___', '______');
    clozeSentenceEl.textContent = sentenceText;
    const options = [...sentenceData.options, sentenceData.correct_answer];
    options.sort(() => 0.5 - Math.random());
    clozeOptionsContainer.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => handleAnswerClick(option, sentenceData.correct_answer, button));
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
    clozeNextBtn.addEventListener('click', resetClozeRace, { once: true });
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
function resetClozeRace() {
    clearInterval(clozeTimerId);
    clozeScore = 0;
    currentClozeIndex = 0;
    clozeTimer = 60;
    clozeScoreSpan.textContent = clozeScore;
    clozeTimerSpan.textContent = clozeTimer;
    clozeSentenceEl.textContent = 'Click "Start" to begin the race!';
    clozeOptionsContainer.innerHTML = '';
    clozeNextBtn.textContent = 'Start';
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
        resetClozeRace();
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
