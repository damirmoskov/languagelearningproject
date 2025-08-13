let storyData = [], currentStoryIndex = 0;
let storyStarterEl, userInputEl, submitBtn, modelContinuationsEl, nextBtn, deckTitle;

function displayChallenge() {
    // Reset UI for the new challenge
    userInputEl.value = '';
    modelContinuationsEl.innerHTML = '';
    modelContinuationsEl.style.display = 'none';
    userInputEl.style.display = 'block';
    submitBtn.style.display = 'block';
    nextBtn.style.display = 'none';
    userInputEl.disabled = false;
    submitBtn.disabled = false;

    if (currentStoryIndex >= storyData.length) {
        storyStarterEl.textContent = "You've completed all story prompts!";
        userInputEl.style.display = 'none';
        submitBtn.style.display = 'none';
        nextBtn.textContent = 'Play Again?';
        nextBtn.style.display = 'block';
        return;
    }

    const story = storyData[currentStoryIndex];
    storyStarterEl.textContent = story.story_starter;
}

function handleSubmit() {
    const userContinuation = userInputEl.value.trim();
    if (userContinuation === '') {
        alert('Please write a continuation for the story.');
        return;
    }

    // Hide input and show model answers for self-assessment
    userInputEl.disabled = true;
    submitBtn.disabled = true;
    displayModelAnswers();

    nextBtn.textContent = 'Next Story';
    nextBtn.style.display = 'block';
}

function displayModelAnswers() {
    const story = storyData[currentStoryIndex];
    let html = '<h4>Here are a few possible ways the story could continue:</h4><ul>';
    story.model_continuations.forEach(continuation => {
        html += `<li><strong>${continuation.type}:</strong> ${continuation.text}</li>`;
    });
    html += '</ul>';

    modelContinuationsEl.innerHTML = html;
    modelContinuationsEl.style.display = 'block';
}

async function loadData(language) {
    try {
        const response = await fetch(`data/${language}_story_continuation.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        storyData = data.stories;
        deckTitle.textContent = `${data.lang} ${data.level} - What Happens Next?`;

        storyData.sort(() => 0.5 - Math.random());
        currentStoryIndex = 0;

        displayChallenge();

    } catch (error) {
        console.error('Could not load story continuation data:', error);
        storyStarterEl.textContent = 'Error loading game data.';
    }
}

export function initWhatHappensNext(lang, elements) {
    storyStarterEl = elements.storyStarterEl;
    userInputEl = elements.userInputEl;
    submitBtn = elements.submitBtn;
    modelContinuationsEl = elements.modelContinuationsEl;
    nextBtn = elements.nextBtn;
    deckTitle = elements.deckTitle;

    submitBtn.addEventListener('click', handleSubmit);
    nextBtn.addEventListener('click', () => {
        if (nextBtn.textContent === 'Play Again?') {
            loadData(lang);
        } else {
            currentStoryIndex++;
            displayChallenge();
        }
    });

    loadData(lang);
}
