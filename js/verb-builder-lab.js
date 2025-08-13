// js/verb-builder-lab.js

// --- State ---
let verbs = [];
let currentChallenge = null;
let growthLevel = 0;
let domElements = {};

// --- Plant SVGs ---
const plantSVGs = [
    // Stage 0: Seed
    '<svg viewBox="0 0 100 100" class="vbl-plant"><path d="M45,80 a5,5 0 1,1 10,0 a5,5 0 1,1 -10,0" fill="#A0522D"/></svg>',
    // Stage 1: Sprout
    '<svg viewBox="0 0 100 100" class="vbl-plant"><path d="M45,80 a5,5 0 1,1 10,0 a5,5 0 1,1 -10,0" fill="#A0522D"/><path d="M50,80 Q45,60 50,50" stroke="#32CD32" stroke-width="4" fill="none" stroke-linecap="round"/></svg>',
    // Stage 2: Small Plant
    '<svg viewBox="0 0 100 100" class="vbl-plant"><path d="M50,80 Q55,60 50,40" stroke="#32CD32" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M50,65 Q40,55 45,45" stroke="#32CD32" stroke-width="4" fill="none" stroke-linecap="round"/></svg>',
    // Stage 3: Bigger Plant
    '<svg viewBox="0 0 100 100" class="vbl-plant"><path d="M50,80 Q45,60 50,30" stroke="#32CD32" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M50,65 Q40,55 45,45" stroke="#32CD32" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M50,60 Q60,50 55,40" stroke="#32CD32" stroke-width="4" fill="none" stroke-linecap="round"/></svg>',
    // Stage 4: Plant with Bud
    '<svg viewBox="0 0 100 100" class="vbl-plant"><path d="M50,80 Q45,60 50,30" stroke="#32CD32" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M50,65 Q40,55 45,45" stroke="#32CD32" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M50,60 Q60,50 55,40" stroke="#32CD32" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="50" cy="25" r="5" fill="#FFC0CB"/></svg>',
    // Stage 5: Full Flower
    '<svg viewBox="0 0 100 100" class="vbl-plant"><path d="M50,80 Q45,60 50,30" stroke="#32CD32" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M50,65 Q40,55 45,45" stroke="#32CD32" stroke-width="4" fill="none" stroke-linecap="round"/><path d="M50,60 Q60,50 55,40" stroke="#32CD32" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="50" cy="25" r="7" fill="#FFD700"/><path d="M50,18 a10,10 0 0,1 0,14 M43,25 a10,10 0 0,1 14,0 M57,25 a10,10 0 0,1 -14,0 M50,32 a10,10 0 0,1 0,-14" fill="#FF69B4" stroke="#FF1493"/></svg>'
];


// --- Core Functions ---

async function loadVerbData(language) {
    const dataFile = `data/${language}_verbs.json`;
    try {
        const response = await fetch(dataFile);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        verbs = data.verbs;
        return true;
    } catch (error) {
        console.error("Could not load verb data:", error);
        if (domElements.plantContainer) {
            domElements.plantContainer.innerHTML = `<p style="color: red;">Error: Could not load verb data for ${language}. Please select another language.</p>`;
            domElements.optionsContainer.innerHTML = '';
            domElements.feedback.textContent = '';
        }
        return false;
    }
}

function getDisplayEnding(verb, fullConjugation) {
    if (verb.root && fullConjugation.startsWith(verb.root)) {
        return fullConjugation.substring(verb.root.length);
    }
    return fullConjugation; // For irregular verbs, the "ending" is the full word
}


