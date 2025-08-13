let challengeData = [], currentChallengeIndex = 0, score = 0;
let sentenceEl, moodEl, userInputEl, submitBtn, explanationEl, nextBtn, scoreEl, deckTitle;

function displayChallenge() {
    // Reset UI
    userInputEl.value = '';
    userInputEl.disabled = false;
    submitBtn.disabled = false;
    explanationEl.innerHTML = '';
    explanationEl.style.display = 'none';
    nextBtn.style.display = 'none';

    if (currentChallengeIndex >= challengeData.length) {
        sentenceEl.textContent = "You've completed all challenges!";
        moodEl.textContent = '';
        userInputEl.style.display = 'none';
        submitBtn.style.display = 'none';
        nextBtn.textContent = 'Play Again?';
        nextBtn.style.display = 'block';
        return;
    }

    userInputEl.style.display = 'block';
    submitBtn.style.display = 'block';

    const challenge = challengeData[currentChallengeIndex];
    sentenceEl.textContent = `"${challenge.neutral_sentence}"`;
    moodEl.textContent = `Express this sentence with the mood: ${challenge.mood}`;
}

function handleSubmit() {
    const challenge = challengeData[currentChallengeIndex];

    userInputEl.disabled = true;
    submitBtn.disabled = true;

    let explanationHTML = `<h4>Model Answers:</h4><ul>`;
    challenge.model_answers.forEach(answer => {
        explanationHTML += `<li>${answer}</li>`;
    });
    explanationHTML += `</ul><p><strong>Explanation:</strong> ${challenge.explanation}</p>`;

    explanationEl.innerHTML = explanationHTML;
    explanationEl.style.display = 'block';

    // For this game, we don't have a single "correct" answer,
    // so we'll just give a point for trying.
    score++;
    scoreEl.textContent = score;

    nextBtn.textContent = 'Next Challenge';
    nextBtn.style.display = 'block';
}

async function loadData(language) {
    try {
        const response = await fetch(`data/${language}_translate_the_mood.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        challengeData = data.challenges;
        if (!challengeData || challengeData.length === 0) {
            throw new Error("No challenges found in the data file.");
        }
        deckTitle.textContent = `${data.lang} ${data.level} - Translate the Mood`;

        // Shuffle and reset
        challengeData.sort(() => 0.5 - Math.random());
        currentChallengeIndex = 0;
        score = 0;
        scoreEl.textContent = score;

        displayChallenge();

    } catch (error) {
        console.error('Could not load translate the mood data:', error);
        sentenceEl.textContent = 'Error loading game data. Please check the console and the data file.';
        moodEl.textContent = '';
    }
}

export function initTranslateTheMood(lang, elements) {
    // Assign DOM elements from the elements object
    sentenceEl = elements.sentenceEl;
    moodEl = elements.moodEl;
    userInputEl = elements.userInputEl;
    submitBtn = elements.submitBtn;
    explanationEl = elements.explanationEl;
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
