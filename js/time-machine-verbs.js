// js/time-machine-verbs.js

// --- State ---
let challenges = [];
let verbs = [];
let currentChallenge = null;
let currentVerbData = null;
let domElements = {};
const tenseMapping = ['imparfait', 'présent', 'futur'];

// --- Core Functions ---

async function loadData(language) {
    console.log("TMV: Loading data...");
    const challengeFile = `data/french_a2_time_machine.json`;
    const verbFile = `data/french_a2_verbs.json`;
    try {
        const [challengeResponse, verbResponse] = await Promise.all([
            fetch(challengeFile),
            fetch(verbFile)
        ]);
        if (!challengeResponse.ok || !verbResponse.ok) {
            throw new Error(`HTTP error! Could not load all required data.`);
        }
        challenges = (await challengeResponse.json()).challenges;
        verbs = (await verbResponse.json()).verbs;
        console.log("TMV: Data loaded successfully.");
        return true;
    } catch (error) {
        console.error("TMV: Could not load data:", error);
        return false;
    }
}

function startRound() {
    console.log("TMV: Starting new round...");
    domElements.checkBtn.disabled = false;
    domElements.tenseSlider.disabled = false;
    domElements.nextBtn.style.display = 'none';
    domElements.feedback.textContent = '';
    domElements.tenseSlider.value = 1;

    currentChallenge = challenges[Math.floor(Math.random() * challenges.length)];
    console.log(`TMV: Selected challenge for verb: ${currentChallenge.verb}`);

    currentVerbData = verbs.find(v => v.verb === currentChallenge.verb);

    if (!currentVerbData) {
        console.error(`TMV: Verb data for "${currentChallenge.verb}" not found.`);
        domElements.promptSentence.textContent = `Error: Verb '${currentChallenge.verb}' not in verbs list.`;
        return;
    }

    domElements.promptImage.src = currentChallenge.image_url;
    updateVerbDisplay();
}

function updateVerbDisplay() {
    console.log("TMV: --- Updating Display ---");
    const sliderValue = domElements.tenseSlider.value;
    const currentTense = tenseMapping[sliderValue];
    let subjectKey = currentChallenge.subject;

    console.log(`TMV: Base info: verb='${currentVerbData.verb}', tense='${currentTense}', subject='${subjectKey}'`);

    // Handle grouped subject pronouns like 'il/elle/on'
    if (['il', 'elle', 'on'].includes(subjectKey) && !currentVerbData.conjugations[currentTense].hasOwnProperty(subjectKey)) {
        console.log(`TMV: Subject '${subjectKey}' not found directly, trying 'il/elle/on'`);
        subjectKey = 'il/elle/on';
    }

    const tenseConjugations = currentVerbData.conjugations[currentTense];
    if (!tenseConjugations) {
        console.error(`TMV: Tense object for '${currentTense}' does not exist.`);
        domElements.verbDisplay.textContent = `(No data for ${currentTense})`;
        return;
    }

    console.log(`TMV: Trying to access conjugation with subject key: '${subjectKey}'`);
    const verbForm = tenseConjugations[subjectKey];

    if (verbForm === undefined) {
        console.error(`TMV: Conjugation form for subject '${subjectKey}' is undefined.`);
        domElements.verbDisplay.textContent = `(No form for ${subjectKey})`;
        return;
    }

    const sentence = currentChallenge.prompt_template
        .replace('{subject}', currentChallenge.subject)
        .replace('{verb_form}', '___')
        .replace('{time_adverb}', currentChallenge.time_adverb);

    domElements.promptSentence.textContent = sentence;
    domElements.verbDisplay.textContent = verbForm;
    console.log(`TMV: Success! Display updated. Sentence: "${sentence}", Verb: "${verbForm}"`);

    const container = domElements.container;
    container.classList.remove('tmv-past', 'tmv-present', 'tmv-future');
    if (currentTense === 'imparfait') container.classList.add('tmv-past');
    else if (currentTense === 'présent') container.classList.add('tmv-present');
    else if (currentTense === 'futur') container.classList.add('tmv-future');
}

function checkAnswer() {
    console.log("TMV: Checking answer...");
    domElements.checkBtn.disabled = true;
    domElements.tenseSlider.disabled = true;

    const selectedTense = tenseMapping[domElements.tenseSlider.value];

    if (selectedTense === currentChallenge.correct_tense) {
        domElements.feedback.textContent = 'Correct!';
        domElements.feedback.style.color = 'green';
    } else {
        domElements.feedback.textContent = `Not quite. The correct tense was ${currentChallenge.correct_tense}.`;
        domElements.feedback.style.color = 'red';
    }
    domElements.nextBtn.style.display = 'block';
}

export async function initTimeMachineVerbs(language, elements) {
    console.log("TMV: Initializing Time Machine Verbs game...");
    domElements = elements;
    console.log("TMV: DOM element keys received:", Object.keys(domElements));
    const loaded = await loadData(language);
    if (loaded) {
        console.log("TMV: Data loaded. Setting up event listeners and starting first round.");
        domElements.tenseSlider.addEventListener('input', updateVerbDisplay);
        domElements.checkBtn.addEventListener('click', checkAnswer);
        domElements.nextBtn.addEventListener('click', startRound);
        startRound();
    } else {
        console.error("TMV: Initialization failed because data did not load.");
    }
}
