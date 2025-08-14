const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('Cloze Race Game', () => {
  let gameData;

  test.beforeAll(() => {
    const dataPath = path.join(__dirname, '..', 'data', 'french_a2_cloze.json');
    gameData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  });

  test('player can start the game and answer a question correctly', async ({ page }) => {
    await page.goto('http://localhost:8080');

    // Select the Cloze Race game
    await page.click('#select-cloze-race');
    await expect(page.locator('#cloze-race-container')).toHaveClass(/active/);

    // Click the start button
    await page.click('#cloze-next-btn');

    // The first question should be displayed
    const firstQuestion = gameData.cloze_sentences[0];
    const sentenceText = firstQuestion.sentence_template.replace('___', '______');
    await expect(page.locator('#cloze-sentence')).toHaveText(sentenceText);

    // Find the correct answer button and click it
    const correctButton = page.locator('.game-container.active button', { hasText: firstQuestion.correct_answer });
    await correctButton.click();

    // The score should be updated
    await expect(page.locator('#cloze-score')).toHaveText('1');

    // The "Next Question" button should be visible
    await expect(page.locator('#cloze-next-btn')).toBeVisible();
    await expect(page.locator('#cloze-next-btn')).toHaveText('Next Question');

    await page.screenshot({ path: 'e2e/screenshots/cloze-race-correct.png' });
  });
});
