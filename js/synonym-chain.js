let thesaurus = {}, chainStarters = [], currentChain = [], score = 0;
let chainDisplayEl, currentWordEl, userInputEl, submitBtn, feedbackEl, scoreEl, newChainBtn, deckTitle;

function startNewChain() {
    // Pick a random starting word
    const startWord = chainStarters[Math.floor(Math.random() * chainStarters.length)];

    // Reset state
    currentChain = [startWord];
    score = 1;

    // Reset UI
    userInputEl.value = '';
    feedbackEl.textContent = 'Type a synonym for the word below and press Enter.';
    scoreEl.textContent = score;
    userInputEl.disabled = false;
    submitBtn.disabled = false;
    newChainBtn.style.display = 'none';

    updateChainDisplay();
}

function updateChainDisplay() {
    chainDisplayEl.textContent = currentChain.join(' → ');
    const lastWord = currentChain[currentChain.length - 1];
    currentWordEl.textContent = `Current word: ${lastWord}`;
    scoreEl.textContent = currentChain.length;
}

function handleGuess() {
    const guess = userInputEl.value.trim().toLowerCase();
    if (!guess) return;

    const currentWord = currentChain[currentChain.length - 1];

    // Check if the word is a valid synonym in our thesaurus
    const synonyms = thesaurus[currentWord] || [];
    if (synonyms.includes(guess)) {
        // Check if the word is already in the chain
        if (currentChain.includes(guess)) {
            feedbackEl.textContent = `You've already used "${guess}". Try another synonym.`;
        } else {
            // Correct guess
            currentChain.push(guess);
            feedbackEl.textContent = 'Correct! Keep it going.';
            updateChainDisplay();
        }
    } else {
        // Incorrect guess
        feedbackEl.textContent = `"${guess}" is not a recognized synonym. Your chain ended at ${currentChain.length} words.`;
        userInputEl.disabled = true;
        submitBtn.disabled = true;
        newChainBtn.style.display = 'block';
    }

    userInputEl.value = ''; // Clear input after each guess
}

async function loadData(language) {
    try {
        const response = await fetch(`data/${language}_synonym_chain.json`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();

        thesaurus = data.thesaurus;
        chainStarters = data.chains;
        deckTitle.textContent = `${data.lang} ${data.level} - Synonym Chain`;

        startNewChain();

    } catch (error) {
        console.error('Could not load synonym chain data:', error);
        chainDisplayEl.textContent = 'Error loading game data.';
    }
}

export function initSynonymChain(lang, elements) {
    chainDisplayEl = elements.chainDisplayEl;
    currentWordEl = elements.currentWordEl;
    userInputEl = elements.userInputEl;
    submitBtn = elements.submitBtn;
    feedbackEl = elements.feedbackEl;
    scoreEl = elements.scoreEl;
    newChainBtn = elements.newChainBtn;
    deckTitle = elements.deckTitle;

    submitBtn.addEventListener('click', handleGuess);
    userInputEl.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            handleGuess();
        }
    });
    newChainBtn.addEventListener('click', startNewChain);

    loadData(lang);
}
