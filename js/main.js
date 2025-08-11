import { initMemoryMatch } from './memory-match.js';
import { initClozeRace } from './cloze-race.js';

document.addEventListener('DOMContentLoaded', () => {
    let activeGame = 'memory-match';
    let currentLanguage = 'french_a2';
    const languageSelector = document.getElementById('language-selector');
    const deckTitle = document.getElementById('deck-title');
    const memoryMatchContainer = document.getElementById('memory-match-container');
    const clozeRaceContainer = document.getElementById('cloze-race-container');
    const selectMemoryMatchBtn = document.getElementById('select-memory-match');
    const selectClozeRaceBtn = document.getElementById('select-cloze-race');
    const memoryMatchElements = {
        gameBoard: document.getElementById('game-board'),
        matchesCountSpan: document.getElementById('matches-count'),
        attemptsCountSpan: document.getElementById('attempts-count'),
        resetButton: document.getElementById('reset-button'),
        deckTitle: deckTitle
    };
    const clozeRaceElements = {
        clozeTimerSpan: document.getElementById('cloze-timer'),
        clozeScoreSpan: document.getElementById('cloze-score'),
        clozeSentenceEl: document.getElementById('cloze-sentence'),
        clozeOptionsContainer: document.getElementById('cloze-options-container'),
        clozeNextBtn: document.getElementById('cloze-next-btn'),
        deckTitle: deckTitle
    };
    function initializeGame() {
        if (activeGame === 'memory-match') {
            initMemoryMatch(currentLanguage, memoryMatchElements);
        } else if (activeGame === 'cloze-race') {
            initClozeRace(currentLanguage, clozeRaceElements);
        }
    }
    function switchGame(gameName) {
        activeGame = gameName;
        selectMemoryMatchBtn.classList.toggle('active', gameName === 'memory-match');
        selectClozeRaceBtn.classList.toggle('active', gameName === 'cloze-race');
        memoryMatchContainer.classList.toggle('active', gameName === 'memory-match');
        clozeRaceContainer.classList.toggle('active', gameName === 'cloze-race');
        initializeGame();
    }
    function changeLanguage() {
        currentLanguage = languageSelector.value;
        initializeGame();
    }
    languageSelector.addEventListener('change', changeLanguage);
    selectMemoryMatchBtn.addEventListener('click', () => switchGame('memory-match'));
    selectClozeRaceBtn.addEventListener('click', () => switchGame('cloze-race'));
    initializeGame();
});
