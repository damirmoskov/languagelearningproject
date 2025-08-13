// js/gender-quest.js

// --- State ---
let nouns = [];
let currentRoundNouns = [];
let score = 0;
let placedCount = 0;
let domElements = {};

// --- Core Functions ---

async function loadData(language) {
    const dataFile = `data/french_a2_gender.json`; // Assuming French for now
    try {
        const response = await fetch(dataFile);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        nouns = (await response.json()).nouns;
        return true;
    } catch (error) {
        console.error("Could not load Gender Quest data:", error);
        if (domElements.feedback) {
            domElements.feedback.textContent = 'Error loading game data.';
        }
        return false;
    }
}

function startRound() {
    placedCount = 0;
    domElements.itemPool.innerHTML = '';
    domElements.masculineHome.innerHTML = '<h3>Masculine</h3>';
    domElements.feminineHome.innerHTML = '<h3>Feminine</h3>';
    domElements.feedback.textContent = 'Drag the items to their correct home.';
    domElements.nextRoundBtn.style.display = 'none';

    // Select 4 random nouns for the round
    const shuffled = nouns.sort(() => 0.5 - Math.random());
    currentRoundNouns = shuffled.slice(0, 4);

    currentRoundNouns.forEach(createDraggableItem);
}

function createDraggableItem(noun) {
    const item = document.createElement('div');
    item.id = `gq-item-${noun.word}`;
    item.className = 'gq-item';
    item.draggable = true;
    item.dataset.gender = noun.gender;

    const img = document.createElement('img');
    img.src = noun.image_url;
    img.alt = noun.word;
    // Make image non-draggable to not interfere with the parent div's dragging
    img.draggable = false;

    const text = document.createElement('p');
    text.textContent = `${noun.article} ${noun.word}`;

    item.appendChild(img);
    item.appendChild(text);

    item.addEventListener('dragstart', handleDragStart);
    domElements.itemPool.appendChild(item);
}

// --- Drag and Drop Handlers ---

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
        e.target.classList.add('dragging');
    }, 0);
}

function handleDragOver(e) {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    const id = e.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);
    const droppedGender = draggable.dataset.gender;
    const homeGender = e.currentTarget.dataset.gender;

    if (droppedGender === homeGender) {
        // Correct drop
        draggable.classList.remove('dragging');
        draggable.draggable = false;
        draggable.removeEventListener('dragstart', handleDragStart);
        e.currentTarget.appendChild(draggable);

        score += 10;
        placedCount++;
        domElements.score.textContent = score;
        domElements.feedback.textContent = 'Correct!';

        if (placedCount === currentRoundNouns.length) {
            endRound();
        }
    } else {
        // Incorrect drop
        domElements.feedback.textContent = 'Wrong home! Try again.';
        draggable.classList.remove('dragging');
    }
}

function endRound() {
    domElements.feedback.textContent = 'Round complete!';
    domElements.nextRoundBtn.style.display = 'block';
}

// --- Initialization ---

export async function initGenderQuest(language, elements) {
    domElements = elements;
    score = 0;
    domElements.score.textContent = score;

    const loaded = await loadData(language);
    if (loaded) {
        // Add event listeners to the drop zones
        domElements.masculineHome.addEventListener('dragover', handleDragOver);
        domElements.masculineHome.addEventListener('dragleave', handleDragLeave);
        domElements.masculineHome.addEventListener('drop', handleDrop);

        domElements.feminineHome.addEventListener('dragover', handleDragOver);
        domElements.feminineHome.addEventListener('dragleave', handleDragLeave);
        domElements.feminineHome.addEventListener('drop', handleDrop);

        domElements.nextRoundBtn.addEventListener('click', startRound);

        startRound();
    }
}
