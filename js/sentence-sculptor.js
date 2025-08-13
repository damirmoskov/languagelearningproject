// js/sentence-sculptor.js

// --- DOM Elements ---
let targetSentenceEl, sourceChunksEl, checkBtn, nextBtn, feedbackEl, deckTitleEl, promptImageEl;

// --- Game State ---
let currentLanguage_ss;
let allSentences = [];
let availableSentences = [];
let currentSentence = null;
let draggedChunk = null;
let heldChunk = null;

// --- Helper for localStorage ---
const getStorageKey = () => `cosy_ss_progress_${currentLanguage_ss}`;

function saveState(state) {
    localStorage.setItem(getStorageKey(), JSON.stringify(state));
}

function loadState() {
    const savedState = localStorage.getItem(getStorageKey());
    return savedState ? JSON.parse(savedState) : { completedIds: [], puzzle: null };
}

function clearState() {
    localStorage.removeItem(getStorageKey());
}

async function loadSentences() {
    try {
        const response = await fetch(`data/${currentLanguage_ss}_sentence_sculptor.json`);
        if (!response.ok) throw new Error(`Data file not found for ${currentLanguage_ss}_sentence_sculptor`);
        const data = await response.json();
        allSentences = data.sentences;
        deckTitleEl.textContent = `${data.lang} ${data.level} - Sentence Sculptor`;
        const { completedIds } = loadState();
        availableSentences = allSentences.filter(s => !completedIds.includes(s.id));
    } catch (error) {
        console.error("Could not load sentence sculptor data:", error);
        deckTitleEl.textContent = "Sentence Sculptor";
        feedbackEl.textContent = "Error loading game data for this language. Please select another.";
        promptImageEl.style.display = 'none';
        sourceChunksEl.innerHTML = '';
        targetSentenceEl.innerHTML = '';
        checkBtn.disabled = true;
        allSentences = [];
        availableSentences = [];
    }
}

function displayNextSentence(puzzleState = null) {
    if (availableSentences.length === 0 && !puzzleState) {
        targetSentenceEl.innerHTML = "";
        sourceChunksEl.innerHTML = "You've completed all the sentences!";
        promptImageEl.style.display = 'none';
        feedbackEl.textContent = "Great job! 🎉";
        checkBtn.disabled = true;
        nextBtn.textContent = "Play Again";
        nextBtn.onclick = () => {
            clearState();
            availableSentences = [...allSentences];
            nextBtn.textContent = "Next Sentence";
            displayNextSentence();
        };
        return;
    }

    if (!puzzleState) {
        const sentenceIndex = Math.floor(Math.random() * availableSentences.length);
        currentSentence = availableSentences.splice(sentenceIndex, 1)[0];
    } else {
        currentSentence = allSentences.find(s => s.id === puzzleState.id);
    }

    targetSentenceEl.innerHTML = "";
    sourceChunksEl.innerHTML = "";
    feedbackEl.textContent = "";
    checkBtn.disabled = false;
    promptImageEl.style.display = 'block';
    promptImageEl.src = currentSentence.image_url;
    promptImageEl.alt = currentSentence.chunks.map(c => c.text).join(' ');

    let allChunksForDisplay = puzzleState ? puzzleState.source.map(id => {
        return currentSentence.chunks.find(c => c.id === id) || (currentSentence.distractors || []).find(d => d.id === id);
    }) : [...currentSentence.chunks, ...(currentSentence.distractors || [])];

    allChunksForDisplay = allChunksForDisplay.sort(() => Math.random() - 0.5);

    allChunksForDisplay.forEach(chunk => {
        if (!chunk) return;
        const chunkEl = createChunkElement(chunk);
        sourceChunksEl.appendChild(chunkEl);
    });

    if (puzzleState) {
        puzzleState.target.forEach(chunkId => {
            const chunk = currentSentence.chunks.find(c => c.id === chunkId);
            if (!chunk) return;
            const chunkEl = createChunkElement(chunk);
            targetSentenceEl.appendChild(chunkEl);
        });
    }

    if (!puzzleState) {
        savePuzzleState();
    }
}

