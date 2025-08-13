// js/preposition-path.js

// --- State ---
let scenes = [];
let currentScene = null;
let domElements = {};
let dropSucceeded = false;

// --- Core Functions ---

async function loadData(language) {
    const dataFile = `data/${language}_prepositions.json`;
    try {
        const response = await fetch(dataFile);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        scenes = (await response.json()).scenes;
        return true;
    } catch (error) {
        console.error("Could not load Preposition Path data:", error);
        if (domElements.instruction) {
            domElements.instruction.textContent = 'Error loading game data for this language. Please select another.';
            domElements.sceneContainer.style.backgroundImage = 'none';
            domElements.itemHolder.innerHTML = '';
        }
        return false;
    }
}

function startRound() {
    // Reset state
    domElements.sceneContainer.innerHTML = '';
    domElements.itemHolder.innerHTML = '';
    domElements.nextBtn.style.display = 'none';

    // Select a new scene
    currentScene = scenes[Math.floor(Math.random() * scenes.length)];

    // Build the scene
    domElements.instruction.textContent = currentScene.instruction;
    domElements.sceneContainer.style.backgroundImage = `url(${currentScene.background_image_url})`;

    // Create drop zones
    currentScene.drop_zones.forEach(createDropZone);

    // Create draggable item
    createDraggableItem(currentScene.draggable_item);
}

function createDropZone(zoneData) {
    const zone = document.createElement('div');
    zone.id = zoneData.id;
    zone.className = 'pp-drop-zone';
    zone.dataset.isCorrect = zoneData.is_correct;

    // Apply position from data
    zone.style.top = zoneData.position.top;
    zone.style.left = zoneData.position.left;
    zone.style.width = zoneData.position.width;
    zone.style.height = zoneData.position.height;

    // Add event listeners
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('dragleave', handleDragLeave);
    zone.addEventListener('drop', handleDrop);

    domElements.sceneContainer.appendChild(zone);
}

function createDraggableItem(itemData) {
    const item = document.createElement('div');
    item.id = 'pp-draggable-item';
    item.className = 'pp-item';
    item.draggable = true;

    const img = document.createElement('img');
    img.src = itemData.image_url;
    img.alt = itemData.name;
    img.draggable = false;

    item.appendChild(img);

    // Add event listeners
    item.addEventListener('dragstart', handleDragStart);
    item.addEventListener('dragend', handleDragEnd);

    domElements.itemHolder.appendChild(item);
}

// --- Drag and Drop Handlers ---

function handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.id);
    e.dataTransfer.effectAllowed = 'move';
    dropSucceeded = false; // Reset on new drag
    setTimeout(() => {
        e.target.style.opacity = '0.5';
    }, 0);
}

function handleDragEnd(e) {
    e.target.style.opacity = '1';
    // If drop was not successful, it remains in the holder.
    // If it was successful, it will have been moved.
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
    const isCorrect = e.currentTarget.dataset.isCorrect === 'true';

    if (isCorrect) {
        // Correct drop
        draggable.draggable = false;
        // Position the item within the drop zone instead of just appending
        e.currentTarget.appendChild(draggable);
        draggable.style.position = 'absolute';
        draggable.style.top = '50%';
        draggable.style.left = '50%';
        draggable.style.transform = 'translate(-50%, -50%)';

        domElements.instruction.textContent = 'Correct!';
        domElements.nextBtn.style.display = 'block';
        dropSucceeded = true;
    } else {
        // Incorrect drop
        domElements.instruction.textContent = 'Not quite! Try another spot.';
        // Item will snap back because dropSucceeded is false
    }
}

// --- Initialization ---

export async function initPrepositionPath(language, elements) {
    domElements = elements;
    const loaded = await loadData(language);
    if (loaded) {
        domElements.nextBtn.addEventListener('click', startRound);
        startRound();
    }
}
