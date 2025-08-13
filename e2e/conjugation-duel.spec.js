const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('Conjugation Duel Game', () => {
  let verbsData;

  test.beforeAll(() => {
    const dataPath = path.join(__dirname, '..', 'data', 'french_a2', 'verbs.json');
    verbsData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  });

  test('player can win a round against the AI', async ({ page }) => {
    await page.goto('http://localhost:8080');

    // Select the Conjugation Duel game
    await page.click('#select-conjugation-duel');

    // Wait for the game to be active
    await expect(page.locator('#conjugation-duel-container')).toHaveClass(/active/);

    // The game loads the first challenge automatically. Wait for the prompt elements to be visible.
    await page.waitForSelector('#cd-verb', { state: 'visible' });

    // Get the challenge details from the UI
    const verbInfinitive = await page.textContent('#cd-verb');
    const subject = await page.textContent('#cd-subject');
    const tense = await page.textContent('#cd-tense');

    // Find the correct answer from the loaded verb data
    const verbInfo = verbsData.verbs.find(v => v.infinitive === verbInfinitive);
    const correctAnswer = verbInfo.conjugations[tense][subject];

    // Type the correct answer quickly
    await page.locator('#cd-player-input').fill(correctAnswer);

    // The game automatically checks the answer on input, so we check for the feedback
    await expect(page.locator('#cd-feedback')).toContainText('Correct!');

    // Check if player score has increased
    await expect(page.locator('#cd-player-score')).toHaveText('1');

    // Check if opponent score is still 0
    await expect(page.locator('#cd-opponent-score')).toHaveText('0');

    // Take a screenshot to verify the UI
    await page.screenshot({ path: 'e2e/screenshots/conjugation-duel-win.png' });

    // Check that a new round has started
    await page.waitForTimeout(1500); // Wait for the next round delay
    const newVerbInfinitive = await page.textContent('#cd-verb');
    expect(newVerbInfinitive).not.toBe(verbInfinitive);
  });
});
