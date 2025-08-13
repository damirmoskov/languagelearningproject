let challengeData = [], currentChallengeIndex = 0, currentLanguage_rt;
let challengePromptEl, userInputEl, submitBtn, modelAnswerEl, feedbackEl, nextBtn, deckTitle;

function displayChallenge() {
    // Reset UI for the new challenge
    userInputEl.value = '';
    feedbackEl.textContent = '';
    modelAnswerEl.style.display = 'none';
    userInputEl.style.display = 'block';
    submitBtn.style.display = 'block';
    nextBtn.style.display = 'none';
    userInputEl.disabled = false;
    submitBtn.disabled = false;

    if (currentChallengeIndex >= challengeData.length) {
        challengePromptEl.textContent = "You've completed all challenges!";
        userInputEl.style.display = 'none';
        submitBtn.style.display = 'none';
        nextBtn.textContent = 'Play Again?';
        nextBtn.style.display = 'block';
        return;
    }

    const challenge = challengeData[currentChallengeIndex];
    challengePromptEl.textContent = `How would you define "${challenge.word_to_define}" without using the word itself?`;
}

function handleSubmit() {
    const userDefinition = userInputEl.value.trim().toLowerCase();
    const challenge = challengeData[currentChallengeIndex];

    if (userDefinition === '') {
        feedbackEl.textContent = "Please write a definition.";
        return;
    }

    // Check for forbidden words
    const usedForbiddenWords = challenge.forbidden_words.filter(word => userDefinition.includes(word.toLowerCase()));

    if (usedForbiddenWords.length > 0) {
        feedbackEl.textContent = `You used a forbidden word: "${usedForbiddenWords[0]}". Please try again without it.`;
        return;
    }

    // Show model answer for self-assessment
    feedbackEl.textContent = "Good job! Here is a model definition for you to compare:";
    modelAnswerEl.querySelector('p').textContent = challenge.model_definition;
    modelAnswerEl.style.display = 'block';

    // Disable input and show 'Next' button
    userInputEl.disabled = true;
    submitBtn.disabled = true;
    nextBtn.textContent = 'Next Challenge';
    nextBtn.style.display = 'block';
}

function nextChallenge() {
    currentChallengeIndex++;
    displayChallenge();
}

async function loadData(language) {
    currentLanguage_rt = language;
    try {
        const response = await fetch(`data/${language}_reverse_translation.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        challengeData = data.challenges;
        deckTitle.textContent = `${data.lang} ${data.level} - Reverse Translation`;

        challengeData.sort(() => 0.5 - Math.random()); // Shuffle challenges
        currentChallengeIndex = 0;

        displayChallenge();

    } catch (error) {
        console.error('Could not load reverse translation data:', error);
        challengePromptEl.textContent = 'Error loading game data. Please try another language.';
    }
}

export function initReverseTranslation(lang, elements) {
    challengePromptEl = elements.challengePromptEl;
    userInputEl = elements.userInputEl;
    submitBtn = elements.submitBtn;
    modelAnswerEl = elements.modelAnswerEl;
    feedbackEl = elements.feedbackEl;
    nextBtn = elements.nextBtn;
    deckTitle = elements.deckTitle;

    submitBtn.addEventListener('click', handleSubmit);
    userInputEl.addEventListener('keyup', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            handleSubmit();
        }
    });
    nextBtn.addEventListener('click', () => {
        if (nextBtn.textContent === 'Play Again?') {
            loadData(currentLanguage_rt);
        } else {
            nextChallenge();
        }
    });

    loadData(lang);
}
