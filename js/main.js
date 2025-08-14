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
import { initTimeMachineVerbs } from './time-machine-verbs.js';
import { initAgreementArcade } from './agreement-arcade.js';
import { initConjugationDuel } from './conjugation-duel.js';
import { initPrepositionDetective } from './preposition-detective.js';
import { initMorphologyMixer } from './morphology-mixer.js';

document.addEventListener('DOMContentLoaded', () => {
    let activeGame = localStorage.getItem('cosy_activeGame') || 'memory-match';
    let currentLanguage = localStorage.getItem('cosy_currentLanguage') || 'french_a2';

    const dom = {
        languageSelector: document.getElementById('language-selector'),
        deckTitle: document.getElementById('deck-title')
    };

    const games = {
        'memory-match': {
            init: initMemoryMatch,
            container: document.getElementById('memory-match-container'),
            button: document.getElementById('select-memory-match'),
            elements: {
                gameBoard: document.getElementById('game-board'),
                matchesCountSpan: document.getElementById('matches-count'),
                attemptsCountSpan: document.getElementById('attempts-count'),
                resetButton: document.getElementById('reset-button'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'cloze-race': {
            init: initClozeRace,
            container: document.getElementById('cloze-race-container'),
            button: document.getElementById('select-cloze-race'),
            elements: {
                clozeTimerSpan: document.getElementById('cloze-timer'),
                clozeScoreSpan: document.getElementById('cloze-score'),
                clozeSentenceEl: document.getElementById('cloze-sentence'),
                clozeOptionsContainer: document.getElementById('cloze-options-container'),
                clozeNextBtn: document.getElementById('cloze-next-btn'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'spot-the-mistake': {
            init: initSpotTheMistake,
            container: document.getElementById('spot-mistake-container'),
            button: document.getElementById('select-spot-mistake'),
            elements: {
                statsFound: document.getElementById('spot-mistake-found'),
                statsTotal: document.getElementById('spot-mistake-total'),
                textContainer: document.getElementById('spot-mistake-text-container'),
                nextButton: document.getElementById('spot-mistake-next-btn'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'picture-bingo': {
            init: initPictureBingo,
            container: document.getElementById('picture-bingo-container'),
            button: document.getElementById('select-picture-bingo'),
            elements: {
                newCardBtn: document.getElementById('bingo-new-card-btn'),
                nextClueBtn: document.getElementById('bingo-next-clue-btn'),
                clueDisplay: document.getElementById('bingo-clue-display'),
                bingoGrid: document.getElementById('bingo-card-grid'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'pronunciation-sprint': {
            init: initPronunciationSprint,
            container: document.getElementById('pronunciation-sprint-container'),
            button: document.getElementById('select-pronunciation-sprint'),
            elements: {
                promptText: document.getElementById('ps-prompt-text'),
                userSpeech: document.getElementById('ps-user-speech'),
                feedback: document.getElementById('ps-feedback'),
                score: document.getElementById('ps-score'),
                startBtn: document.getElementById('ps-start-btn'),
                listenBtn: document.getElementById('ps-listen-btn'),
                recordBtn: document.getElementById('ps-record-btn'),
                deckTitle: document.getElementById('ps-deck-title')
            }
        },
        'adaptive-flashcards': {
            init: initAdaptiveFlashcards,
            container: document.getElementById('adaptive-flashcards-container'),
            button: document.getElementById('select-adaptive-flashcards'),
            elements: {
                cardFront: document.getElementById('flashcard-front'),
                cardBack: document.getElementById('flashcard-back'),
                flipBtn: document.getElementById('flashcard-flip-btn'),
                recallButtonsContainer: document.getElementById('recall-buttons-container'),
                statsNew: document.getElementById('srs-stats-new'),
                statsLearning: document.getElementById('srs-stats-learning'),
                statsReview: document.getElementById('srs-stats-review'),
                deckTitle: document.getElementById('af-deck-title')
            }
        },
        'sentence-sculptor': {
            init: initSentenceSculptor,
            container: document.getElementById('sentence-sculptor-container'),
            button: document.getElementById('select-sentence-sculptor'),
            elements: {
                targetSentence: document.getElementById('scs-target-sentence'),
                sourceChunks: document.getElementById('scs-source-chunks'),
                checkBtn: document.getElementById('scs-check-btn'),
                nextBtn: document.getElementById('scs-next-btn'),
                feedback: document.getElementById('scs-feedback'),
                deckTitle: document.getElementById('scs-deck-title'),
                promptImage: document.getElementById('scs-prompt-image')
            }
        },
        'roleplay-simulator': {
            init: initRoleplaySimulator,
            container: document.getElementById('roleplay-simulator-container'),
            button: document.getElementById('select-roleplay-simulator'),
            elements: {
                scenarioTitle: document.getElementById('rs-scenario-title'),
                conversationLog: document.getElementById('rs-conversation-log'),
                npcPrompt: document.getElementById('rs-npc-prompt'),
                userChoices: document.getElementById('rs-user-choices')
            }
        },
        'synonym-swap': {
            init: initSynonymSwap,
            container: document.getElementById('synonym-swap-container'),
            button: document.getElementById('select-synonym-swap'),
            elements: {
                sentenceEl: document.getElementById('ss-sentence'),
                optionsContainer: document.getElementById('ss-options-container'),
                scoreSpan: document.getElementById('ss-score'),
                nextBtn: document.getElementById('ss-next-btn'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'mystery-game': {
            init: initMysteryGame,
            container: document.getElementById('mystery-game-container'),
            button: document.getElementById('select-mystery-game'),
            elements: {
                cluesListEl: document.getElementById('mg-clues-list'),
                guessInput: document.getElementById('mg-guess-input'),
                guessBtn: document.getElementById('mg-guess-btn'),
                nextClueBtn: document.getElementById('mg-next-clue-btn'),
                feedbackEl: document.getElementById('mg-feedback'),
                scoreEl: document.getElementById('mg-score'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'reverse-translation': {
            init: initReverseTranslation,
            container: document.getElementById('reverse-translation-container'),
            button: document.getElementById('select-reverse-translation'),
            elements: {
                challengePromptEl: document.getElementById('rt-challenge-prompt'),
                userInputEl: document.getElementById('rt-user-input'),
                submitBtn: document.getElementById('rt-submit-btn'),
                modelAnswerEl: document.getElementById('rt-model-answer-container'),
                feedbackEl: document.getElementById('rt-feedback'),
                nextBtn: document.getElementById('rt-next-btn'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'find-the-liar': {
            init: initFindTheLiar,
            container: document.getElementById('find-the-liar-container'),
            button: document.getElementById('select-find-the-liar'),
            elements: {
                topicEl: document.getElementById('ftl-topic'),
                statementsListEl: document.getElementById('ftl-statements-list'),
                cluesListEl: document.getElementById('ftl-clues-list'),
                revealClueBtn: document.getElementById('ftl-reveal-clue-btn'),
                feedbackEl: document.getElementById('ftl-feedback'),
                nextScenarioBtn: document.getElementById('ftl-next-scenario-btn'),
                scoreEl: document.getElementById('ftl-score'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'synonym-chain': {
            init: initSynonymChain,
            container: document.getElementById('synonym-chain-container'),
            button: document.getElementById('select-synonym-chain'),
            elements: {
                chainDisplayEl: document.getElementById('sc-chain-display'),
                currentWordEl: document.getElementById('sc-current-word'),
                userInputEl: document.getElementById('sc-user-input'),
                submitBtn: document.getElementById('sc-submit-btn'),
                feedbackEl: document.getElementById('sc-feedback'),
                scoreEl: document.getElementById('sc-score'),
                newChainBtn: document.getElementById('sc-new-chain-btn'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'wrong-ending-detective': {
            init: initWrongEndingDetective,
            container: document.getElementById('wrong-ending-detective-container'),
            button: document.getElementById('select-wrong-ending-detective'),
            elements: {
                sentenceContainerEl: document.getElementById('wed-sentence-container'),
                explanationContainerEl: document.getElementById('wed-explanation-container'),
                feedbackEl: document.getElementById('wed-feedback'),
                nextBtn: document.getElementById('wed-next-btn'),
                scoreEl: document.getElementById('wed-score'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'picture-debate': {
            init: initPictureDebate,
            container: document.getElementById('picture-debate-container'),
            button: document.getElementById('select-picture-debate'),
            elements: {
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
            }
        },
        'what-happens-next': {
            init: initWhatHappensNext,
            container: document.getElementById('what-happens-next-container'),
            button: document.getElementById('select-what-happens-next'),
            elements: {
                storyStarterEl: document.getElementById('whn-story-starter'),
                userInputEl: document.getElementById('whn-user-input'),
                submitBtn: document.getElementById('whn-submit-btn'),
                modelContinuationsEl: document.getElementById('whn-model-continuations'),
                nextBtn: document.getElementById('whn-next-btn'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'word-detective': {
            init: initWordDetective,
            container: document.getElementById('word-detective-container'),
            button: document.getElementById('select-word-detective'),
            elements: {
                paragraphEl: document.getElementById('wd-paragraph'),
                userInputEl: document.getElementById('wd-user-input'),
                submitBtn: document.getElementById('wd-submit-btn'),
                definitionContainerEl: document.getElementById('wd-definition-container'),
                mcqContainerEl: document.getElementById('wd-mcq-container'),
                nextBtn: document.getElementById('wd-next-btn'),
                scoreEl: document.getElementById('wd-score'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'metaphor-match': {
            init: initMetaphorMatch,
            container: document.getElementById('metaphor-match-container'),
            button: document.getElementById('select-metaphor-match'),
            elements: {
                metaphorEl: document.getElementById('mm-metaphor'),
                optionsContainerEl: document.getElementById('mm-options-container'),
                explanationEl: document.getElementById('mm-explanation'),
                nextBtn: document.getElementById('mm-next-btn'),
                scoreEl: document.getElementById('mm-score'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'problem-solvers': {
            init: initProblemSolvers,
            container: document.getElementById('problem-solvers-container'),
            button: document.getElementById('select-problem-solvers'),
            elements: {
                descriptionEl: document.getElementById('ps-description'),
                promptEl: document.getElementById('ps-prompt'),
                userInputEl: document.getElementById('ps-user-input'),
                submitBtn: document.getElementById('ps-submit-btn'),
                reviewSectionEl: document.getElementById('ps-review-section'),
                modelSolutionContainerEl: document.getElementById('ps-model-solution'),
                usefulVocabEl: document.getElementById('ps-useful-vocab'),
                nextProblemBtn: document.getElementById('ps-next-btn'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'diagnosis-game': {
            init: initDiagnosisGame,
            container: document.getElementById('diagnosis-game-container'),
            button: document.getElementById('select-diagnosis-game'),
            elements: {
                sceneEl: document.getElementById('dg-scene'),
                contextEl: document.getElementById('dg-context'),
                optionsContainerEl: document.getElementById('dg-options-container'),
                justificationEl: document.getElementById('dg-justification'),
                nextBtn: document.getElementById('dg-next-btn'),
                scoreEl: document.getElementById('dg-score'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'translate-the-mood': {
            init: initTranslateTheMood,
            container: document.getElementById('translate-the-mood-container'),
            button: document.getElementById('select-translate-the-mood'),
            elements: {
                sentenceEl: document.getElementById('tm-sentence'),
                moodEl: document.getElementById('tm-mood'),
                userInputEl: document.getElementById('tm-user-input'),
                submitBtn: document.getElementById('tm-submit-btn'),
                explanationEl: document.getElementById('tm-explanation'),
                nextBtn: document.getElementById('tm-next-btn'),
                scoreEl: document.getElementById('tm-score'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'two-stage-guess': {
            init: initTwoStageGuess,
            container: document.getElementById('two-stage-guess-container'),
            button: document.getElementById('select-two-stage-guess'),
            elements: {
                evidenceEl: document.getElementById('tsg-evidence-container'),
                promptEl: document.getElementById('tsg-prompt-container'),
                userInputEl: document.getElementById('tsg-user-input'),
                submitBtn: document.getElementById('tsg-submit-btn'),
                modelAnswerEl: document.getElementById('tsg-model-answer-container'),
                nextBtn: document.getElementById('tsg-next-btn'),
                scoreEl: document.getElementById('tsg-score'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'verb-builder-lab': {
            init: initVerbBuilderLab,
            container: document.getElementById('verb-builder-lab-container'),
            button: document.getElementById('select-verb-builder-lab'),
            elements: {
                plantContainer: document.getElementById('vbl-plant-container'),
                person: document.getElementById('vbl-person'),
                tense: document.getElementById('vbl-tense'),
                verbRoot: document.getElementById('vbl-verb-root'),
                verbEnding: document.getElementById('vbl-verb-ending'),
                optionsContainer: document.getElementById('vbl-options-container'),
                feedback: document.getElementById('vbl-feedback'),
                nextBtn: document.getElementById('vbl-next-btn'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'verb-snap': {
            init: initVerbSnap,
            container: document.getElementById('verb-snap-container'),
            button: document.getElementById('select-verb-snap'),
            elements: {
                score: document.getElementById('vs-score'),
                timer: document.getElementById('vs-timer'),
                promptMedia: document.getElementById('vs-prompt-media'),
                promptText: document.getElementById('vs-prompt-text'),
                optionsArea: document.getElementById('vs-options-area'),
                overlay: document.getElementById('vs-overlay'),
                startBtn: document.getElementById('vs-start-btn'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'gender-quest': {
            init: initGenderQuest,
            container: document.getElementById('gender-quest-container'),
            button: document.getElementById('select-gender-quest'),
            elements: {
                score: document.getElementById('gq-score'),
                nextRoundBtn: document.getElementById('gq-next-round-btn'),
                masculineHome: document.getElementById('gq-masculine-home'),
                feminineHome: document.getElementById('gq-feminine-home'),
                feedback: document.getElementById('gq-feedback'),
                itemPool: document.getElementById('gq-item-pool'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'preposition-path': {
            init: initPrepositionPath,
            container: document.getElementById('preposition-path-container'),
            button: document.getElementById('select-preposition-path'),
            elements: {
                instruction: document.getElementById('pp-instruction'),
                sceneContainer: document.getElementById('pp-scene-container'),
                itemHolder: document.getElementById('pp-item-holder'),
                nextBtn: document.getElementById('pp-next-btn'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'time-machine-verbs': {
            init: initTimeMachineVerbs,
            container: document.getElementById('time-machine-verbs-container'),
            button: document.getElementById('select-time-machine-verbs'),
            elements: {
                container: document.getElementById('time-machine-verbs-container'),
                promptImage: document.getElementById('tmv-prompt-image'),
                promptSentence: document.getElementById('tmv-prompt-sentence'),
                tenseSlider: document.getElementById('tmv-tense-slider'),
                verbDisplay: document.getElementById('tmv-verb-display'),
                checkBtn: document.getElementById('tmv-check-btn'),
                nextBtn: document.getElementById('tmv-next-btn'),
                feedback: document.getElementById('tmv-feedback'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'agreement-arcade': {
            init: initAgreementArcade,
            container: document.getElementById('agreement-arcade-container'),
            button: document.getElementById('select-agreement-arcade'),
            elements: {
                score: document.getElementById('aa-score'),
                lives: document.getElementById('aa-lives'),
                gameArea: document.getElementById('aa-game-area'),
                landingZone: document.getElementById('aa-landing-zone'),
                overlay: document.getElementById('aa-overlay'),
                startBtn: document.getElementById('aa-start-btn'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'conjugation-duel': {
            init: initConjugationDuel,
            container: document.getElementById('conjugation-duel-container'),
            button: document.getElementById('select-conjugation-duel'),
            elements: {
                playerScore: document.getElementById('cd-player-score'),
                opponentScore: document.getElementById('cd-opponent-score'),
                verb: document.getElementById('cd-verb'),
                subject: document.getElementById('cd-subject'),
                tense: document.getElementById('cd-tense'),
                playerInput: document.getElementById('cd-player-input'),
                opponentProgress: document.getElementById('cd-opponent-progress'),
                feedback: document.getElementById('cd-feedback'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'preposition-detective': {
            init: initPrepositionDetective,
            container: document.getElementById('preposition-detective-container'),
            button: document.getElementById('select-preposition-detective'),
            elements: {
                clueEl: document.getElementById('pd-clue'),
                panelsContainerEl: document.getElementById('pd-panels-container'),
                feedbackEl: document.getElementById('pd-feedback'),
                nextBtn: document.getElementById('pd-next-btn'),
                scoreEl: document.getElementById('pd-score'),
                deckTitle: document.getElementById('deck-title')
            }
        },
        'morphology-mixer': {
            init: initMorphologyMixer,
            container: document.getElementById('morphology-mixer-container'),
            button: document.getElementById('select-morphology-mixer'),
            elements: {
                promptImageEl: document.getElementById('mm-prompt-image'),
                wordContainerEl: document.getElementById('mm-word-container'),
                optionsContainerEl: document.getElementById('mm-options-container'),
                feedbackEl: document.getElementById('mm-feedback'),
                scoreEl: document.getElementById('mm-score'),
                nextBtn: document.getElementById('mm-next-btn'),
                deckTitle: document.getElementById('deck-title')
            }
        }
    };

    function initializeGame() {
        const game = games[activeGame];
        if (game && game.init) {
            game.init(currentLanguage, game.elements);
        }
    }

    function switchGame(gameName) {
        activeGame = gameName;
        localStorage.setItem('cosy_activeGame', gameName);

        for (const key in games) {
            const game = games[key];
            if (game.button) {
                game.button.classList.toggle('active', key === gameName);
            }
            if (game.container) {
                game.container.classList.toggle('active', key === gameName);
            }
        }

        initializeGame();
    }

    function changeLanguage() {
        currentLanguage = dom.languageSelector.value;
        localStorage.setItem('cosy_currentLanguage', currentLanguage);
        initializeGame();
    }

    dom.languageSelector.value = currentLanguage;
    dom.languageSelector.addEventListener('change', changeLanguage);

    for (const key in games) {
        const game = games[key];
        if (game.button) {
            game.button.addEventListener('click', () => switchGame(key));
        }
    }

    // Initialize the game based on the loaded state
    switchGame(activeGame);
});
