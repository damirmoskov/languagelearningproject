import { sm2, createNewCard } from './srs.js';

// --- DOM Elements ---
let cardFrontEl, cardBackEl, flipBtn, recallButtonsContainer;
let statsNewEl, statsLearningEl, statsReviewEl, deckTitleEl;

// --- Game State ---
let currentLanguage_af;
let allCards = []; // All cards for the language, with word data and SRS data merged
let reviewQueue = [];
let currentCard = null;

// --- LocalStorage Key ---
const getStorageKey = () => `cosy_srs_${currentLanguage_af}`;

/**
 * Loads vocabulary and SRS data, then merges them.
 */
async function loadData() {
    // 1. Load vocabulary from JSON
    const response = await fetch(`data/${currentLanguage_af}.json`);
    const vocabData = await response.json();
    deckTitleEl.textContent = `${vocabData.lang} ${vocabData.level} - Flashcards`;

    // 2. Load SRS data from localStorage
    const storageKey = getStorageKey();
    const storedSrsData = JSON.parse(localStorage.getItem(storageKey) || '{}');

    // 3. Merge vocab with SRS data
    allCards = vocabData.wordlist.map(wordItem => {
        const srsInfo = storedSrsData[wordItem.id] || createNewCard(wordItem.id);
        return { ...wordItem, ...srsInfo };
    });

    // 4. Save back to storage in case there were new cards
    saveSrsData();
}

/**
 * Saves the current state of all cards' SRS data to localStorage.
 */
function saveSrsData() {
    const srsDataToStore = allCards.reduce((acc, card) => {
        acc[card.id] = {
            id: card.id,
            repetition: card.repetition,
            easeFactor: card.easeFactor,
            interval: card.interval,
            dueDate: card.dueDate,
        };
        return acc;
    }, {});
    localStorage.setItem(getStorageKey(), JSON.stringify(srsDataToStore));
}

/**
 * Builds the queue of cards to review today and updates stats.
 */
function buildReviewQueue() {
    const todayStr = new Date().toISOString().split('T')[0];

    // Cards are due if they have no due date (new) or the date is today or earlier.
    reviewQueue = allCards.filter(card => !card.dueDate || card.dueDate <= todayStr);

    // Update stats display
    const newCount = allCards.filter(c => c.repetition === 0).length;
    const learningCount = allCards.filter(c => c.repetition > 0 && c.interval < 21).length; // Simplified: interval < 3 weeks

    statsNewEl.textContent = newCount;
    statsLearningEl.textContent = learningCount;
    statsReviewEl.textContent = reviewQueue.length;
}

/**
 * Displays the next card from the queue.
 */
function showNextCard() {
    if (reviewQueue.length === 0) {
        cardFrontEl.innerHTML = '<h2>Done for today! 🎉</h2>';
        cardBackEl.style.display = 'none';
        flipBtn.style.display = 'none';
        recallButtonsContainer.style.display = 'none';
        statsReviewEl.textContent = 0;
        return;
    }

    currentCard = reviewQueue.shift(); // Get the next card

    // Display the front of the card
    cardFrontEl.textContent = currentCard.word;
    cardBackEl.textContent = `${currentCard.translation}`;

    // Reset UI state
    cardFrontEl.style.display = 'flex';
    cardBackEl.style.display = 'none';
    flipBtn.style.display = 'block';
    recallButtonsContainer.style.display = 'none';

    // Update stats for the card being reviewed
    statsReviewEl.textContent = reviewQueue.length + 1;
}

/**
 * Flips the current card to show the back.
 */
function flipCard() {
    cardBackEl.style.display = 'flex';
    flipBtn.style.display = 'none';
    recallButtonsContainer.style.display = 'flex';
}

/**
 * Handles the user's recall quality selection.
 * @param {Event} event - The click event from the recall button.
 */
function handleRecall(event) {
    const quality = parseInt(event.target.dataset.quality, 10);

    // Update card state using the SRS algorithm
    const updatedCard = sm2(currentCard, quality);

    // Find the card in our main list and update it
    const cardIndex = allCards.findIndex(card => card.id === updatedCard.id);
    if (cardIndex !== -1) {
        allCards[cardIndex] = updatedCard;
    }

    // Save the new state and show the next card
    saveSrsData();
    buildReviewQueue(); // Re-build stats for the next turn
    showNextCard();
}

/**
 * Initializes the Adaptive Flashcards game.
 * @param {string} lang - The selected language code.
 * @param {object} elements - A dictionary of DOM elements for the game.
 */
export async function initAdaptiveFlashcards(lang, elements) {
    currentLanguage_af = lang;

    // Assign DOM elements
    cardFrontEl = elements.cardFront;
    cardBackEl = elements.cardBack;
    flipBtn = elements.flipBtn;
    recallButtonsContainer = elements.recallButtonsContainer;
    statsNewEl = elements.statsNew;
    statsLearningEl = elements.statsLearning;
    statsReviewEl = elements.statsReview;
    deckTitleEl = elements.deckTitle;

    // Detach old listeners before adding new ones to prevent memory leaks
    flipBtn.removeEventListener('click', flipCard);
    recallButtonsContainer.querySelectorAll('.recall-btn').forEach(btn => {
        btn.removeEventListener('click', handleRecall);
    });

    // Attach event listeners
    flipBtn.addEventListener('click', flipCard);
    recallButtonsContainer.querySelectorAll('.recall-btn').forEach(btn => {
        btn.addEventListener('click', handleRecall);
    });

    // Load data and start the game
    await loadData();
    buildReviewQueue();
    showNextCard();
}
