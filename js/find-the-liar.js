let scenarioData = [], currentScenarioIndex = 0, revealedClueCount = 0, score = 0;
let topicEl, statementsListEl, cluesListEl, revealClueBtn, feedbackEl, nextScenarioBtn, scoreEl, deckTitle;

function displayScenario() {
    // Reset UI
    revealedClueCount = 0;
    feedbackEl.textContent = '';
    statementsListEl.innerHTML = '';
    cluesListEl.innerHTML = '';
    revealClueBtn.style.display = 'block';
    nextScenarioBtn.style.display = 'none';
    revealClueBtn.disabled = false;

    if (currentScenarioIndex >= scenarioData.length) {
        topicEl.textContent = "Game Over!";
        statementsListEl.innerHTML = `<li>You have completed all scenarios. Final Score: ${score}</li>`;
        revealClueBtn.style.display = 'none';
        nextScenarioBtn.textContent = 'Play Again?';
        nextScenarioBtn.style.display = 'block';
        return;
    }

    const scenario = scenarioData[currentScenarioIndex];
    topicEl.textContent = `${scenario.character} is talking about: ${scenario.topic}`;

    scenario.statements.forEach((statement, index) => {
        const li = document.createElement('li');
        li.textContent = statement.text;
        li.dataset.index = index;
        li.addEventListener('click', handleGuess);
        statementsListEl.appendChild(li);
    });
}

function handleGuess(event) {
    const selectedIndex = parseInt(event.target.dataset.index, 10);
    const scenario = scenarioData[currentScenarioIndex];
    const selectedStatement = scenario.statements[selectedIndex];

    // Disable all statements after a guess
    statementsListEl.querySelectorAll('li').forEach(li => {
        li.removeEventListener('click', handleGuess);
        li.style.pointerEvents = 'none';
    });

    if (selectedStatement.is_lie) {
        feedbackEl.textContent = "Correct! That was the lie.";
        score++;
        scoreEl.textContent = score;
        event.target.style.backgroundColor = 'lightgreen';
    } else {
        feedbackEl.textContent = "That statement was true. The lie was another one.";
        event.target.style.backgroundColor = 'lightcoral';
        // Highlight the correct one
        statementsListEl.querySelectorAll('li').forEach((li, index) => {
            if (scenario.statements[index].is_lie) {
                li.style.backgroundColor = 'lightgreen';
            }
        });
    }

    revealClueBtn.style.display = 'none';
    nextScenarioBtn.textContent = 'Next Scenario';
    nextScenarioBtn.style.display = 'block';
}

function revealClue() {
    const scenario = scenarioData[currentScenarioIndex];
    if (revealedClueCount >= scenario.clues.length) {
        revealClueBtn.disabled = true;
        feedbackEl.textContent = "All clues revealed!";
        return;
    }

    const newClue = document.createElement('li');
    newClue.textContent = scenario.clues[revealedClueCount];
    cluesListEl.appendChild(newClue);
    revealedClueCount++;

    if (revealedClueCount >= scenario.clues.length) {
        revealClueBtn.disabled = true;
    }
}

async function loadData(language) {
    try {
        const response = await fetch(`data/${language}_find_the_liar.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        scenarioData = data.scenarios;
        deckTitle.textContent = `${data.lang} ${data.level} - Find the Liar`;

        scenarioData.sort(() => 0.5 - Math.random());
        currentScenarioIndex = 0;
        score = 0;
        scoreEl.textContent = score;

        displayScenario();

    } catch (error) {
        console.error('Could not load find the liar data:', error);
        topicEl.textContent = 'Error loading game data.';
    }
}

export function initFindTheLiar(lang, elements) {
    topicEl = elements.topicEl;
    statementsListEl = elements.statementsListEl;
    cluesListEl = elements.cluesListEl;
    revealClueBtn = elements.revealClueBtn;
    feedbackEl = elements.feedbackEl;
    nextScenarioBtn = elements.nextScenarioBtn;
    scoreEl = elements.scoreEl;
    deckTitle = elements.deckTitle;

    revealClueBtn.addEventListener('click', revealClue);
    nextScenarioBtn.addEventListener('click', () => {
        if (nextScenarioBtn.textContent === 'Play Again?') {
            loadData(lang);
        } else {
            currentScenarioIndex++;
            displayScenario();
        }
    });

    loadData(lang);
}
