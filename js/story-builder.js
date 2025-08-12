// --- DOM Elements ---
let targetSentenceEl, sourceChunksEl, checkBtn, nextBtn, feedbackEl, deckTitleEl;

// --- Game State ---
let currentLanguage_sb;
let allSentences = [];
let availableSentences = [];
let currentSentence = null;
let draggedChunk = null; // To keep track of the element being dragged

/**
 * Loads sentence data for the game.
 */
async function loadSentences() {
    try {
        const response = await fetch(`data/${currentLanguage_sb}_story.json`);
        if (!response.ok) throw new Error(`Data file not found for ${currentLanguage_sb}`);
        const data = await response.json();
        allSentences = data.sentences;
        availableSentences = [...allSentences]; // Create a copy to modify during the session
        deckTitleEl.textContent = `${data.lang} ${data.level} - Story Builder`;
    } catch (error) {
        console.error("Could not load story builder data:", error);
        deckTitleEl.textContent = "Error loading data";
        allSentences = [];
        availableSentences = [];
    }
}

/**
 * Displays the next sentence for the user to build.
 */
function displayNextSentence() {
    if (availableSentences.length === 0) {
        targetSentenceEl.innerHTML = "";
        sourceChunksEl.innerHTML = "You've completed all the sentences!";
        feedbackEl.textContent = "Great job! 🎉";
        checkBtn.disabled = true;
        nextBtn.textContent = "Play Again"; // Allow restarting
        nextBtn.onclick = () => {
            availableSentences = [...allSentences];
            nextBtn.textContent = "Next Sentence";
            displayNextSentence();
        };
        return;
    }

    const sentenceIndex = Math.floor(Math.random() * availableSentences.length);
    currentSentence = availableSentences.splice(sentenceIndex, 1)[0];

    targetSentenceEl.innerHTML = "";
    sourceChunksEl.innerHTML = "";
    feedbackEl.textContent = "";
    checkBtn.disabled = false;

    const shuffledChunks = [...currentSentence.chunks].sort(() => Math.random() - 0.5);
    shuffledChunks.forEach(chunk => {
        const chunkEl = document.createElement('div');
        chunkEl.textContent = chunk.text;
        chunkEl.className = 'sb-chunk';
        chunkEl.draggable = true;
        chunkEl.dataset.id = chunk.id;
        chunkEl.addEventListener('dragstart', handleDragStart);
        chunkEl.addEventListener('dragend', handleDragEnd);
        sourceChunksEl.appendChild(chunkEl);
    });
}

/**
 * Checks if the user's constructed sentence is correct.
 */
function checkAnswer() {
    const droppedChunks = [...targetSentenceEl.children];
    const droppedIds = droppedChunks.map(chunk => chunk.dataset.id);

    const isCorrect = JSON.stringify(droppedIds) === JSON.stringify(currentSentence.correctOrder);

    if (isCorrect) {
        feedbackEl.textContent = "Correct! Well done!";
        feedbackEl.style.color = 'green';
        checkBtn.disabled = true;
    } else {
        feedbackEl.textContent = "Not quite right. Try rearranging the words.";
        feedbackEl.style.color = 'red';
    }
}

// --- Drag and Drop Handlers ---

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
        // Find the element being dragged over to insert before it
        const afterElement = getDragAfterElement(dropzone, e.clientY);
        if (afterElement == null) {
            dropzone.appendChild(draggedChunk);
        } else {
            dropzone.insertBefore(draggedChunk, afterElement);
        }
    }
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.sb-chunk:not(.dragging)')];

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


/**
 * Initializes the Story Builder game.
 */
export async function initStoryBuilder(lang, elements) {
    currentLanguage_sb = lang;

    targetSentenceEl = elements.targetSentence;
    sourceChunksEl = elements.sourceChunks;
    checkBtn = elements.checkBtn;
    nextBtn = elements.nextBtn;
    feedbackEl = elements.feedback;
    deckTitleEl = elements.deckTitle;

    checkBtn.onclick = checkAnswer;
    nextBtn.onclick = displayNextSentence;

    // Setup dropzone listeners
    targetSentenceEl.addEventListener('dragover', handleDragOver);
    targetSentenceEl.addEventListener('drop', handleDrop);
    sourceChunksEl.addEventListener('dragover', handleDragOver);
    sourceChunksEl.addEventListener('drop', handleDrop);

    await loadSentences();
    displayNextSentence();
}
