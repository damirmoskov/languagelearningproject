let cards = [];
let flippedCards = [];
let matches = 0;
let attempts = 0;
let lockBoard = false;
let cardData = [];
let matchedIDs = [];
let currentLanguage_mm;
let gameBoard, matchesCountSpan, attemptsCountSpan, deckTitle;

const langCodeMap = {
    french: 'fr-FR',
    spanish: 'es-ES',
    italian: 'it-IT',
    german: 'de-DE',
};

function speak(text, lang) {
    if (!window.speechSynthesis) {
        console.warn("Browser does not support speech synthesis.");
        return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = langCodeMap[lang.split('_')[0]];
    if (langCode) {
        utterance.lang = langCode;
    }
    window.speechSynthesis.speak(utterance);
}

function handleCardKeyPress(event) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault(); // Prevent space from scrolling
        handleCardClick(event);
    }
}

function handleCardClick(event) {
    if (lockBoard) return;
    const clickedCard = event.currentTarget;
    if (clickedCard === flippedCards[0] || clickedCard.classList.contains('flipped')) return;

    clickedCard.classList.add('flipped');
    flippedCards.push(clickedCard);

    if (flippedCards.length === 2) {
        lockBoard = true;
        attempts++;
        attemptsCountSpan.textContent = attempts;
        checkForMatch();
    }
}

function checkForMatch() {
    const [card1, card2] = flippedCards;
    const isMatch = card1.dataset.id === card2.dataset.id;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    matches++;
    matchesCountSpan.textContent = matches;
    const matchedId = flippedCards[0].dataset.id;
    matchedIDs.push(matchedId);

    const matchedItem = cardData.find(item => item.id === matchedId);
    if (matchedItem) {
        speak(matchedItem.word, currentLanguage_mm);
    }

    flippedCards.forEach(card => {
        card.removeEventListener('click', handleCardClick);
        card.removeEventListener('keydown', handleCardKeyPress);
        card.setAttribute('aria-label', `Matched: ${card.dataset.type === 'word' ? card.innerText : matchedItem.word}`);
    });
    flippedCards = [];
    lockBoard = false;
    saveProgress();
    if (matches === cardData.length) {
        setTimeout(() => alert('You won! Congratulations!'), 500);
    }
}

function unflipCards() {
    setTimeout(() => {
        flippedCards.forEach(card => card.classList.remove('flipped'));
        flippedCards = [];
        lockBoard = false;
    }, 1000);
}

function saveProgress() {
    const progressKey = `cosy_progress_${currentLanguage_mm}`;
    const progress = { attempts: attempts, matchedIDs: matchedIDs };
    localStorage.setItem(progressKey, JSON.stringify(progress));
}

function loadProgress() {
    const progressKey = `cosy_progress_${currentLanguage_mm}`;
    const savedProgress = JSON.parse(localStorage.getItem(progressKey));
    if (savedProgress) {
        attempts = savedProgress.attempts || 0;
        matchedIDs = savedProgress.matchedIDs || [];
        matches = matchedIDs.length;
    } else {
        [matches, attempts, matchedIDs] = [0, 0, []];
    }
}

function createBoard() {
    gameBoard.innerHTML = '';
    let gameCards = [];
    cardData.forEach(item => {
        gameCards.push({ type: 'word', value: item.word, id: item.id });
        gameCards.push({ type: 'image', value: item.image, id: item.id });
    });
    gameCards.sort(() => 0.5 - Math.random());
    gameCards.forEach(cardInfo => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.dataset.id = cardInfo.id;
        cardElement.dataset.type = cardInfo.type;

        cardElement.setAttribute('role', 'button');
        cardElement.setAttribute('tabindex', '0');
        cardElement.setAttribute('aria-label', 'Memory card');

        const cardBackClass = cardInfo.type === 'image' ? 'card-back card-back-image' : 'card-back';
        const cardBackContent = cardInfo.type === 'image' ? `<img src="${cardInfo.value}" alt="Image for ${cardInfo.id}" style="width: 100%; height: 100%; object-fit: cover;">` : cardInfo.value;
        cardElement.innerHTML = `<div class="card-face card-front">?</div><div class="card-face ${cardBackClass}">${cardBackContent}</div>`;

        if (matchedIDs.includes(cardInfo.id)) {
            cardElement.classList.add('matched');
            const matchedItem = cardData.find(item => item.id === cardInfo.id);
            cardElement.setAttribute('aria-label', `Matched: ${cardInfo.type === 'word' ? cardInfo.value : matchedItem.word}`);
        } else {
            cardElement.addEventListener('click', handleCardClick);
            cardElement.addEventListener('keydown', handleCardKeyPress);
        }
        gameBoard.appendChild(cardElement);
    });
}

function resetGame(clearProgress = true) {
    if (clearProgress) {
        const progressKey = `cosy_progress_${currentLanguage_mm}`;
        localStorage.removeItem(progressKey);
        [matches, attempts, matchedIDs] = [0, 0, []];
    }
    [cards, flippedCards] = [[], []];
    lockBoard = false;
    matchesCountSpan.textContent = matches;
    attemptsCountSpan.textContent = attempts;
    createBoard();
}

async function loadMemoryMatch(language) {
    currentLanguage_mm = language;
    try {
        const response = await fetch(`data/${language}.json`);
        const data = await response.json();
        cardData = data.wordlist;
        deckTitle.textContent = `${data.lang} ${data.level}`;
        loadProgress();
        resetGame(false);
    } catch (error) {
        console.error('Could not load memory match data:', error);
        gameBoard.innerHTML = '<p>Error loading game data. Please try again later.</p>';
    }
}

export function initMemoryMatch(lang, elements) {
    gameBoard = elements.gameBoard;
    matchesCountSpan = elements.matchesCountSpan;
    attemptsCountSpan = elements.attemptsCountSpan;
    deckTitle = elements.deckTitle;
    elements.resetButton.onclick = () => resetGame(true);
    loadMemoryMatch(lang);
}
