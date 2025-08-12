import re
from playwright.sync_api import sync_playwright, expect, Page

def verify_all_features(page: Page):
    print("Starting final verification...")
    page.goto("http://localhost:8000")

    # 1. Test Memory Match accessibility
    print("Testing Memory Match keyboard accessibility...")
    expect(page.locator("#memory-match-container")).to_be_visible()

    # Find the 'chat' card and focus it
    word_card = page.locator('.card-back:has-text("chat")').locator("..")
    word_card.focus()
    word_card.press("Enter") # Flip with keyboard

    # Find the corresponding image card and flip it
    word_card_id = word_card.get_attribute("data-id")
    image_card = page.locator(f'[data-id="{word_card_id}"][data-type="image"]')
    image_card.focus()
    image_card.press(" ") # Flip with spacebar

    # Assert that it's a match
    expect(page.locator("#matches-count")).to_have_text("1")
    print("Memory Match keyboard test passed.")

    # 2. Test Cloze Race
    print("Testing Cloze Race...")
    page.locator("#select-cloze-race").click()
    expect(page.locator("#cloze-race-container")).to_be_visible()
    page.locator("#cloze-next-btn").click() # Start game
    page.locator('button:has-text("suis")').click()
    expect(page.locator("#cloze-score")).to_have_text("1")
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
