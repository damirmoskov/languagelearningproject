import { initMemoryMatch } from './memory-match.js';
import { initClozeRace } from './cloze-race.js';
import { initSpotTheMistake } from './spot-the-mistake.js';
import { initPictureBingo } from './picture-bingo.js';
import { initPronunciationSprint } from './pronunciation-sprint.js';
import { initAdaptiveFlashcards } from './adaptive-flashcards.js';
import { initSentenceSculptor } from './sentence-sculptor.js';
import { initRoleplaySimulator } from './roleplay-simulator.js';
import { initSynonymSwap } from './synonym-swap.js';
import { initMysteryGame } from './mystery-game.js';
import { initReverseTranslation } from './reverse-translation.js';
import { initFindTheLiar } from './find-the-liar.js';
import { initSynonymChain } from './synonym-chain.js';
import { initWrongEndingDetective } from './wrong-ending-detective.js';
import { initPictureDebate } from './picture-debate.js';
import { initWhatHappensNext } from './what-happens-next.js';
import { initWordDetective } from './word-detective.js';
import { initMetaphorMatch } from './metaphor-match.js';
import { initProblemSolvers } from './problem-solvers.js';
import { initDiagnosisGame } from './diagnosis-game.js';
import { initTranslateTheMood } from './translate-the-mood.js';
import { initTwoStageGuess } from './two-stage-guess.js';
import { initVerbBuilderLab } from './verb-builder-lab.js';
import { initVerbSnap } from './verb-snap.js';
import { initGenderQuest } from './gender-quest.js';
import { initPrepositionPath } from './preposition-path.js';

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
        sentenceSculptorContainer: document.getElementById('sentence-sculptor-container'),
        roleplaySimulatorContainer: document.getElementById('roleplay-simulator-container'),
        synonymSwapContainer: document.getElementById('synonym-swap-container'),
        mysteryGameContainer: document.getElementById('mystery-game-container'),
        reverseTranslationContainer: document.getElementById('reverse-translation-container'),
        findTheLiarContainer: document.getElementById('find-the-liar-container'),
        synonymChainContainer: document.getElementById('synonym-chain-container'),
        wrongEndingDetectiveContainer: document.getElementById('wrong-ending-detective-container'),
        pictureDebateContainer: document.getElementById('picture-debate-container'),
        whatHappensNextContainer: document.getElementById('what-happens-next-container'),
        wordDetectiveContainer: document.getElementById('word-detective-container'),
        metaphorMatchContainer: document.getElementById('metaphor-match-container'),
        problemSolversContainer: document.getElementById('problem-solvers-container'),
        diagnosisGameContainer: document.getElementById('diagnosis-game-container'),
        translateTheMoodContainer: document.getElementById('translate-the-mood-container'),
        twoStageGuessContainer: document.getElementById('two-stage-guess-container'),
        verbBuilderLabContainer: document.getElementById('verb-builder-lab-container'),
        verbSnapContainer: document.getElementById('verb-snap-container'),
        genderQuestContainer: document.getElementById('gender-quest-container'),
        prepositionPathContainer: document.getElementById('preposition-path-container'),
        selectMemoryMatchBtn: document.getElementById('select-memory-match'),
        selectClozeRaceBtn: document.getElementById('select-cloze-race'),
        selectSpotMistakeBtn: document.getElementById('select-spot-mistake'),
        selectPictureBingoBtn: document.getElementById('select-picture-bingo'),
        selectPronunciationSprintBtn: document.getElementById('select-pronunciation-sprint'),
        selectAdaptiveFlashcardsBtn: document.getElementById('select-adaptive-flashcards'),
        selectSentenceSculptorBtn: document.getElementById('select-sentence-sculptor'),
        selectRoleplaySimulatorBtn: document.getElementById('select-roleplay-simulator'),
        selectSynonymSwapBtn: document.getElementById('select-synonym-swap'),
        selectMysteryGameBtn: document.getElementById('select-mystery-game'),
        selectReverseTranslationBtn: document.getElementById('select-reverse-translation'),
        selectFindTheLiarBtn: document.getElementById('select-find-the-liar'),
        selectSynonymChainBtn: document.getElementById('select-synonym-chain'),
        selectWrongEndingDetectiveBtn: document.getElementById('select-wrong-ending-detective'),
        selectPictureDebateBtn: document.getElementById('select-picture-debate'),
        selectWhatHappensNextBtn: document.getElementById('select-what-happens-next'),
        selectWordDetectiveBtn: document.getElementById('select-word-detective'),
        selectMetaphorMatchBtn: document.getElementById('select-metaphor-match'),
        selectProblemSolversBtn: document.getElementById('select-problem-solvers'),
        selectDiagnosisGameBtn: document.getElementById('select-diagnosis-game'),
        selectTranslateTheMoodBtn: document.getElementById('select-translate-the-mood'),
        selectTwoStageGuessBtn: document.getElementById('select-two-stage-guess'),
        selectVerbBuilderLabBtn: document.getElementById('select-verb-builder-lab'),
        selectVerbSnapBtn: document.getElementById('select-verb-snap'),
        selectGenderQuestBtn: document.getElementById('select-gender-quest'),
        selectPrepositionPathBtn: document.getElementById('select-preposition-path'),
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
        sentenceSculptorElements: {
            targetSentence: document.getElementById('scs-target-sentence'),
            sourceChunks: document.getElementById('scs-source-chunks'),
            checkBtn: document.getElementById('scs-check-btn'),
            nextBtn: document.getElementById('scs-next-btn'),
            feedback: document.getElementById('scs-feedback'),
            deckTitle: document.getElementById('scs-deck-title'),
            promptImage: document.getElementById('scs-prompt-image')
        },
        roleplaySimulatorElements: {
            scenarioTitle: document.getElementById('rs-scenario-title'),
            conversationLog: document.getElementById('rs-conversation-log'),
            npcPrompt: document.getElementById('rs-npc-prompt'),
            userChoices: document.getElementById('rs-user-choices')
        },
        synonymSwapElements: {
            sentenceEl: document.getElementById('ss-sentence'),
            optionsContainer: document.getElementById('ss-options-container'),
            scoreSpan: document.getElementById('ss-score'),
            nextBtn: document.getElementById('ss-next-btn'),
            deckTitle: document.getElementById('deck-title')
        },
        mysteryGameElements: {
            cluesListEl: document.getElementById('mg-clues-list'),
            guessInput: document.getElementById('mg-guess-input'),
            guessBtn: document.getElementById('mg-guess-btn'),
            nextClueBtn: document.getElementById('mg-next-clue-btn'),
            feedbackEl: document.getElementById('mg-feedback'),
            scoreEl: document.getElementById('mg-score'),
            deckTitle: document.getElementById('deck-title')
        },
        reverseTranslationElements: {
            challengePromptEl: document.getElementById('rt-challenge-prompt'),
            userInputEl: document.getElementById('rt-user-input'),
            submitBtn: document.getElementById('rt-submit-btn'),
            modelAnswerEl: document.getElementById('rt-model-answer-container'),
            feedbackEl: document.getElementById('rt-feedback'),
            nextBtn: document.getElementById('rt-next-btn'),
            deckTitle: document.getElementById('deck-title')
        },
        findTheLiarElements: {
            topicEl: document.getElementById('ftl-topic'),
            statementsListEl: document.getElementById('ftl-statements-list'),
            cluesListEl: document.getElementById('ftl-clues-list'),
            revealClueBtn: document.getElementById('ftl-reveal-clue-btn'),
            feedbackEl: document.getElementById('ftl-feedback'),
            nextScenarioBtn: document.getElementById('ftl-next-scenario-btn'),
            scoreEl: document.getElementById('ftl-score'),
            deckTitle: document.getElementById('deck-title')
        },
        synonymChainElements: {
            chainDisplayEl: document.getElementById('sc-chain-display'),
            currentWordEl: document.getElementById('sc-current-word'),
            userInputEl: document.getElementById('sc-user-input'),
            submitBtn: document.getElementById('sc-submit-btn'),
            feedbackEl: document.getElementById('sc-feedback'),
            scoreEl: document.getElementById('sc-score'),
            newChainBtn: document.getElementById('sc-new-chain-btn'),
            deckTitle: document.getElementById('deck-title')
        },
        wrongEndingDetectiveElements: {
            sentenceContainerEl: document.getElementById('wed-sentence-container'),
            explanationContainerEl: document.getElementById('wed-explanation-container'),
            feedbackEl: document.getElementById('wed-feedback'),
            nextBtn: document.getElementById('wed-next-btn'),
            scoreEl: document.getElementById('wed-score'),
            deckTitle: document.getElementById('deck-title')
        },
        pictureDebateElements: {
            imageEl: document.getElementById('pd-image'),
            topicEl: document.getElementById('pd-topic'),
            promptEl: document.getElementById('pd-prompt'),
            userInputEl: document.getElementById('pd-user-input'),
            submitBtn: document.getElementById('pd-submit-btn'),
            reviewSectionEl: document.getElementById('pd-review-section'),
            modelAnswersContainerEl: document.getElementById('pd-model-answers'),
            usefulPhrasesEl: document.getElementById('pd-useful-phrases'),
            nextDebateBtn: document.getElementById('pd-next-debate-btn'),
            deckTitle: document.getElementById('deck-title')
        },
        whatHappensNextElements: {
            storyStarterEl: document.getElementById('whn-story-starter'),
            userInputEl: document.getElementById('whn-user-input'),
            submitBtn: document.getElementById('whn-submit-btn'),
            modelContinuationsEl: document.getElementById('whn-model-continuations'),
            nextBtn: document.getElementById('whn-next-btn'),
            deckTitle: document.getElementById('deck-title')
        },
        wordDetectiveElements: {
            paragraphEl: document.getElementById('wd-paragraph'),
            userInputEl: document.getElementById('wd-user-input'),
            submitBtn: document.getElementById('wd-submit-btn'),
            definitionContainerEl: document.getElementById('wd-definition-container'),
            mcqContainerEl: document.getElementById('wd-mcq-container'),
            nextBtn: document.getElementById('wd-next-btn'),
            scoreEl: document.getElementById('wd-score'),
            deckTitle: document.getElementById('deck-title')
        },
        metaphorMatchElements: {
            metaphorEl: document.getElementById('mm-metaphor'),
            optionsContainerEl: document.getElementById('mm-options-container'),
            explanationEl: document.getElementById('mm-explanation'),
            nextBtn: document.getElementById('mm-next-btn'),
            scoreEl: document.getElementById('mm-score'),
            deckTitle: document.getElementById('deck-title')
        },
        problemSolversElements: {
            descriptionEl: document.getElementById('ps-description'),
            promptEl: document.getElementById('ps-prompt'),
            userInputEl: document.getElementById('ps-user-input'),
            submitBtn: document.getElementById('ps-submit-btn'),
            reviewSectionEl: document.getElementById('ps-review-section'),
            modelSolutionContainerEl: document.getElementById('ps-model-solution'),
            usefulVocabEl: document.getElementById('ps-useful-vocab'),
            nextProblemBtn: document.getElementById('ps-next-btn'),
            deckTitle: document.getElementById('deck-title')
        },
        diagnosisGameElements: {
            sceneEl: document.getElementById('dg-scene'),
            contextEl: document.getElementById('dg-context'),
            optionsContainerEl: document.getElementById('dg-options-container'),
            justificationEl: document.getElementById('dg-justification'),
            nextBtn: document.getElementById('dg-next-btn'),
            scoreEl: document.getElementById('dg-score'),
            deckTitle: document.getElementById('deck-title')
        },
        translateTheMoodElements: {
            sentenceEl: document.getElementById('tm-sentence'),
            moodEl: document.getElementById('tm-mood'),
            userInputEl: document.getElementById('tm-user-input'),
            submitBtn: document.getElementById('tm-submit-btn'),
            explanationEl: document.getElementById('tm-explanation'),
            nextBtn: document.getElementById('tm-next-btn'),
            scoreEl: document.getElementById('tm-score'),
            deckTitle: document.getElementById('deck-title')
        },
        twoStageGuessElements: {
            evidenceEl: document.getElementById('tsg-evidence-container'),
            promptEl: document.getElementById('tsg-prompt-container'),
            userInputEl: document.getElementById('tsg-user-input'),
            submitBtn: document.getElementById('tsg-submit-btn'),
            modelAnswerEl: document.getElementById('tsg-model-answer-container'),
            nextBtn: document.getElementById('tsg-next-btn'),
            scoreEl: document.getElementById('tsg-score'),
            deckTitle: document.getElementById('deck-title')
        },
        verbBuilderLabElements: {
            plantContainer: document.getElementById('vbl-plant-container'),
            person: document.getElementById('vbl-person'),
            tense: document.getElementById('vbl-tense'),
            verbRoot: document.getElementById('vbl-verb-root'),
            verbEnding: document.getElementById('vbl-verb-ending'),
            optionsContainer: document.getElementById('vbl-options-container'),
            feedback: document.getElementById('vbl-feedback'),
            nextBtn: document.getElementById('vbl-next-btn'),
            deckTitle: document.getElementById('deck-title')
        },
        verbSnapElements: {
            score: document.getElementById('vs-score'),
            timer: document.getElementById('vs-timer'),
            promptMedia: document.getElementById('vs-prompt-media'),
            promptText: document.getElementById('vs-prompt-text'),
            optionsArea: document.getElementById('vs-options-area'),
            overlay: document.getElementById('vs-overlay'),
            startBtn: document.getElementById('vs-start-btn'),
            deckTitle: document.getElementById('deck-title')
        },
        genderQuestElements: {
            score: document.getElementById('gq-score'),
            nextRoundBtn: document.getElementById('gq-next-round-btn'),
            masculineHome: document.getElementById('gq-masculine-home'),
            feminineHome: document.getElementById('gq-feminine-home'),
            feedback: document.getElementById('gq-feedback'),
            itemPool: document.getElementById('gq-item-pool'),
            deckTitle: document.getElementById('deck-title')
        },
        prepositionPathElements: {
            instruction: document.getElementById('pp-instruction'),
            sceneContainer: document.getElementById('pp-scene-container'),
            itemHolder: document.getElementById('pp-item-holder'),
            nextBtn: document.getElementById('pp-next-btn'),
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
        } else if (activeGame === 'picture-bingo') {
            initPictureBingo(currentLanguage, dom.pictureBingoElements);
        } else if (activeGame === 'pronunciation-sprint') {
            initPronunciationSprint(currentLanguage, dom.pronunciationSprintElements);
        } else if (activeGame === 'adaptive-flashcards') {
            initAdaptiveFlashcards(currentLanguage, dom.adaptiveFlashcardsElements);
        } else if (activeGame === 'sentence-sculptor') {
            initSentenceSculptor(currentLanguage, dom.sentenceSculptorElements);
        } else if (activeGame === 'roleplay-simulator') {
            initRoleplaySimulator(currentLanguage, dom.roleplaySimulatorElements);
        } else if (activeGame === 'synonym-swap') {
            initSynonymSwap(currentLanguage, dom.synonymSwapElements);
        } else if (activeGame === 'mystery-game') {
            initMysteryGame(currentLanguage, dom.mysteryGameElements);
        } else if (activeGame === 'reverse-translation') {
            initReverseTranslation(currentLanguage, dom.reverseTranslationElements);
        } else if (activeGame === 'find-the-liar') {
            initFindTheLiar(currentLanguage, dom.findTheLiarElements);
        } else if (activeGame === 'synonym-chain') {
            initSynonymChain(currentLanguage, dom.synonymChainElements);
        } else if (activeGame === 'wrong-ending-detective') {
            initWrongEndingDetective(currentLanguage, dom.wrongEndingDetectiveElements);
        } else if (activeGame === 'picture-debate') {
            initPictureDebate(currentLanguage, dom.pictureDebateElements);
        } else if (activeGame === 'what-happens-next') {
            initWhatHappensNext(currentLanguage, dom.whatHappensNextElements);
        } else if (activeGame === 'word-detective') {
            initWordDetective(currentLanguage, dom.wordDetectiveElements);
        } else if (activeGame === 'metaphor-match') {
            initMetaphorMatch(currentLanguage, dom.metaphorMatchElements);
        } else if (activeGame === 'problem-solvers') {
            initProblemSolvers(currentLanguage, dom.problemSolversElements);
        } else if (activeGame === 'diagnosis-game') {
            initDiagnosisGame(currentLanguage, dom.diagnosisGameElements);
        } else if (activeGame === 'translate-the-mood') {
            initTranslateTheMood(currentLanguage, dom.translateTheMoodElements);
        } else if (activeGame === 'two-stage-guess') {
            initTwoStageGuess(currentLanguage, dom.twoStageGuessElements);
        } else if (activeGame === 'verb-builder-lab') {
            initVerbBuilderLab(currentLanguage, dom.verbBuilderLabElements);
        } else if (activeGame === 'verb-snap') {
            initVerbSnap(currentLanguage, dom.verbSnapElements);
        } else if (activeGame === 'gender-quest') {
            initGenderQuest(currentLanguage, dom.genderQuestElements);
        } else if (activeGame === 'preposition-path') {
            initPrepositionPath(currentLanguage, dom.prepositionPathElements);
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
        dom.selectSentenceSculptorBtn.classList.toggle('active', gameName === 'sentence-sculptor');
        dom.selectRoleplaySimulatorBtn.classList.toggle('active', gameName === 'roleplay-simulator');
        dom.selectSynonymSwapBtn.classList.toggle('active', gameName === 'synonym-swap');
        dom.selectMysteryGameBtn.classList.toggle('active', gameName === 'mystery-game');
        dom.selectReverseTranslationBtn.classList.toggle('active', gameName === 'reverse-translation');
        dom.selectFindTheLiarBtn.classList.toggle('active', gameName === 'find-the-liar');
        dom.selectSynonymChainBtn.classList.toggle('active', gameName === 'synonym-chain');
        dom.selectWrongEndingDetectiveBtn.classList.toggle('active', gameName === 'wrong-ending-detective');
        dom.selectPictureDebateBtn.classList.toggle('active', gameName === 'picture-debate');
        dom.selectWhatHappensNextBtn.classList.toggle('active', gameName === 'what-happens-next');
        dom.selectWordDetectiveBtn.classList.toggle('active', gameName === 'word-detective');
        dom.selectMetaphorMatchBtn.classList.toggle('active', gameName === 'metaphor-match');
        dom.selectProblemSolversBtn.classList.toggle('active', gameName === 'problem-solvers');
        dom.selectDiagnosisGameBtn.classList.toggle('active', gameName === 'diagnosis-game');
        dom.selectTranslateTheMoodBtn.classList.toggle('active', gameName === 'translate-the-mood');
        dom.selectTwoStageGuessBtn.classList.toggle('active', gameName === 'two-stage-guess');
        dom.selectVerbBuilderLabBtn.classList.toggle('active', gameName === 'verb-builder-lab');
        dom.selectVerbSnapBtn.classList.toggle('active', gameName === 'verb-snap');
        dom.selectGenderQuestBtn.classList.toggle('active', gameName === 'gender-quest');
        dom.selectPrepositionPathBtn.classList.toggle('active', gameName === 'preposition-path');

        dom.memoryMatchContainer.classList.toggle('active', gameName === 'memory-match');
        dom.clozeRaceContainer.classList.toggle('active', gameName === 'cloze-race');
        dom.spotMistakeContainer.classList.toggle('active', gameName === 'spot-the-mistake');
        dom.pictureBingoContainer.classList.toggle('active', gameName === 'picture-bingo');
        dom.pronunciationSprintContainer.classList.toggle('active', gameName === 'pronunciation-sprint');
        dom.adaptiveFlashcardsContainer.classList.toggle('active', gameName === 'adaptive-flashcards');
        dom.sentenceSculptorContainer.classList.toggle('active', gameName === 'sentence-sculptor');
        dom.roleplaySimulatorContainer.classList.toggle('active', gameName === 'roleplay-simulator');
        dom.synonymSwapContainer.classList.toggle('active', gameName === 'synonym-swap');
        dom.mysteryGameContainer.classList.toggle('active', gameName === 'mystery-game');
        dom.reverseTranslationContainer.classList.toggle('active', gameName === 'reverse-translation');
        dom.findTheLiarContainer.classList.toggle('active', gameName === 'find-the-liar');
        dom.synonymChainContainer.classList.toggle('active', gameName === 'synonym-chain');
        dom.wrongEndingDetectiveContainer.classList.toggle('active', gameName === 'wrong-ending-detective');
        dom.pictureDebateContainer.classList.toggle('active', gameName === 'picture-debate');
        dom.whatHappensNextContainer.classList.toggle('active', gameName === 'what-happens-next');
        dom.wordDetectiveContainer.classList.toggle('active', gameName === 'word-detective');
        dom.metaphorMatchContainer.classList.toggle('active', gameName === 'metaphor-match');
        dom.problemSolversContainer.classList.toggle('active', gameName === 'problem-solvers');
        dom.diagnosisGameContainer.classList.toggle('active', gameName === 'diagnosis-game');
        dom.translateTheMoodContainer.classList.toggle('active', gameName === 'translate-the-mood');
        dom.twoStageGuessContainer.classList.toggle('active', gameName === 'two-stage-guess');
        dom.verbBuilderLabContainer.classList.toggle('active', gameName === 'verb-builder-lab');
        dom.verbSnapContainer.classList.toggle('active', gameName === 'verb-snap');
        dom.genderQuestContainer.classList.toggle('active', gameName === 'gender-quest');
        dom.prepositionPathContainer.classList.toggle('active', gameName === 'preposition-path');

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
    dom.selectSentenceSculptorBtn.addEventListener('click', () => switchGame('sentence-sculptor'));
    dom.selectRoleplaySimulatorBtn.addEventListener('click', () => switchGame('roleplay-simulator'));
    dom.selectSynonymSwapBtn.addEventListener('click', () => switchGame('synonym-swap'));
    dom.selectMysteryGameBtn.addEventListener('click', () => switchGame('mystery-game'));
    dom.selectReverseTranslationBtn.addEventListener('click', () => switchGame('reverse-translation'));
    dom.selectFindTheLiarBtn.addEventListener('click', () => switchGame('find-the-liar'));
    dom.selectSynonymChainBtn.addEventListener('click', () => switchGame('synonym-chain'));
    dom.selectWrongEndingDetectiveBtn.addEventListener('click', () => switchGame('wrong-ending-detective'));
    dom.selectPictureDebateBtn.addEventListener('click', () => switchGame('picture-debate'));
    dom.selectWhatHappensNextBtn.addEventListener('click', () => switchGame('what-happens-next'));
    dom.selectWordDetectiveBtn.addEventListener('click', () => switchGame('word-detective'));
    dom.selectMetaphorMatchBtn.addEventListener('click', () => switchGame('metaphor-match'));
    dom.selectProblemSolversBtn.addEventListener('click', () => switchGame('problem-solvers'));
    dom.selectDiagnosisGameBtn.addEventListener('click', () => switchGame('diagnosis-game'));
    dom.selectTranslateTheMoodBtn.addEventListener('click', () => switchGame('translate-the-mood'));
    dom.selectTwoStageGuessBtn.addEventListener('click', () => switchGame('two-stage-guess'));
    dom.selectVerbBuilderLabBtn.addEventListener('click', () => switchGame('verb-builder-lab'));
    dom.selectVerbSnapBtn.addEventListener('click', () => switchGame('verb-snap'));
    dom.selectGenderQuestBtn.addEventListener('click', () => switchGame('gender-quest'));
    dom.selectPrepositionPathBtn.addEventListener('click', () => switchGame('preposition-path'));

    // Initialize the game based on the loaded state
    switchGame(activeGame);
});
