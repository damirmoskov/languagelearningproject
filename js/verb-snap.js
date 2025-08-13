// js/verb-snap.js

// --- State ---
let challenges = [];
let currentChallenge = null;
let score = 0;
let timeLeft = 60;
let timerId = null;
let gameActive = false;
let domElements = {};

// --- Core Functions ---

async function loadData(language) {
    const dataFile = `data/${language}_verbsnap.json`;
    try {
        const response = await fetch(dataFile);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        challenges = (await response.json()).challenges;
        return true;
    } catch (error) {
        console.error("Could not load Verb Snap! data:", error);
        if(domElements.overlay) {
            domElements.overlay.style.display = 'flex';
            domElements.overlay.innerHTML = `<p style="color: red;">Error loading game data for this language. Please select another.</p>`;
        }
        return false;
    }
}

function startGame() {
    score = 0;
    timeLeft = 60;
    gameActive = true;

    if (domElements.score) domElements.score.textContent = score;
    if (domElements.timer) domElements.timer.textContent = timeLeft;
    if (domElements.overlay) domElements.overlay.style.display = 'none';
    if (domElements.optionsArea) domElements.optionsArea.innerHTML = '';

    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
        timeLeft--;
        if (domElements.timer) domElements.timer.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    startRound();
}

function startRound() {
    if (!gameActive || challenges.length === 0) return;

    if (domElements.optionsArea) domElements.optionsArea.innerHTML = '';

    currentChallenge = challenges[Math.floor(Math.random() * challenges.length)];

    if (domElements.promptMedia) domElements.promptMedia.src = currentChallenge.image_url;
    if (domElements.promptText) domElements.promptText.textContent = currentChallenge.prompt;

    spawnOptions();
}

function spawnOptions() {
    const options = [currentChallenge.correct_form, ...currentChallenge.distractors];
    const shuffledOptions = options.sort(() => Math.random() - 0.5);

    shuffledOptions.forEach((option, index) => {
        setTimeout(() => {
            if (gameActive) {
                createOptionTile(option);
            }
        }, index * 1200); // Stagger appearance
    });
}

function createOptionTile(option) {
    const tile = document.createElement('div');
    tile.textContent = option;
    tile.classList.add('vs-option-tile');
    tile.onclick = (e) => checkAnswer(e.target.textContent, tile);

    const areaHeight = domElements.optionsArea.offsetHeight;
    const tileHeight = 40; // Approximate height
    tile.style.top = `${Math.random() * (areaHeight - tileHeight)}px`;

    // Randomly decide if the tile comes from the left or right
    if (Math.random() > 0.5) {
        // From left
        tile.style.left = '0px';
        tile.style.animationName = 'vs-move-lr';
    } else {
        // From right
        tile.style.right = '0px';
        tile.style.animationName = 'vs-move-rl';
    }

    // Add random duration
    tile.style.animationDuration = `${8 + Math.random() * 4}s`; // 8-12 seconds

    // Remove tile when animation finishes
    tile.addEventListener('animationend', () => {
        if (tile.parentElement) {
            tile.remove();
        }
    });

    domElements.optionsArea.appendChild(tile);
}

function checkAnswer(selectedAnswer, tile) {
    if (!gameActive) return;

    if (selectedAnswer === currentChallenge.correct_form) {
        score++;
        domElements.score.textContent = score;
        tile.classList.add('correct');
    } else {
        tile.classList.add('incorrect');
    }

    // Prevent further clicks on the same tile
    tile.style.pointerEvents = 'none';

    setTimeout(() => {
        startRound();
    }, 400); // Brief pause before next round
}

function endGame() {
    gameActive = false;
    clearInterval(timerId);
    if (domElements.optionsArea) domElements.optionsArea.innerHTML = '';

    if (domElements.overlay) {
        domElements.overlay.style.display = 'flex';
        domElements.overlay.innerHTML = `
            <div class="vs-game-over-content">
                <h2>Game Over!</h2>
                <p>Final Score: ${score}</p>
                <button id="vs-start-btn">Play Again</button>
            </div>
        `;
        document.getElementById('vs-start-btn').addEventListener('click', startGame);
    }
}

// --- Initialization ---

export async function initVerbSnap(language, elements) {
    domElements = elements;
    const loaded = await loadData(language);
    if (loaded) {
        if (domElements.startBtn) {
            domElements.startBtn.addEventListener('click', startGame);
        }
    }
}
