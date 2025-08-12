import { initMemoryMatch } from './memory-match.js';
import { initClozeRace } from './cloze-race.js';
import { initSpotTheMistake } from './spot-the-mistake.js';

document.addEventListener('DOMContentLoaded', () => {
    let activeGame = 'memory-match';
    let currentLanguage = 'french_a2';

    const dom = {
        languageSelector: document.getElementById('language-selector'),
        deckTitle: document.getElementById('deck-title'),
        memoryMatchContainer: document.getElementById('memory-match-container'),
        clozeRaceContainer: document.getElementById('cloze-race-container'),
        spotMistakeContainer: document.getElementById('spot-mistake-container'),
        selectMemoryMatchBtn: document.getElementById('select-memory-match'),
        selectClozeRaceBtn: document.getElementById('select-cloze-race'),
        selectSpotMistakeBtn: document.getElementById('select-spot-mistake'),
        memoryMatchElements: {
            gameBoard: document.getElementById('game-board'),
            matchesCountSpan: document.getElementById('matches-count'),
            attemptsCountSpan: document.getElementById('attempts-count'),
            resetButton: document.getElementById('reset-button'),
            deckTitle: document.getElementById('deck-title')
        },
        clozeRaceElements: {
            clozeTimerSpan: document.getElementById('cloze-timer'),
            clozeScoreSpan: document.getElementById('cloze-score'),
            clozeSentenceEl: document.getElementById('cloze-sentence'),
            clozeOptionsContainer: document.getElementById('cloze-options-container'),
            clozeNextBtn: document.getElementById('cloze-next-btn'),
            deckTitle: document.getElementById('deck-title')
        },
        spotMistakeElements: {
            statsFound: document.getElementById('spot-mistake-found'),
            statsTotal: document.getElementById('spot-mistake-total'),
            textContainer: document.getElementById('spot-mistake-text-container'),
            nextButton: document.getElementById('spot-mistake-next-btn'),
            deckTitle: document.getElementById('deck-title')
        }
    };

    function initializeGame() {
        if (activeGame === 'memory-match') {
            initMemoryMatch(currentLanguage, dom.memoryMatchElements);
        } else if (activeGame === 'cloze-race') {
            initClozeRace(currentLanguage, dom.clozeRaceElements);
        } else if (activeGame === 'spot-the-mistake') {
            initSpotTheMistake(currentLanguage, dom.spotMistakeElements);
        }
    }

    function switchGame(gameName) {
        activeGame = gameName;
        dom.selectMemoryMatchBtn.classList.toggle('active', gameName === 'memory-match');
        dom.selectClozeRaceBtn.classList.toggle('active', gameName === 'cloze-race');
        dom.selectSpotMistakeBtn.classList.toggle('active', gameName === 'spot-the-mistake');

        dom.memoryMatchContainer.classList.toggle('active', gameName === 'memory-match');
        dom.clozeRaceContainer.classList.toggle('active', gameName === 'cloze-race');
        dom.spotMistakeContainer.classList.toggle('active', gameName === 'spot-the-mistake');

        initializeGame();
    }

    function changeLanguage() {
        currentLanguage = dom.languageSelector.value;
        initializeGame();
    }

    dom.languageSelector.addEventListener('change', changeLanguage);
    dom.selectMemoryMatchBtn.addEventListener('click', () => switchGame('memory-match'));
    dom.selectClozeRaceBtn.addEventListener('click', () => switchGame('cloze-race'));
    dom.selectSpotMistakeBtn.addEventListener('click', () => switchGame('spot-the-mistake'));

    initializeGame();
});
