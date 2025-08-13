const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

test.describe('Preposition Detective Game', () => {
  let gameData;

  test.beforeAll(() => {
    const dataPath = path.join(__dirname, '..', 'data', 'french_a2_preposition_detective.json');
    gameData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  });

  test('player can select the correct panel and score a point', async ({ page }) => {
    await page.goto('http://localhost:8080');

    // Select the Preposition Detective game
    await page.click('#select-preposition-detective');

    // Wait for the game to be active and the first challenge to load
    await expect(page.locator('#preposition-detective-container')).toHaveClass(/active/);
    await page.waitForSelector('#pd-clue:not(:empty)');

    // Get the first challenge from our data
    const firstChallenge = gameData.challenges[0];
    const correctPanel = firstChallenge.panels.find(p => p.isCorrect);
    const correctImageSrc = correctPanel.image;

    // Find the correct panel on the page and click it
    const correctPanelElement = page.locator(`.pd-panel img[src$="${correctImageSrc}"]`);
    await correctPanelElement.click();

    // Assert that feedback is correct
    await expect(page.locator('#pd-feedback')).toContainText('Correct!');
    await expect(page.locator('#pd-feedback')).toHaveClass(/correct/);

    // Assert that score has increased to 1
    await expect(page.locator('#pd-score')).toHaveText('1');

    // Assert that the "Next" button is visible
    await expect(page.locator('#pd-next-btn')).toBeVisible();

    // Take a screenshot
    await page.screenshot({ path: 'e2e/screenshots/preposition-detective-correct.png' });

    // Click next and verify a new clue appears
    await page.click('#pd-next-btn');
    const secondChallenge = gameData.challenges[1];
    await expect(page.locator('#pd-clue')).toHaveText(secondChallenge.clue);
  });
});
