let scenarios = [];
let currentScenarioIndex = 0;
let currentChainIndex = 0;
let currentLanguage_cqa;

let imageEl, conversationLogEl, userInputEl, submitBtn, nextBtn, deckTitle;

function startNewScenario() {
    currentChainIndex = 0;
    conversationLogEl.innerHTML = '';
    userInputEl.value = '';
    userInputEl.disabled = false;
    submitBtn.disabled = false;
    nextBtn.style.display = 'none';

    if (currentScenarioIndex >= scenarios.length) {
        conversationLogEl.innerHTML = '<p>Congratulations! You have completed all scenarios.</p>';
        userInputEl.style.display = 'none';
        submitBtn.style.display = 'none';
        nextBtn.textContent = 'Play Again?';
        nextBtn.style.display = 'block';
        imageEl.style.display = 'none';
        return;
    }

    userInputEl.style.display = 'inline-block';
    submitBtn.style.display = 'inline-block';

    const scenario = scenarios[currentScenarioIndex];
    imageEl.src = scenario.image;
    imageEl.alt = `Prompt for scenario ${scenario.id}`;
    imageEl.style.display = 'block';

    displayQuestion();
}

function displayQuestion() {
    const scenario = scenarios[currentScenarioIndex];
    const question = scenario.chain[currentChainIndex].question;

    const questionP = document.createElement('p');
    questionP.className = 'bot-message';
    questionP.textContent = question;
    conversationLogEl.appendChild(questionP);
    conversationLogEl.scrollTop = conversationLogEl.scrollHeight;
}

function handleAnswer() {
    const userAnswer = userInputEl.value.trim();
    if (!userAnswer) return;

    const userP = document.createElement('p');
    userP.className = 'user-message';
    userP.textContent = userAnswer;
    conversationLogEl.appendChild(userP);

    const scenario = scenarios[currentScenarioIndex];
    const modelAnswer = scenario.chain[currentChainIndex].model_answer;

    const modelContainer = document.createElement('div');
    modelContainer.className = 'model-answer-container';

    const modelText = document.createElement('p');
    modelText.className = 'model-answer-message';
    modelText.innerHTML = `<strong>Model Answer:</strong> ${modelAnswer.text}`;
    modelContainer.appendChild(modelText);

    if (modelAnswer.image_feedback) {
        const modelImage = document.createElement('img');
        modelImage.src = modelAnswer.image_feedback;
        modelImage.className = 'feedback-image';
        modelImage.style.maxWidth = '200px';
        modelImage.style.maxHeight = '150px';
        modelImage.style.borderRadius = '5px';
        modelImage.style.marginTop = '5px';
        modelContainer.appendChild(modelImage);
    }

    conversationLogEl.appendChild(modelContainer);

    userInputEl.value = '';
    conversationLogEl.scrollTop = conversationLogEl.scrollHeight;

    currentChainIndex++;
    if (currentChainIndex < scenario.chain.length) {
        setTimeout(displayQuestion, 1000);
    } else {
        userInputEl.disabled = true;
        submitBtn.disabled = true;
        nextBtn.textContent = 'Next Scenario';
        nextBtn.style.display = 'block';
        currentScenarioIndex++;
    }
}

async function loadData(language) {
    currentLanguage_cqa = language;
    try {
        const response = await fetch(`data/${language}_chain_qa.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        scenarios = data.scenarios;
        if (deckTitle) {
            deckTitle.textContent = `${data.lang} ${data.level} - Chain Q&A`;
        }

        currentScenarioIndex = 0;
        startNewScenario();

    } catch (error) {
        console.error('Could not load Chain Q&A data:', error);
        if(conversationLogEl) {
            conversationLogEl.innerHTML = '<p>Error loading game data. Please try another language.</p>';
        }
    }
}

export function initChainQA(lang, elements) {
    if (!elements) {
        console.error("Chain Q&A elements not provided.");
        return;
    }
    imageEl = elements.imageEl;
    conversationLogEl = elements.conversationLogEl;
    userInputEl = elements.userInputEl;
    submitBtn = elements.submitBtn;
    nextBtn = elements.nextBtn;
    deckTitle = elements.deckTitle;

    submitBtn.addEventListener('click', handleAnswer);
    userInputEl.addEventListener('keyup', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleAnswer();
        }
    });

    nextBtn.addEventListener('click', () => {
        if (nextBtn.textContent === 'Play Again?') {
            currentScenarioIndex = 0;
        }
        startNewScenario();
    });

    loadData(lang);
}
