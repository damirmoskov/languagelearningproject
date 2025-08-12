let debateData = [], currentDebateIndex = 0;
let stage = 'for'; // for, against, conclusion, review
const userArguments = {};

let imageEl, topicEl, promptEl, userInputEl, submitBtn, reviewSectionEl, modelAnswersContainerEl, usefulPhrasesEl, nextDebateBtn, deckTitle;

function displayDebate() {
    const debate = debateData[currentDebateIndex];

    // Reset UI for new debate
    userInputEl.value = '';
    reviewSectionEl.style.display = 'none';
    modelAnswersContainerEl.innerHTML = '';
    usefulPhrasesEl.innerHTML = '';
    userInputEl.style.display = 'block';
    submitBtn.style.display = 'block';
    nextDebateBtn.style.display = 'none';

    if (currentDebateIndex >= debateData.length) {
        topicEl.textContent = "Game Over!";
        promptEl.textContent = "You have completed all debates.";
        userInputEl.style.display = 'none';
        submitBtn.style.display = 'none';
        nextDebateBtn.textContent = 'Play Again?';
        nextDebateBtn.style.display = 'block';
        return;
    }

    // Load new debate content
    imageEl.src = debate.image_url;
    topicEl.textContent = debate.topic;

    // Start with the first stage
    setStage('for');
}

function setStage(newStage) {
    stage = newStage;
    switch (stage) {
        case 'for':
            promptEl.textContent = 'Write one argument FOR the topic above.';
            break;
        case 'against':
            promptEl.textContent = 'Now, write one argument AGAINST the topic.';
            break;
        case 'conclusion':
            promptEl.textContent = 'Finally, write a brief concluding sentence.';
            break;
        case 'review':
            promptEl.textContent = 'Great job! Here are some model arguments and useful phrases.';
            userInputEl.style.display = 'none';
            submitBtn.style.display = 'none';
            displayReview();
            break;
    }
}

function handleSubmit() {
    const text = userInputEl.value.trim();
    if (text === '') {
        alert('Please write something!');
        return;
    }

    userArguments[stage] = text;
    userInputEl.value = ''; // Clear for next stage

    if (stage === 'for') {
        setStage('against');
    } else if (stage === 'against') {
        setStage('conclusion');
    } else if (stage === 'conclusion') {
        setStage('review');
    }
}

function displayReview() {
    const debate = debateData[currentDebateIndex];
    const modelArgs = debate.model_arguments;

    modelAnswersContainerEl.innerHTML = `
        <h4>Model Arguments</h4>
        <p><strong>For:</strong> ${modelArgs.for.join(' ')}</p>
        <p><strong>Against:</strong> ${modelArgs.against.join(' ')}</p>
        <p><strong>Conclusion:</strong> ${modelArgs.conclusion}</p>
    `;
    reviewSectionEl.style.display = 'block';

    let phrasesHTML = '<h4>Useful Phrases</h4><ul>';
    debate.useful_phrases.forEach(phrase => {
        phrasesHTML += `<li>${phrase}</li>`;
    });
    phrasesHTML += '</ul>';
    usefulPhrasesEl.innerHTML = phrasesHTML;

    nextDebateBtn.textContent = 'Next Debate';
    nextDebateBtn.style.display = 'block';
}

async function loadData(language) {
    try {
        const response = await fetch(`data/${language}_debate.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        debateData = data.debates;
        deckTitle.textContent = `${data.lang} ${data.level} - Picture Debate`;

        debateData.sort(() => 0.5 - Math.random());
        currentDebateIndex = 0;

        displayDebate();

    } catch (error) {
        console.error('Could not load debate data:', error);
        topicEl.textContent = 'Error loading game data.';
    }
}

export function initPictureDebate(lang, elements) {
    imageEl = elements.imageEl;
    topicEl = elements.topicEl;
    promptEl = elements.promptEl;
    userInputEl = elements.userInputEl;
    submitBtn = elements.submitBtn;
    reviewSectionEl = elements.reviewSectionEl;
    modelAnswersContainerEl = elements.modelAnswersContainerEl;
    usefulPhrasesEl = elements.usefulPhrasesEl;
    nextDebateBtn = elements.nextDebateBtn;
    deckTitle = elements.deckTitle;

    submitBtn.addEventListener('click', handleSubmit);
    nextDebateBtn.addEventListener('click', () => {
        if (nextDebateBtn.textContent === 'Play Again?') {
            loadData(lang);
        } else {
            currentDebateIndex++;
            displayDebate();
        }
    });

    loadData(lang);
}
