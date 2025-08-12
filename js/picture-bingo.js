let wordlist = [], bingoCard = [], calledClues = [];
let currentLanguage_pb;

// DOM Elements (passed from main.js)
let newCardBtn, nextClueBtn, clueDisplay, bingoGrid;

// --- BINGO LOGIC ---
function speak(text, lang) {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    // Note: The definition is in English, so we might want to use an English voice
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
}

function checkForBingo() {
    const cells = Array.from(bingoGrid.children);
    const markedIndices = cells.map((cell, index) => cell.classList.contains('marked') ? index : -1).filter(index => index !== -1);

    const winningCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    for (const combo of winningCombos) {
        if (combo.every(index => markedIndices.includes(index))) {
            setTimeout(() => alert('BINGO! You won!'), 100);
            // Disable further clicks
            nextClueBtn.disabled = true;
            return;
        }
    }
}

function handleCellClick(event) {
    const cell = event.currentTarget;
    if (cell.classList.contains('marked')) return;

    // Check if this cell corresponds to the currently called clue
    const currentClue = calledClues[calledClues.length - 1];
    const cellData = bingoCard[parseInt(cell.dataset.index)];

    if (currentClue && currentClue.id === cellData.id) {
        cell.classList.add('marked');
        checkForBingo();
    } else {
        // Optional: Add feedback for wrong click
        cell.style.backgroundColor = 'lightcoral';
        setTimeout(() => { cell.style.backgroundColor = '#fff'; }, 500);
    }
}

function callNextClue() {
    const uncalledClues = bingoCard.filter(item => !calledClues.find(c => c.id === item.id));

    if (uncalledClues.length === 0) {
        clueDisplay.textContent = "No more clues!";
        return;
    }

    const nextClue = uncalledClues[Math.floor(Math.random() * uncalledClues.length)];
    calledClues.push(nextClue);

    clueDisplay.textContent = nextClue.definition;
    speak(nextClue.definition);
}

function generateBingoCard() {
    bingoGrid.innerHTML = '';
    calledClues = [];
    nextClueBtn.disabled = false;
    clueDisplay.textContent = 'Click "Call Next Clue" to start.';

    // Shuffle wordlist and pick 9 items for the card
    const shuffled = [...wordlist].sort(() => 0.5 - Math.random());
    bingoCard = shuffled.slice(0, 9);

    bingoCard.forEach((item, index) => {
        const cell = document.createElement('div');
        cell.className = 'bingo-cell';
        cell.dataset.index = index;
        cell.innerHTML = `<img src="${item.image}" alt="${item.word}">`;
        cell.addEventListener('click', handleCellClick);
        bingoGrid.appendChild(cell);
    });
}

async function loadPictureBingo(language) {
    currentLanguage_pb = language;
    try {
        const response = await fetch(`data/${language}.json`);
        const data = await response.json();
        wordlist = data.wordlist.filter(item => item.definition); // Only use items with definitions
        generateBingoCard();
    } catch (error) {
        console.error('Could not load Picture Bingo data:', error);
        bingoGrid.innerHTML = '<p>Error loading game data.</p>';
    }
}

export function initPictureBingo(lang, elements) {
    newCardBtn = elements.newCardBtn;
    nextClueBtn = elements.nextClueBtn;
    clueDisplay = elements.clueDisplay;
    bingoGrid = elements.bingoGrid;

    newCardBtn.onclick = generateBingoCard;
    nextClueBtn.onclick = callNextClue;

    loadPictureBingo(lang);
}
