let problemData = [], currentProblemIndex = 0;
let stage = 1; // 1, 2, 3, 'summary', 'review'
const userSolution = {};

let descriptionEl, promptEl, userInputEl, submitBtn, reviewSectionEl, modelSolutionContainerEl, usefulVocabEl, nextProblemBtn, deckTitle;

function displayProblem() {
    const problem = problemData[currentProblemIndex];

    // Reset UI for new problem
    userInputEl.value = '';
    reviewSectionEl.style.display = 'none';
    modelSolutionContainerEl.innerHTML = '';
    usefulVocabEl.innerHTML = '';
    userInputEl.style.display = 'block';
    submitBtn.style.display = 'block';
    nextProblemBtn.style.display = 'none';

    if (currentProblemIndex >= problemData.length) {
        descriptionEl.textContent = "Game Over!";
        promptEl.textContent = "You have completed all problems.";
        userInputEl.style.display = 'none';
        submitBtn.style.display = 'none';
        nextProblemBtn.textContent = 'Play Again?';
        nextProblemBtn.style.display = 'block';
        return;
    }

    // Load new problem content
    descriptionEl.textContent = problem.problem_description;

    // Start with the first stage
    setStage(1);
}

function setStage(newStage) {
    stage = newStage;
    const prompts = {
        1: "Step 1: What is the first thing you will do?",
        2: "Step 2: What is the next step?",
        3: "Step 3: What is the third step in your plan?",
        'summary': "Finally, write a short summary of your solution.",
        'review': "Great job! Here is a model solution and some useful vocabulary."
    };
    promptEl.textContent = prompts[stage];

    if (stage === 'review') {
        userInputEl.style.display = 'none';
        submitBtn.style.display = 'none';
        displayReview();
    }
}

function handleSubmit() {
    const text = userInputEl.value.trim();
    if (text === '') {
        alert('Please write something!');
        return;
    }

    userSolution[stage] = text;
    userInputEl.value = ''; // Clear for next stage

    if (stage === 1) setStage(2);
    else if (stage === 2) setStage(3);
    else if (stage === 3) setStage('summary');
    else if (stage === 'summary') setStage('review');
}

function displayReview() {
    const problem = problemData[currentProblemIndex];
    const model = problem.model_solution;

    modelSolutionContainerEl.innerHTML = `
        <h4>Model Solution</h4>
        <p><strong>Step 1:</strong> ${model.step1}</p>
        <p><strong>Step 2:</strong> ${model.step2}</p>
        <p><strong>Step 3:</strong> ${model.step3}</p>
        <p><strong>Summary:</strong> ${model.summary}</p>
    `;
    reviewSectionEl.style.display = 'block';

    let vocabHTML = '<h4>Useful Vocabulary</h4><ul>';
    problem.useful_vocabulary.forEach(phrase => {
        vocabHTML += `<li>${phrase}</li>`;
    });
    vocabHTML += '</ul>';
    usefulVocabEl.innerHTML = vocabHTML;

    nextProblemBtn.textContent = 'Next Problem';
    nextProblemBtn.style.display = 'block';
}

async function loadData(language) {
    try {
        const response = await fetch(`data/${language}_problem_solving.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        problemData = data.problems;
        deckTitle.textContent = `${data.lang} ${data.level} - Problem Solvers`;

        problemData.sort(() => 0.5 - Math.random());
        currentProblemIndex = 0;

        displayProblem();

    } catch (error) {
        console.error('Could not load problem solving data:', error);
        descriptionEl.textContent = 'Error loading game data.';
    }
}

export function initProblemSolvers(lang, elements) {
    descriptionEl = elements.descriptionEl;
    promptEl = elements.promptEl;
    userInputEl = elements.userInputEl;
    submitBtn = elements.submitBtn;
    reviewSectionEl = elements.reviewSectionEl;
    modelSolutionContainerEl = elements.modelSolutionContainerEl;
    usefulVocabEl = elements.usefulVocabEl;
    nextProblemBtn = elements.nextProblemBtn;
    deckTitle = elements.deckTitle;

    submitBtn.addEventListener('click', handleSubmit);
    nextProblemBtn.addEventListener('click', () => {
        if (nextProblemBtn.textContent === 'Play Again?') {
            loadData(lang);
        } else {
            currentProblemIndex++;
            displayProblem();
        }
    });

    loadData(lang);
}
