import { initMemoryMatch } from './memory-match.js';
import { initClozeRace } from './cloze-race.js';
import { initSpotTheMistake } from './spot-the-mistake.js';
import { initPictureBingo } from './picture-bingo.js';
import { initPronunciationSprint } from './pronunciation-sprint.js';
import { initAdaptiveFlashcards } from './adaptive-flashcards.js';
import { initStoryBuilder } from './story-builder.js';
import { initRoleplaySimulator } from './roleplay-simulator.js';

document.addEventListener('DOMContentLoaded', () => {
    let activeGame = localStorage.getItem('cosy_activeGame') || 'memory-match';
    let currentLanguage = localStorage.getItem('cosy_currentLanguage') || 'french_a2';

    const dom = {
        languageSelector: document.getElementById('language-selector'),
        deckTitle: document.getElementById('deck-title'),
        memoryMatchContainer: document.getElementById('memory-match-container'),
        clozeRaceContainer: document.getElementById('cloze-race-container'),
        spotMistakeContainer: document.getElementById('spot-mistake-container'),
        pictureBingoContainer: document.getElementById('picture-bingo-container'),
        pronunciationSprintContainer: document.getElementById('pronunciation-sprint-container'),
        adaptiveFlashcardsContainer: document.getElementById('adaptive-flashcards-container'),
        storyBuilderContainer: document.getElementById('story-builder-container'),
        roleplaySimulatorContainer: document.getElementById('roleplay-simulator-container'),
        selectMemoryMatchBtn: document.getElementById('select-memory-match'),
        selectClozeRaceBtn: document.getElementById('select-cloze-race'),
        selectSpotMistakeBtn: document.getElementById('select-spot-mistake'),
        selectPictureBingoBtn: document.getElementById('select-picture-bingo'),
        selectPronunciationSprintBtn: document.getElementById('select-pronunciation-sprint'),
        selectAdaptiveFlashcardsBtn: document.getElementById('select-adaptive-flashcards'),
        selectStoryBuilderBtn: document.getElementById('select-story-builder'),
        selectRoleplaySimulatorBtn: document.getElementById('select-roleplay-simulator'),
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
        },
        pictureBingoElements: {
            newCardBtn: document.getElementById('bingo-new-card-btn'),
            nextClueBtn: document.getElementById('bingo-next-clue-btn'),
            clueDisplay: document.getElementById('bingo-clue-display'),
            bingoGrid: document.getElementById('bingo-card-grid'),
            deckTitle: document.getElementById('deck-title')
        },
        pronunciationSprintElements: {
            promptText: document.getElementById('ps-prompt-text'),
            userSpeech: document.getElementById('ps-user-speech'),
            feedback: document.getElementById('ps-feedback'),
            score: document.getElementById('ps-score'),
            startBtn: document.getElementById('ps-start-btn'),
            listenBtn: document.getElementById('ps-listen-btn'),
            recordBtn: document.getElementById('ps-record-btn'),
            deckTitle: document.getElementById('ps-deck-title')
        },
        adaptiveFlashcardsElements: {
            cardFront: document.getElementById('flashcard-front'),
            cardBack: document.getElementById('flashcard-back'),
            flipBtn: document.getElementById('flashcard-flip-btn'),
            recallButtonsContainer: document.getElementById('recall-buttons-container'),
            statsNew: document.getElementById('srs-stats-new'),
            statsLearning: document.getElementById('srs-stats-learning'),
            statsReview: document.getElementById('srs-stats-review'),
            deckTitle: document.getElementById('af-deck-title')
        },
        storyBuilderElements: {
            targetSentence: document.getElementById('sb-target-sentence'),
            sourceChunks: document.getElementById('sb-source-chunks'),
            checkBtn: document.getElementById('sb-check-btn'),
            nextBtn: document.getElementById('sb-next-btn'),
            feedback: document.getElementById('sb-feedback'),
            deckTitle: document.getElementById('sb-deck-title')
        },
        roleplaySimulatorElements: {
            scenarioTitle: document.getElementById('rs-scenario-title'),
            conversationLog: document.getElementById('rs-conversation-log'),
            npcPrompt: document.getElementById('rs-npc-prompt'),
            userChoices: document.getElementById('rs-user-choices')
        }
    };

    function initializeGame() {
        if (activeGame === 'memory-match') {
            initMemoryMatch(currentLanguage, dom.memoryMatchElements);
        } else if (activeGame === 'cloze-race') {
            initClozeRace(currentLanguage, dom.clozeRaceElements);
        } else if (activeGame === 'spot-the-mistake') {
            initSpotTheMistake(currentLanguage, dom.spotMistakeElements);
        } else if (activeGame === 'picture-bingo') {
            initPictureBingo(currentLanguage, dom.pictureBingoElements);
        } else if (activeGame === 'pronunciation-sprint') {
            initPronunciationSprint(currentLanguage, dom.pronunciationSprintElements);
        } else if (activeGame === 'adaptive-flashcards') {
            initAdaptiveFlashcards(currentLanguage, dom.adaptiveFlashcardsElements);
        } else if (activeGame === 'story-builder') {
            initStoryBuilder(currentLanguage, dom.storyBuilderElements);
        } else if (activeGame === 'roleplay-simulator') {
            initRoleplaySimulator(currentLanguage, dom.roleplaySimulatorElements);
        }
    }

    function switchGame(gameName) {
        activeGame = gameName;
        localStorage.setItem('cosy_activeGame', gameName);
        dom.selectMemoryMatchBtn.classList.toggle('active', gameName === 'memory-match');
        dom.selectClozeRaceBtn.classList.toggle('active', gameName === 'cloze-race');
        dom.selectSpotMistakeBtn.classList.toggle('active', gameName === 'spot-the-mistake');
        dom.selectPictureBingoBtn.classList.toggle('active', gameName === 'picture-bingo');
        dom.selectPronunciationSprintBtn.classList.toggle('active', gameName === 'pronunciation-sprint');
        dom.selectAdaptiveFlashcardsBtn.classList.toggle('active', gameName === 'adaptive-flashcards');
        dom.selectStoryBuilderBtn.classList.toggle('active', gameName === 'story-builder');
        dom.selectRoleplaySimulatorBtn.classList.toggle('active', gameName === 'roleplay-simulator');

        dom.memoryMatchContainer.classList.toggle('active', gameName === 'memory-match');
        dom.clozeRaceContainer.classList.toggle('active', gameName === 'cloze-race');
        dom.spotMistakeContainer.classList.toggle('active', gameName === 'spot-the-mistake');
        dom.pictureBingoContainer.classList.toggle('active', gameName === 'picture-bingo');
        dom.pronunciationSprintContainer.classList.toggle('active', gameName === 'pronunciation-sprint');
        dom.adaptiveFlashcardsContainer.classList.toggle('active', gameName === 'adaptive-flashcards');
        dom.storyBuilderContainer.classList.toggle('active', gameName === 'story-builder');
        dom.roleplaySimulatorContainer.classList.toggle('active', gameName === 'roleplay-simulator');

        initializeGame();
    }

    function changeLanguage() {
        currentLanguage = dom.languageSelector.value;
        localStorage.setItem('cosy_currentLanguage', currentLanguage);
        initializeGame();
    }

    dom.languageSelector.value = currentLanguage;
    dom.languageSelector.addEventListener('change', changeLanguage);
    dom.selectMemoryMatchBtn.addEventListener('click', () => switchGame('memory-match'));
    dom.selectClozeRaceBtn.addEventListener('click', () => switchGame('cloze-race'));
    dom.selectSpotMistakeBtn.addEventListener('click', () => switchGame('spot-the-mistake'));
    dom.selectPictureBingoBtn.addEventListener('click', () => switchGame('picture-bingo'));
    dom.selectPronunciationSprintBtn.addEventListener('click', () => switchGame('pronunciation-sprint'));
    dom.selectAdaptiveFlashcardsBtn.addEventListener('click', () => switchGame('adaptive-flashcards'));
    dom.selectStoryBuilderBtn.addEventListener('click', () => switchGame('story-builder'));
    dom.selectRoleplaySimulatorBtn.addEventListener('click', () => switchGame('roleplay-simulator'));

    // Initialize the game based on the loaded state
    switchGame(activeGame);
});
