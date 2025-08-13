let challengeData = [], currentChallengeIndex = 0, score = 0;
let sentenceContainerEl, explanationContainerEl, feedbackEl, nextBtn, scoreEl, deckTitle;
let currentStage = 'find_word'; // 'find_word' or 'find_explanation'

function displayChallenge() {
    currentStage = 'find_word';
    const challenge = challengeData[currentChallengeIndex];

    // Reset UI
    sentenceContainerEl.innerHTML = '';
    explanationContainerEl.innerHTML = '';
    explanationContainerEl.style.display = 'none';
    feedbackEl.textContent = 'Click on the incorrect word in the sentence.';
    nextBtn.style.display = 'none';

    if (currentChallengeIndex >= challengeData.length) {
        sentenceContainerEl.textContent = "Game Over!";
        feedbackEl.textContent = `Final Score: ${score}`;
        nextBtn.textContent = 'Play Again?';
        nextBtn.style.display = 'block';
        return;
    }

    // Create clickable words for the sentence
    const words = challenge.sentence_with_error.split(' ');
    words.forEach(word => {
        const wordSpan = document.createElement('span');
        wordSpan.textContent = word;
        wordSpan.className = 'word';
        wordSpan.addEventListener('click', handleWordClick);
        sentenceContainerEl.appendChild(wordSpan);
        sentenceContainerEl.appendChild(document.createTextNode(' ')); // Add space between words
    });
}

function handleWordClick(event) {
    if (currentStage !== 'find_word') return;

    const clickedWord = event.target.textContent.replace(/[.,]/g, ''); // Normalize by removing punctuation
    const challenge = challengeData[currentChallengeIndex];

    if (clickedWord === challenge.error_word) {
        feedbackEl.textContent = 'Correct! Now, why is this word wrong?';
        event.target.style.backgroundColor = 'lightgreen';
        currentStage = 'find_explanation';

        // Disable further clicks on words
        sentenceContainerEl.querySelectorAll('.word').forEach(span => {
            span.removeEventListener('click', handleWordClick);
            span.style.pointerEvents = 'none';
        });

        displayExplanationOptions();
    } else {
        feedbackEl.textContent = 'That word is correct. Try to find the error.';
        event.target.style.backgroundColor = 'lightcoral';
        event.target.removeEventListener('click', handleWordClick); // Disable wrong word
    }
}

function displayExplanationOptions() {
    const challenge = challengeData[currentChallengeIndex];
    explanationContainerEl.style.display = 'block';

    challenge.explanation_options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.dataset.index = index;
        button.addEventListener('click', handleExplanationChoice);
        explanationContainerEl.appendChild(button);
    });
}

function handleExplanationChoice(event) {
    if (currentStage !== 'find_explanation') return;

    const selectedIndex = parseInt(event.target.dataset.index, 10);
    const challenge = challengeData[currentChallengeIndex];

    // Disable all explanation buttons
    explanationContainerEl.querySelectorAll('button').forEach(btn => {
        btn.disabled = true;
    });

    if (selectedIndex === challenge.correct_explanation_index) {
        feedbackEl.textContent = `Correct! ${challenge.explanation}`;
        score++;
        scoreEl.textContent = score;
        event.target.style.backgroundColor = 'lightgreen';
    } else {
        feedbackEl.textContent = `Not quite. The correct reason is: ${challenge.explanation_options[challenge.correct_explanation_index]}`;
        event.target.style.backgroundColor = 'lightcoral';
    }

    nextBtn.textContent = 'Next Challenge';
    nextBtn.style.display = 'block';
}

async function loadData(language) {
    try {
        const response = await fetch(`data/${language}_error_detection.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        challengeData = data.challenges;
        deckTitle.textContent = `${data.lang} ${data.level} - Wrong Ending Detective`;

        challengeData.sort(() => 0.5 - Math.random());
        currentChallengeIndex = 0;
        score = 0;
        scoreEl.textContent = score;

        displayChallenge();

    } catch (error) {
        console.error('Could not load error detection data:', error);
        sentenceContainerEl.textContent = 'Error loading game data.';
    }
}

export function initWrongEndingDetective(lang, elements) {
    sentenceContainerEl = elements.sentenceContainerEl;
    explanationContainerEl = elements.explanationContainerEl;
    feedbackEl = elements.feedbackEl;
    nextBtn = elements.nextBtn;
    scoreEl = elements.scoreEl;
    deckTitle = elements.deckTitle;

    nextBtn.addEventListener('click', () => {
        if (nextBtn.textContent === 'Play Again?') {
            loadData(lang);
        } else {
            currentChallengeIndex++;
            displayChallenge();
        }
    });

    loadData(lang);
}
