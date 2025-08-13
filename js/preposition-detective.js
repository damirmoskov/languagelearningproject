export function initPrepositionDetective(language, elements) {
    let challenges = [];
    let currentChallengeIndex = -1;
    let score = 0;

    async function loadGameData() {
        try {
            const response = await fetch(`data/french_a2_preposition_detective.json`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            challenges = data.challenges;
            elements.deckTitle.textContent = data.title;
            loadNextChallenge();
        } catch (error) {
            console.error('Failed to load preposition detective data:', error);
            elements.clueEl.textContent = 'Failed to load game data. Please try refreshing.';
        }
    }

    function loadNextChallenge() {
        currentChallengeIndex++;
        if (currentChallengeIndex >= challenges.length) {
            elements.clueEl.textContent = "Congratulations! You've completed all the challenges.";
            elements.panelsContainerEl.innerHTML = '';
            elements.nextBtn.style.display = 'none';
            return;
        }

        const challenge = challenges[currentChallengeIndex];
        elements.clueEl.textContent = challenge.clue;
        elements.panelsContainerEl.innerHTML = '';
        elements.feedbackEl.textContent = '';
        elements.feedbackEl.className = 'feedback';
        elements.nextBtn.style.display = 'none';

        // Shuffle panels to randomize their order
        const shuffledPanels = [...challenge.panels].sort(() => Math.random() - 0.5);

        shuffledPanels.forEach(panelData => {
            const panel = document.createElement('div');
            panel.className = 'pd-panel';

            const img = document.createElement('img');
            img.src = panelData.image;
            img.alt = 'Comic panel option';

            panel.appendChild(img);

            panel.addEventListener('click', () => handlePanelClick(panel, panelData.isCorrect));
            elements.panelsContainerEl.appendChild(panel);
        });
    }

    function handlePanelClick(selectedPanel, isCorrect) {
        // Disable all panels after a selection is made
        const allPanels = elements.panelsContainerEl.querySelectorAll('.pd-panel');
        allPanels.forEach(panel => {
            panel.style.pointerEvents = 'none'; // Make them unclickable
        });

        if (isCorrect) {
            score++;
            elements.scoreEl.textContent = score;
            selectedPanel.classList.add('correct');
            elements.feedbackEl.textContent = 'Correct!';
            elements.feedbackEl.classList.add('correct');
        } else {
            selectedPanel.classList.add('incorrect');
            elements.feedbackEl.textContent = 'Not quite. Try the next one!';
            elements.feedbackEl.classList.add('incorrect');
            // Highlight the correct answer
            const correctPanelData = challenges[currentChallengeIndex].panels.find(p => p.isCorrect);
            const correctPanelImage = correctPanelData.image;
            allPanels.forEach(panel => {
                const img = panel.querySelector('img');
                if (img && img.src.endsWith(correctPanelImage)) {
                    panel.classList.add('correct');
                }
            });
        }
        elements.nextBtn.style.display = 'block';
    }

    elements.nextBtn.addEventListener('click', loadNextChallenge);

    loadGameData();
}
