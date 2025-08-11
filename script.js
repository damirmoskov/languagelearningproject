document.addEventListener('DOMContentLoaded', () => {
    console.log('COSYlanguages Memory Match game script loaded!');

    const gameBoard = document.getElementById('game-board');
    const matchesCountSpan = document.getElementById('matches-count');
    const attemptsCountSpan = document.getElementById('attempts-count');
    const resetButton = document.getElementById('reset-button');
    const languageSelector = document.getElementById('language-selector');
    const deckTitle = document.getElementById('deck-title');

    let currentLanguage = 'french_a2';
    let cards = [];
    let flippedCards = [];
    let matches = 0;
    let attempts = 0;
    let lockBoard = false;

    let cardData = [];
    let matchedIDs = [];

    async function loadGame() {
        try {
            const response = await fetch(`data/${currentLanguage}.json`);
            const data = await response.json();
            cardData = data.wordlist;
            deckTitle.textContent = `${data.lang} ${data.level}`;
            loadProgress();
            resetGame(false); // don't clear progress on initial load
        } catch (error) {
            console.error('Could not load game data:', error);
            gameBoard.innerHTML = '<p>Error loading game data. Please try again later.</p>';
        }
    }

    function createBoard() {
        gameBoard.innerHTML = ''; // Clear existing board
        let gameCards = [];
        cardData.forEach(item => {
            gameCards.push({ type: 'word', value: item.word, id: item.id });
            gameCards.push({ type: 'translation', value: item.translation, id: item.id });
        });

        // Shuffle cards
        gameCards.sort(() => 0.5 - Math.random());

        gameCards.forEach(cardInfo => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.id = cardInfo.id;
            cardElement.dataset.value = cardInfo.value;

            cardElement.innerHTML = `
                <div class="card-face card-front">?</div>
                <div class="card-face card-back">${cardInfo.value}</div>
            `;

            if (matchedIDs.includes(cardInfo.id)) {
                cardElement.classList.add('matched');
            } else {
                cardElement.addEventListener('click', handleCardClick);
            }

            gameBoard.appendChild(cardElement);
        });
    }

    function handleCardClick(event) {
        if (lockBoard) return;
        const clickedCard = event.currentTarget;
        if (clickedCard === flippedCards[0]) return;

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

        flippedCards.forEach(card => {
            card.removeEventListener('click', handleCardClick);
            card.classList.add('matched');
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
        const progressKey = `cosy_progress_${currentLanguage}`;
        const progress = {
            attempts: attempts,
            matchedIDs: matchedIDs
        };
        localStorage.setItem(progressKey, JSON.stringify(progress));
    }

    function loadProgress() {
        const progressKey = `cosy_progress_${currentLanguage}`;
        const savedProgress = JSON.parse(localStorage.getItem(progressKey));
        if (savedProgress) {
            attempts = savedProgress.attempts || 0;
            matchedIDs = savedProgress.matchedIDs || [];
            matches = matchedIDs.length;
        } else {
            [matches, attempts, matchedIDs] = [0, 0, []];
        }
    }

    function resetGame(clearProgress = true) {
        if (clearProgress) {
            const progressKey = `cosy_progress_${currentLanguage}`;
            localStorage.removeItem(progressKey);
            [matches, attempts, matchedIDs] = [0, 0, []];
        }

        [cards, flippedCards] = [[], []];
        lockBoard = false;
        matchesCountSpan.textContent = matches;
        attemptsCountSpan.textContent = attempts;
        createBoard();
    }

    function changeLanguage() {
        currentLanguage = languageSelector.value;
        loadGame();
    }

    resetButton.addEventListener('click', () => resetGame(true));
    languageSelector.addEventListener('change', changeLanguage);

    // Initial game load
    loadGame();
});
