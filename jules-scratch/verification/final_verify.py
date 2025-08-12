import re
from playwright.sync_api import sync_playwright, expect, Page

def verify_all_features(page: Page):
    print("Starting final verification...")
    page.goto("http://localhost:8000")

    # 1. Test Memory Match with Images
    print("Testing Memory Match...")
    expect(page.locator("#memory-match-container")).to_be_visible()
    word_card = page.locator('.card-back:has-text("chat")').locator("..")
    word_card_id = word_card.get_attribute("data-id")
    image_card = page.locator(f'[data-id="{word_card_id}"][data-type="image"]')
    word_card.click()
    image_card.click()
    expect(page.locator("#matches-count")).to_have_text("1")
    print("Memory Match test passed.")

    # 2. Test Cloze Race (and the bug fix)
    print("Testing Cloze Race...")
    page.locator("#select-cloze-race").click()
    expect(page.locator("#cloze-race-container")).to_be_visible()
    page.locator("#cloze-next-btn").click() # Start game

    # Question 1
    expect(page.locator("#cloze-sentence")).to_contain_text("Je ______ un étudiant.")
    page.locator('button:has-text("suis")').click()
    expect(page.locator("#cloze-score")).to_have_text("1")
    page.locator("#cloze-next-btn").click() # Next question

    # Question 2 - Using a more specific selector
    expect(page.locator("#cloze-sentence")).to_contain_text("Elle aime ______ chocolat.")
    page.get_by_role("button", name="le", exact=True).click()
    expect(page.locator("#cloze-score")).to_have_text("2")
    print("Cloze Race test passed.")

    # 3. Final Screenshot
    page.screenshot(path="jules-scratch/verification/verification.png")
    print("Screenshot saved.")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            verify_all_features(page)
        finally:
            browser.close()

if __name__ == "__main__":
    main()