function startNewRound() {
    if (!verbs || verbs.length === 0) {
        console.error("No verbs loaded to start a new round.");
        return;
    }

    domElements.feedback.textContent = '';
    domElements.nextBtn.style.display = 'none';

    const verb = verbs[Math.floor(Math.random() * verbs.length)];
    const tenses = Object.keys(verb.conjugations);
    const tense = tenses[Math.floor(Math.random() * tenses.length)];
    const persons = Object.keys(verb.conjugations[tense]);
    const person = persons[Math.floor(Math.random() * persons.length)];

    const fullConjugation = verb.conjugations[tense][person];
    const displayEnding = getDisplayEnding(verb, fullConjugation);

    currentChallenge = { verb, tense, person, fullConjugation, displayEnding };

    renderChallenge();
}

function renderChallenge() {
    if (!currentChallenge) return;

    domElements.person.textContent = currentChallenge.person;
    domElements.tense.textContent = currentChallenge.tense;

    if (currentChallenge.verb.root) {
        domElements.verbRoot.textContent = currentChallenge.verb.root;
        domElements.verbEnding.textContent = '?';
    } else {
        domElements.verbRoot.textContent = `(${currentChallenge.verb.verb})`;
        domElements.verbEnding.textContent = '';
    }

    renderOptions();
    renderPlant();
}

function renderOptions() {
    const { displayEnding } = currentChallenge;
    const options = new Set([displayEnding]);

    while (options.size < 4 && verbs.length > 0) {
        const randomVerb = verbs[Math.floor(Math.random() * verbs.length)];
        const randomTenseKey = Object.keys(randomVerb.conjugations)[0];
        const randomTense = randomVerb.conjugations[randomTenseKey];
        const randomPerson = Object.keys(randomTense)[Math.floor(Math.random() * Object.keys(randomTense).length)];
        const randomFullConjugation = randomTense[randomPerson];
        const distractor = getDisplayEnding(randomVerb, randomFullConjugation);

        if (distractor !== undefined) {
             options.add(distractor);
        }
    }

    const shuffledOptions = Array.from(options).sort(() => Math.random() - 0.5);

    domElements.optionsContainer.innerHTML = '';
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option === "" ? "[no ending]" : option;
        button.classList.add('vbl-option-btn');
        button.onclick = () => checkAnswer(option);
        domElements.optionsContainer.appendChild(button);
    });
}

function renderPlant() {
    if (domElements.plantContainer) {
        domElements.plantContainer.innerHTML = plantSVGs[growthLevel];
    }
}

function checkAnswer(selectedOption) {
    if (selectedOption === currentChallenge.displayEnding) {
        domElements.feedback.textContent = 'Correct!';
        domElements.feedback.style.color = 'green';

        if (currentChallenge.verb.root) {
            domElements.verbEnding.textContent = currentChallenge.displayEnding;
        } else {
            domElements.verbRoot.textContent = currentChallenge.fullConjugation;
            domElements.verbEnding.textContent = '';
        }

        if (growthLevel < plantSVGs.length - 1) {
            growthLevel++;
        }
        renderPlant();
        domElements.nextBtn.style.display = 'block';
        domElements.optionsContainer.querySelectorAll('button').forEach(btn => {
            btn.disabled = true;
            if (btn.textContent === (selectedOption === "" ? "[no ending]" : selectedOption)) {
                btn.classList.add('correct');
            }
        });
    } else {
        domElements.feedback.textContent = 'Not quite, try again!';
        domElements.feedback.style.color = 'red';
        const clickedButton = Array.from(domElements.optionsContainer.querySelectorAll('button')).find(btn => btn.textContent === (selectedOption === "" ? "[no ending]" : selectedOption));
        if (clickedButton) {
            clickedButton.classList.add('incorrect');
            clickedButton.disabled = true;
        }
    }
}

export async function initVerbBuilderLab(language, elements) {
    domElements = elements;
    growthLevel = 0;

    const loaded = await loadVerbData(language);
    if (loaded) {
        startNewRound();
    }

    domElements.nextBtn.onclick = () => {
        domElements.optionsContainer.querySelectorAll('button').forEach(btn => {
            btn.disabled = false;
            btn.classList.remove('correct', 'incorrect');
        });
        startNewRound();
    };
}
