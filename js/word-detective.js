let challengeData = [], currentChallengeIndex = 0, score = 0;
let paragraphEl, userInputEl, submitBtn, definitionContainerEl, mcqContainerEl, nextBtn, scoreEl, deckTitle;
let currentStage = 'define'; // 'define' or 'mcq'

function displayChallenge() {
    currentStage = 'define';
    const challenge = challengeData[currentChallengeIndex];

    // Reset UI
    userInputEl.value = '';
    definitionContainerEl.style.display = 'none';
    mcqContainerEl.innerHTML = '';
    mcqContainerEl.style.display = 'none';
    userInputEl.style.display = 'block';
    submitBtn.style.display = 'block';
    nextBtn.style.display = 'none';
    userInputEl.disabled = false;
    submitBtn.disabled = false;

    if (currentChallengeIndex >= challengeData.length) {
        paragraphEl.textContent = "You've completed all challenges!";
        userInputEl.style.display = 'none';
        submitBtn.style.display = 'none';
        nextBtn.textContent = 'Play Again?';
        nextBtn.style.display = 'block';
        return;
    }

    // Display paragraph with highlighted word
    const highlightedText = challenge.paragraph.replace(
        `{${challenge.target_word}}`,
        `<strong class="highlight">${challenge.target_word}</strong>`
    );
    paragraphEl.innerHTML = highlightedText;
}

function handleSubmitDefinition() {
    if (userInputEl.value.trim() === '') {
        alert('Please write a definition first.');
        return;
    }

    // Hide definition input and show the dictionary info
    userInputEl.style.display = 'none';
    submitBtn.style.display = 'none';

    displayDefinition();
    displayMCQ();
    currentStage = 'mcq';
}

function displayDefinition() {
    const challenge = challengeData[currentChallengeIndex];
    definitionContainerEl.innerHTML = `
        <h3>Definition: ${challenge.target_word}</h3>
        <p>${challenge.definition}</p>
        <p><strong>Synonyms:</strong> ${challenge.synonyms.join(', ')}</p>
        <p><strong>Antonyms:</strong> ${challenge.antonyms.join(', ')}</p>
    `;
    definitionContainerEl.style.display = 'block';
}

function displayMCQ() {
    const challenge = challengeData[currentChallengeIndex];
    const mcq = challenge.mcq_synonym;

    let mcqHTML = `<h4>${mcq.question}</h4>`;
    mcq.options.forEach(option => {
        mcqHTML += `<button class="mcq-option">${option}</button>`;
    });

    mcqContainerEl.innerHTML = mcqHTML;
    mcqContainerEl.style.display = 'block';

    mcqContainerEl.querySelectorAll('.mcq-option').forEach(button => {
        button.addEventListener('click', handleMCQChoice);
    });
}

function handleMCQChoice(event) {
    if (currentStage !== 'mcq') return;

    const selectedAnswer = event.target.textContent;
    const challenge = challengeData[currentChallengeIndex];
    const correctAnswer = challenge.mcq_synonym.correct_answer;

    mcqContainerEl.querySelectorAll('.mcq-option').forEach(btn => {
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

    nextBtn.style.display = 'block';
}

async function loadData(language) {
    try {
        const response = await fetch(`data/${language}_word_detective.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        challengeData = data.challenges;
        deckTitle.textContent = `${data.lang} ${data.level} - Word Detective`;

        challengeData.sort(() => 0.5 - Math.random());
        currentChallengeIndex = 0;
        score = 0;
        scoreEl.textContent = score;

        displayChallenge();

    } catch (error) {
        console.error('Could not load word detective data:', error);
        paragraphEl.textContent = 'Error loading game data.';
    }
}

export function initWordDetective(lang, elements) {
    paragraphEl = elements.paragraphEl;
    userInputEl = elements.userInputEl;
    submitBtn = elements.submitBtn;
    definitionContainerEl = elements.definitionContainerEl;
    mcqContainerEl = elements.mcqContainerEl;
    nextBtn = elements.nextBtn;
    scoreEl = elements.scoreEl;
    deckTitle = elements.deckTitle;

    submitBtn.addEventListener('click', handleSubmitDefinition);
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
