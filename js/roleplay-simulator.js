// --- DOM Elements ---
let scenarioTitleEl, conversationLogEl, npcPromptEl, userChoicesEl;

// --- Game State ---
let currentLanguage_rs;
let dialogueNodes = {};
let currentNodeId = 'start';

// --- Helper for localStorage ---
const getStorageKey = () => `cosy_rs_progress_${currentLanguage_rs}`;

function saveGameState() {
    const state = {
        currentNodeId: currentNodeId,
        logHTML: conversationLogEl.innerHTML
    };
    localStorage.setItem(getStorageKey(), JSON.stringify(state));
}

function loadGameState() {
    const savedState = localStorage.getItem(getStorageKey());
    return savedState ? JSON.parse(savedState) : null;
}

function clearGameState() {
    localStorage.removeItem(getStorageKey());
}

/**
 * Loads the dialogue data for the game.
 */
async function loadDialogue() {
    try {
        const response = await fetch(`data/${currentLanguage_rs}_roleplay.json`);
        if (!response.ok) throw new Error(`Data file not found for ${currentLanguage_rs}`);
        const data = await response.json();
        dialogueNodes = data.dialogueNodes;
        scenarioTitleEl.textContent = data.scenario;
    } catch (error) {
        console.error("Could not load roleplay data:", error);
        scenarioTitleEl.textContent = "Error loading scenario";
        dialogueNodes = {};
    }
}

/**
 * Updates the UI to display the content of a given dialogue node.
 * @param {string} nodeId - The ID of the dialogue node to display.
 */
function goToNode(nodeId, restoreLog = false, logHTML = '') {
    if (nodeId === 'start') {
        clearGameState();
        conversationLogEl.innerHTML = '';
    }

    if (restoreLog) {
        conversationLogEl.innerHTML = logHTML;
    }

    const node = dialogueNodes[nodeId];
    if (!node) {
        console.error(`Node with ID "${nodeId}" not found.`);
        npcPromptEl.textContent = "The conversation has ended unexpectedly.";
        userChoicesEl.innerHTML = '';
        return;
    }

    currentNodeId = nodeId;

    // Update NPC prompt and add to log (if not restoring)
    npcPromptEl.textContent = node.npcPrompt;
    if (!restoreLog) {
        addToLog(node.npcPrompt, 'rs-npc-line');
    }

    // Update user choices
    userChoicesEl.innerHTML = '';

    if (node.isEnd) {
        const restartBtn = document.createElement('button');
        restartBtn.textContent = 'Play Again';
        restartBtn.onclick = () => {
            clearGameState();
            goToNode('start');
        };
        userChoicesEl.appendChild(restartBtn);
    } else {
        node.userChoices.forEach(choice => {
            const choiceBtn = document.createElement('button');
            choiceBtn.textContent = choice.text;
            choiceBtn.dataset.nextNode = choice.nextNode;
            choiceBtn.addEventListener('click', handleUserChoice);
            userChoicesEl.appendChild(choiceBtn);
        });
    }
}

/**
 * Handles the user clicking on a choice button.
 * @param {Event} event - The click event.
 */
function handleUserChoice(event) {
    const selectedChoiceText = event.target.textContent;
    const nextNodeId = event.target.dataset.nextNode;

    addToLog(selectedChoiceText, 'rs-user-line');

    if (nextNodeId) {
        goToNode(nextNodeId);
    }
}

/**
 * Adds a line of dialogue to the conversation log display.
 * @param {string} text - The text of the dialogue line.
 * @param {string} className - The CSS class to apply ('rs-npc-line' or 'rs-user-line').
 */
function addToLog(text, className) {
    const logEntry = document.createElement('p');
    logEntry.textContent = text;
    logEntry.className = className;
    conversationLogEl.prepend(logEntry);
    saveGameState(); // Save state every time the log is updated
}

/**
 * Initializes the Roleplay Simulator game.
 */
export async function initRoleplaySimulator(lang, elements) {
    currentLanguage_rs = lang;

    scenarioTitleEl = elements.scenarioTitle;
    conversationLogEl = elements.conversationLog;
    npcPromptEl = elements.npcPrompt;
    userChoicesEl = elements.userChoices;

    await loadDialogue();

    const savedState = loadGameState();
    if (savedState && dialogueNodes[savedState.currentNodeId]) {
        goToNode(savedState.currentNodeId, true, savedState.logHTML);
    } else {
        goToNode('start');
    }
}
