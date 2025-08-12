let challengeData = [], currentChallengeIndex = 0, score = 0;
let metaphorEl, optionsContainerEl, explanationEl, nextBtn, scoreEl, deckTitle;

function displayChallenge() {
    // Reset UI
    explanationEl.innerHTML = '';
    explanationEl.style.display = 'none';
    optionsContainerEl.innerHTML = '';
    nextBtn.style.display = 'none';

    if (currentChallengeIndex >= challengeData.length) {
        metaphorEl.textContent = "You've completed all challenges!";
        optionsContainerEl.innerHTML = '';
        nextBtn.textContent = 'Play Again?';
        nextBtn.style.display = 'block';
        return;
    }

    const challenge = challengeData[currentChallengeIndex];
    metaphorEl.textContent = challenge.metaphor;

    const options = [...challenge.distractor_meanings, challenge.correct_meaning];
    options.sort(() => 0.5 - Math.random()); // Shuffle options

    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', handleAnswer);
        optionsContainerEl.appendChild(button);
    });
}

function handleAnswer(event) {
    const selectedAnswer = event.target.textContent;
    const challenge = challengeData[currentChallengeIndex];
    const correctAnswer = challenge.correct_meaning;

    // Disable all option buttons
    optionsContainerEl.querySelectorAll('button').forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correctAnswer) {
            btn.style.backgroundColor = 'lightgreen';
        }
    });

    if (selectedAnswer === correctAnswer) {
        score++;
        scoreEl.textContent = score;
        event.target.style.backgroundColor = 'lightgreen';
    } else {
        event.target.style.backgroundColor = 'lightcoral';
    }

    // Show explanation
    explanationEl.innerHTML = `<p><strong>Explanation:</strong> ${challenge.explanation}</p>`;
    explanationEl.style.display = 'block';

    nextBtn.textContent = 'Next Metaphor';
    nextBtn.style.display = 'block';
}

async function loadData(language) {
    try {
        const response = await fetch(`data/${language}_metaphor_match.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        challengeData = data.challenges;
        deckTitle.textContent = `${data.lang} ${data.level} - Metaphor Match`;

        challengeData.sort(() => 0.5 - Math.random());
        currentChallengeIndex = 0;
        score = 0;
        scoreEl.textContent = score;

        displayChallenge();

    } catch (error) {
        console.error('Could not load metaphor match data:', error);
        metaphorEl.textContent = 'Error loading game data.';
    }
}

export function initMetaphorMatch(lang, elements) {
    metaphorEl = elements.metaphorEl;
    optionsContainerEl = elements.optionsContainerEl;
    explanationEl = elements.explanationEl;
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
