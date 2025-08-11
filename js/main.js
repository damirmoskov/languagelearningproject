import { initMemoryMatch } from './memory-match.js';
import { initClozeRace } from './cloze-race.js';
document.addEventListener('DOMContentLoaded', () => {
    let activeGame = 'memory-match';
    let currentLanguage = 'french_a2';
    const dom = {
        languageSelector: document.getElementById('language-selector'),
        deckTitle: document.getElementById('deck-title'),
        memoryMatchContainer: document.getElementById('memory-match-container'),
        clozeRaceContainer: document.getElementById('cloze-race-container'),
        selectMemoryMatchBtn: document.getElementById('select-memory-match'),
        selectClozeRaceBtn: document.getElementById('select-cloze-race'),
        memoryMatchElements: { gameBoard: document.getElementById('game-board'), matchesCountSpan: document.getElementById('matches-count'), attemptsCountSpan: document.getElementById('attempts-count'), resetButton: document.getElementById('reset-button'), deckTitle: document.getElementById('deck-title') },
        clozeRaceElements: { clozeTimerSpan: document.getElementById('cloze-timer'), clozeScoreSpan: document.getElementById('cloze-score'), clozeSentenceEl: document.getElementById('cloze-sentence'), clozeOptionsContainer: document.getElementById('cloze-options-container'), clozeNextBtn: document.getElementById('cloze-next-btn'), deckTitle: document.getElementById('deck-title') }
    };
    const initializeGame = () => { activeGame === 'memory-match' ? initMemoryMatch(currentLanguage, dom.memoryMatchElements) : initClozeRace(currentLanguage, dom.clozeRaceElements); };
    const switchGame = (gameName) => { activeGame = gameName; dom.selectMemoryMatchBtn.classList.toggle('active', gameName === 'memory-match'); dom.selectClozeRaceBtn.classList.toggle('active', gameName === 'cloze-race'); dom.memoryMatchContainer.classList.toggle('active', gameName === 'memory-match'); dom.clozeRaceContainer.classList.toggle('active', gameName === 'cloze-race'); initializeGame(); };
    dom.languageSelector.addEventListener('change', () => { currentLanguage = dom.languageSelector.value; initializeGame(); });
    dom.selectMemoryMatchBtn.addEventListener('click', () => switchGame('memory-match'));
    dom.selectClozeRaceBtn.addEventListener('click', () => switchGame('cloze-race'));
    initializeGame();
});
