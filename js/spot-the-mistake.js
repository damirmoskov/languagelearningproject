let textsData = [], currentTextIndex = 0, mistakesFound = 0, totalMistakes = 0;
let currentLanguage_stm;
let statsFound, statsTotal, textContainer, nextButton, deckTitle;

function handleWordClick(event, mistakeData) {
    const clickedWordEl = event.currentTarget;
    const clickedWord = clickedWordEl.textContent.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g,"");

    if (clickedWordEl.classList.contains('correct') || clickedWordEl.classList.contains('incorrect')) {
        return;
    }

    const mistake = mistakeData.find(m => m.word === clickedWord);

    if (mistake) {
        mistakesFound++;
        statsFound.textContent = mistakesFound;
        clickedWordEl.classList.add('correct');
        const correctionEl = document.createElement('span');
        correctionEl.textContent = ` (${mistake.correction})`;
        correctionEl.style.color = 'blue';
        clickedWordEl.appendChild(correctionEl);
    } else {
        clickedWordEl.classList.add('incorrect');
    }
}

function renderText() {
    if (currentTextIndex >= textsData.length) {
        textContainer.innerHTML = '<p>No more texts available!</p>';
        nextButton.textContent = 'Play Again?';
        nextButton.onclick = () => resetGame(true);
        return;
    }

    const textData = textsData[currentTextIndex];
    const words = textData.text.split(' ');

    mistakesFound = 0;
    totalMistakes = textData.mistakes.length;
    statsFound.textContent = mistakesFound;
    statsTotal.textContent = totalMistakes;

    textContainer.innerHTML = '';
    words.forEach(word => {
        const wordEl = document.createElement('span');
        wordEl.className = 'word';
        wordEl.textContent = word;
        wordEl.addEventListener('click', (e) => handleWordClick(e, textData.mistakes));
        textContainer.appendChild(wordEl);
        textContainer.appendChild(document.createTextNode(' '));
    });
}

function resetGame(fullReset = false) {
    if (fullReset) {
        currentTextIndex = 0;
    }
    renderText();
    nextButton.textContent = 'Next Text';
    nextButton.onclick = () => {
        currentTextIndex++;
        renderText();
    };
}

async function loadSpotTheMistake(language) {
    currentLanguage_stm = 'english_b1';
    try {
        const response = await fetch(`data/english_b1_spot.json`);
        const data = await response.json();
        textsData = data.texts;
        deckTitle.textContent = `${data.lang} ${data.level}`;
        resetGame(true);
    } catch (error) {
        console.error('Could not load Spot the Mistake data:', error);
        textContainer.innerHTML = '<p>Error loading game data. Please try another language.</p>';
    }
}

export function initSpotTheMistake(lang, elements) {
    statsFound = elements.statsFound;
    statsTotal = elements.statsTotal;
    textContainer = elements.textContainer;
    nextButton = elements.nextButton;
    deckTitle = elements.deckTitle;

    loadSpotTheMistake(lang);
}
