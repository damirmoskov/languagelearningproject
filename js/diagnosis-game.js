let challengeData = [], currentChallengeIndex = 0, score = 0;
let sceneEl, contextEl, optionsContainerEl, justificationEl, nextBtn, scoreEl, deckTitle;

function displayChallenge() {
    // Reset UI
    justificationEl.innerHTML = '';
    justificationEl.style.display = 'none';
    optionsContainerEl.innerHTML = '';
    nextBtn.style.display = 'none';

    if (currentChallengeIndex >= challengeData.length) {
        sceneEl.textContent = "You've completed all challenges!";
        contextEl.textContent = '';
        optionsContainerEl.innerHTML = '';
        nextBtn.textContent = 'Play Again?';
        nextBtn.style.display = 'block';
        return;
    }

    const challenge = challengeData[currentChallengeIndex];
    sceneEl.textContent = challenge.scene;
    contextEl.textContent = `Context: ${challenge.context}`;

    challenge.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.textContent = option;
        button.dataset.index = index;
        button.addEventListener('click', handleAnswer);
        optionsContainerEl.appendChild(button);
    });
}

function handleAnswer(event) {
    const selectedIndex = parseInt(event.target.dataset.index, 10);
    const challenge = challengeData[currentChallengeIndex];
    const correctIndex = challenge.correct_option_index;

    // Disable all option buttons
    optionsContainerEl.querySelectorAll('button').forEach((btn, index) => {
        btn.disabled = true;
        if (index === correctIndex) {
            btn.style.backgroundColor = 'lightgreen';
        }
    });

    if (selectedIndex === correctIndex) {
        score++;
        scoreEl.textContent = score;
        event.target.style.backgroundColor = 'lightgreen';
    } else {
        event.target.style.backgroundColor = 'lightcoral';
    }

    // Show justification
    justificationEl.innerHTML = `<p><strong>Justification:</strong> ${challenge.justification}</p>`;
    justificationEl.style.display = 'block';

    nextBtn.textContent = 'Next Challenge';
    nextBtn.style.display = 'block';
}

async function loadData(language) {
    try {
        const response = await fetch(`data/${language}_diagnosis_game.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        challengeData = data.challenges;
        deckTitle.textContent = `${data.lang} ${data.level} - Diagnosis Game`;

        challengeData.sort(() => 0.5 - Math.random());
        currentChallengeIndex = 0;
        score = 0;
        scoreEl.textContent = score;

        displayChallenge();

    } catch (error) {
        console.error('Could not load diagnosis game data:', error);
        sceneEl.textContent = 'Error loading game data.';
    }
}

export function initDiagnosisGame(lang, elements) {
    sceneEl = elements.sceneEl;
    contextEl = elements.contextEl;
    optionsContainerEl = elements.optionsContainerEl;
    justificationEl = elements.justificationEl;
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
