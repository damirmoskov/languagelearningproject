let challengeData = [], currentChallengeIndex = 0, score = 0;
let currentStage = 1; // 1 for initial hypothesis, 2 for revised hypothesis

// DOM Elements
let evidenceEl, promptEl, userInputEl, submitBtn, modelAnswerEl, nextBtn, scoreEl, deckTitle;

function displayChallenge() {
    // Reset UI for a new challenge
    currentStage = 1;
    userInputEl.value = '';
    userInputEl.disabled = false;
    modelAnswerEl.style.display = 'none';
    submitBtn.style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Hypothesis';
    nextBtn.style.display = 'none';

    if (currentChallengeIndex >= challengeData.length) {
        evidenceEl.textContent = "You've completed all challenges!";
        promptEl.textContent = '';
        userInputEl.style.display = 'none';
        submitBtn.style.display = 'none';
        nextBtn.textContent = 'Play Again?';
        nextBtn.style.display = 'block';
        return;
    }

    userInputEl.style.display = 'block';

    const challenge = challengeData[currentChallengeIndex];
    evidenceEl.textContent = `Evidence 1: ${challenge.evidence1}`;
    promptEl.textContent = challenge.hypothesis_prompt1;
}

function handleSubmit() {
    const challenge = challengeData[currentChallengeIndex];

    if (currentStage === 1) {
        // Transition to Stage 2
        currentStage = 2;
        evidenceEl.innerHTML = `
            <p><strong>Evidence 1:</strong> ${challenge.evidence1}</p>
            <p><strong>Evidence 2:</strong> ${challenge.evidence2}</p>
        `;
        promptEl.textContent = challenge.hypothesis_prompt2;
        userInputEl.value = ''; // Clear for the next hypothesis
        submitBtn.textContent = 'Submit Revised Hypothesis';
    } else if (currentStage === 2) {
        // End of the challenge, show model answer
        userInputEl.disabled = true;
        submitBtn.disabled = true;

        modelAnswerEl.innerHTML = `<p><strong>Model Hypothesis:</strong> ${challenge.model_hypothesis}</p>`;
        modelAnswerEl.style.display = 'block';

        score++;
        scoreEl.textContent = score;

        nextBtn.textContent = 'Next Challenge';
        nextBtn.style.display = 'block';
    }
}

async function loadData(language) {
    try {
        const response = await fetch(`data/${language}_two_stage_guess.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        challengeData = data.challenges;
        if (!challengeData || challengeData.length === 0) {
            throw new Error("No challenges found in the data file.");
        }
        deckTitle.textContent = `${data.lang} ${data.level} - Two-Stage Guess`;

        challengeData.sort(() => 0.5 - Math.random());
        currentChallengeIndex = 0;
        score = 0;
        scoreEl.textContent = score;

        displayChallenge();

    } catch (error) {
        console.error('Could not load two-stage guess data:', error);
        evidenceEl.textContent = 'Error loading game data.';
        promptEl.textContent = 'Please check the console and the data file.';
    }
}

export function initTwoStageGuess(lang, elements) {
    // Assign DOM elements
    evidenceEl = elements.evidenceEl;
    promptEl = elements.promptEl;
    userInputEl = elements.userInputEl;
    submitBtn = elements.submitBtn;
    modelAnswerEl = elements.modelAnswerEl;
    nextBtn = elements.nextBtn;
    scoreEl = elements.scoreEl;
    deckTitle = elements.deckTitle;

    // Attach event listeners
    submitBtn.addEventListener('click', handleSubmit);
    nextBtn.addEventListener('click', () => {
        if (nextBtn.textContent === 'Play Again?') {
            loadData(lang);
        } else {
            currentChallengeIndex++;
            displayChallenge();
        }
    });

    // Initial data load
    loadData(lang);
}
