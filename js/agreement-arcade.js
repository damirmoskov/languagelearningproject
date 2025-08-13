// js/agreement-arcade.js

// --- State ---
let challenges = [];
let score = 0;
let lives = 3;
let gameActive = false;
let activeObjects = []; // To hold state of falling objects
let lastSpawnTime = 0;
const spawnInterval = 3000; // ms
let domElements = {};

// --- Core Functions ---

async function loadData(language) {
    const dataFile = `data/${language}_agreement.json`;
    try {
        const response = await fetch(dataFile);
        if (!response.ok) throw new Error(`HTTP error!`);
        challenges = (await response.json()).challenges;
        return true;
    } catch (error) {
        console.error("Could not load Agreement Arcade data:", error);
        return false;
    }
}

function startGame() {
    score = 0;
    lives = 3;
    activeObjects = [];
    lastSpawnTime = 0;
    gameActive = true;

    domElements.score.textContent = score;
    domElements.lives.textContent = lives;
    domElements.overlay.style.display = 'none';
    domElements.gameArea.innerHTML = '';

    requestAnimationFrame(gameLoop);
}

function spawnChallenge() {
    const challenge = challenges[Math.floor(Math.random() * challenges.length)];
    const objectEl = document.createElement('div');
    objectEl.className = 'aa-object';

    const subjectEl = document.createElement('span');
    subjectEl.className = 'aa-subject';
    subjectEl.textContent = challenge.subject.text;

    const wordEl = document.createElement('span');
    wordEl.className = 'aa-word';
    wordEl.textContent = challenge.forms[Object.keys(challenge.forms)[0]]; // Start with first form
    wordEl.dataset.formIndex = 0;
    wordEl.dataset.forms = JSON.stringify(Object.values(challenge.forms));
    wordEl.addEventListener('click', cycleWordForm);

    objectEl.appendChild(subjectEl);
    objectEl.appendChild(document.createTextNode(' ')); // space
    objectEl.appendChild(wordEl);

    const gameAreaWidth = domElements.gameArea.offsetWidth;
    const xPosition = Math.random() * (gameAreaWidth - 150); // 150 is approx width of object

    const gameObject = {
        element: objectEl,
        x: xPosition,
        y: -40, // Start just above the screen
        speed: 50 + Math.random() * 50, // pixels per second
        challengeData: challenge
    };

    objectEl.style.left = `${xPosition}px`;
    activeObjects.push(gameObject);
    domElements.gameArea.appendChild(objectEl);
}

function cycleWordForm(e) {
    const wordEl = e.target;
    const forms = JSON.parse(wordEl.dataset.forms);
    let currentIndex = parseInt(wordEl.dataset.formIndex, 10);
    currentIndex = (currentIndex + 1) % forms.length;
    wordEl.textContent = forms[currentIndex];
    wordEl.dataset.formIndex = currentIndex;
}

function handleLanding(obj) {
    const correctForm = obj.challengeData.forms[obj.challengeData.correct_form_key];
    const selectedForm = obj.element.querySelector('.aa-word').textContent;

    if (correctForm === selectedForm) {
        score += 10;
        domElements.score.textContent = score;
        obj.element.classList.add('correct');
    } else {
        lives--;
        domElements.lives.textContent = lives;
        obj.element.classList.add('incorrect');
        if (lives <= 0) {
            endGame();
        }
    }

    // Remove after a brief moment to show feedback
    setTimeout(() => {
        obj.element.remove();
    }, 500);
}

function endGame() {
    gameActive = false;
    domElements.overlay.style.display = 'flex';
    domElements.overlay.innerHTML = `
        <div class="aa-game-over-content">
            <h2>Game Over</h2>
            <p>Final Score: ${score}</p>
            <button id="aa-start-btn">Play Again</button>
        </div>
    `;
    document.getElementById('aa-start-btn').addEventListener('click', startGame);
}

function gameLoop(timestamp) {
    if (!gameActive) return;

    const deltaTime = (timestamp - (lastSpawnTime || timestamp)) / 1000; // in seconds

    // Spawn new objects
    if (timestamp - lastSpawnTime > spawnInterval) {
        lastSpawnTime = timestamp;
        spawnChallenge();
    }

    // Update and check existing objects
    const landingZoneTop = domElements.landingZone.offsetTop;

    for (let i = activeObjects.length - 1; i >= 0; i--) {
        const obj = activeObjects[i];
        obj.y += obj.speed * deltaTime;

        if (obj.y + obj.element.offsetHeight >= landingZoneTop) {
            handleLanding(obj);
            activeObjects.splice(i, 1); // Remove from active objects
        } else {
            obj.element.style.transform = `translateY(${obj.y}px)`;
        }
    }

    requestAnimationFrame(gameLoop);
}


// --- Initialization ---

export async function initAgreementArcade(language, elements) {
    domElements = elements;
    const loaded = await loadData(language);
    if (loaded) {
        if (domElements.startBtn) {
            domElements.startBtn.addEventListener('click', startGame);
        }
    } else {
        domElements.overlay.style.display = 'flex';
        domElements.overlay.innerHTML = '<p style="color: red;">Could not load game data for this language. Please select another.</p>';
    }
}
