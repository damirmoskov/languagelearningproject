export function initMorphologyMixer(language, elements) {
    let challenges = [];
    let currentChallengeIndex = -1;
    let score = 0;

    async function loadGameData(language) {
        try {
            const response = await fetch(`data/${language}_morphology_mixer.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            challenges = data.challenges;
            elements.deckTitle.textContent = data.title;
            loadNextChallenge();
        } catch (error) {
            console.error('Failed to load morphology mixer data:', error);
            elements.wordContainerEl.textContent = 'Error loading game data for this language. Please select another.';
            elements.promptImageEl.style.display = 'none';
            elements.optionsContainerEl.innerHTML = '';
        }
    }

    function loadNextChallenge() {
        currentChallengeIndex = (currentChallengeIndex + 1) % challenges.length;
        const challenge = challenges[currentChallengeIndex];

        elements.promptImageEl.src = challenge.image;
        elements.promptImageEl.alt = challenge.correctAnswer;

        elements.wordContainerEl.innerHTML = '';
        const prefixSpan = document.createElement('span');
        prefixSpan.id = 'mm-prefix';
        prefixSpan.className = 'mm-morpheme-slot';

        const baseWordSpan = document.createElement('span');
        baseWordSpan.id = 'mm-base-word';
        baseWordSpan.textContent = challenge.baseWord;

        const suffixSpan = document.createElement('span');
        suffixSpan.id = 'mm-suffix';
        suffixSpan.className = 'mm-morpheme-slot';

        if (challenge.morphemeSlot === 'prefix') {
            prefixSpan.textContent = '___';
        } else {
            suffixSpan.textContent = '___';
        }

        elements.wordContainerEl.append(prefixSpan, baseWordSpan, suffixSpan);

        elements.optionsContainerEl.innerHTML = '';
        const shuffledOptions = [...challenge.options].sort(() => Math.random() - 0.5);
        shuffledOptions.forEach(option => {
            const btn = document.createElement('button');
            btn.textContent = option.morpheme;
            btn.className = 'mm-option-btn';
            btn.addEventListener('click', () => handleOptionClick(option, challenge));
            elements.optionsContainerEl.appendChild(btn);
        });

        elements.feedbackEl.textContent = '';
        elements.feedbackEl.className = 'feedback';
        elements.nextBtn.style.display = 'none';
    }

    function handleOptionClick(selectedOption, challenge) {
        // Disable all option buttons
        const allButtons = elements.optionsContainerEl.querySelectorAll('button');
        allButtons.forEach(btn => btn.disabled = true);

        // Display the selected morpheme
        const slotId = challenge.morphemeSlot === 'prefix' ? 'mm-prefix' : 'mm-suffix';
        const slotEl = document.getElementById(slotId);
        if (slotEl) {
            slotEl.textContent = selectedOption.morpheme;
        }

        if (selectedOption.isCorrect) {
            score++;
            elements.scoreEl.textContent = score;
            elements.feedbackEl.textContent = 'Correct!';
            elements.feedbackEl.classList.add('correct');
        } else {
            elements.feedbackEl.textContent = `Not quite. The answer is: ${challenge.correctAnswer}`;
            elements.feedbackEl.classList.add('incorrect');
        }

        elements.nextBtn.style.display = 'block';
    }

    elements.nextBtn.addEventListener('click', loadNextChallenge);

    loadGameData(language);
}