function createChunkElement(chunk) {
    const chunkEl = document.createElement('div');
    chunkEl.textContent = chunk.text;
    chunkEl.className = 'scs-chunk'; // Renamed class
    chunkEl.draggable = true;
    chunkEl.dataset.id = chunk.id;
    chunkEl.tabIndex = 0;
    chunkEl.addEventListener('dragstart', handleDragStart);
    chunkEl.addEventListener('dragend', handleDragEnd);
    chunkEl.addEventListener('keydown', handleChunkKeyDown);
    return chunkEl;
}

function savePuzzleState() {
    const state = loadState();
    const sourceIds = [...sourceChunksEl.children].map(c => c.dataset.id);
    const targetIds = [...targetSentenceEl.children].map(c => c.dataset.id);
    state.puzzle = { id: currentSentence.id, source: sourceIds, target: targetIds };
    saveState(state);
}

function checkAnswer() {
    const droppedChunks = [...targetSentenceEl.children];
    const droppedIds = droppedChunks.map(chunk => chunk.dataset.id);
    const isCorrect = JSON.stringify(droppedIds) === JSON.stringify(currentSentence.correctOrder);

    if (isCorrect) {
        feedbackEl.textContent = "Correct! Well done!";
        feedbackEl.style.color = 'green';
        checkBtn.disabled = true;
        const state = loadState();
        state.completedIds.push(currentSentence.id);
        state.puzzle = null;
        saveState(state);
    } else {
        feedbackEl.textContent = "Not quite right. Try rearranging the words.";
        feedbackEl.style.color = 'red';
    }
}

function handleDragStart(e) {
    draggedChunk = e.target;
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
    setTimeout(() => {
        e.target.classList.add('dragging');
    }, 0);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    e.preventDefault();
}

function handleDrop(e) {
    e.preventDefault();
    const dropzone = e.target.closest('.dropzone, .source-zone');
    if (dropzone) {
        // Simplified logic: always append to the end of the dropzone.
        // The complex reordering logic was buggy with horizontal layouts.
        dropzone.appendChild(draggedChunk);
    }
    savePuzzleState();
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.ss-chunk:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function handleChunkKeyDown(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    if (heldChunk) {
        const dropTarget = e.currentTarget;
        if (dropTarget.classList.contains('ss-chunk')) {
            dropTarget.parentNode.insertBefore(heldChunk, dropTarget);
        }
        heldChunk.classList.remove('held');
        heldChunk = null;
    } else {
        heldChunk = e.currentTarget;
        heldChunk.classList.add('held');
    }
}

function handleZoneKeyDown(e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    if (!heldChunk) return;
    e.preventDefault();
    const dropzone = e.currentTarget;
    dropzone.appendChild(heldChunk);
    heldChunk.classList.remove('held');
    heldChunk = null;
    savePuzzleState();
}

export async function initSentenceSculptor(lang, elements) {
    currentLanguage_ss = lang;
    targetSentenceEl = elements.targetSentence;
    sourceChunksEl = elements.sourceChunks;
    checkBtn = elements.checkBtn;
    nextBtn = elements.nextBtn;
    feedbackEl = elements.feedback;
    deckTitleEl = elements.deckTitle;
    promptImageEl = elements.promptImage;

    checkBtn.onclick = checkAnswer;
    nextBtn.onclick = () => displayNextSentence();

    targetSentenceEl.tabIndex = 0;
    sourceChunksEl.tabIndex = 0;
    targetSentenceEl.addEventListener('keydown', handleZoneKeyDown);
    sourceChunksEl.addEventListener('keydown', handleZoneKeyDown);

    targetSentenceEl.addEventListener('dragover', handleDragOver);
    targetSentenceEl.addEventListener('drop', handleDrop);
    sourceChunksEl.addEventListener('dragover', handleDragOver);
    sourceChunksEl.addEventListener('drop', handleDrop);

    await loadSentences();
    const { puzzle } = loadState();
    if (puzzle) {
        displayNextSentence(puzzle);
    } else {
        displayNextSentence();
    }
}
