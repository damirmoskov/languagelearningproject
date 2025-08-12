/**
 * Implements the SuperMemo 2 (SM-2) algorithm for spaced repetition.
 * @param {object} card - The card object to update. It should have `repetition`, `easeFactor`, and `interval` properties.
 * @param {number} quality - The user's quality rating for the recall (from 0 to 5).
 * @returns {object} The updated card object with new `repetition`, `easeFactor`, `interval`, and `dueDate`.
 */
export function sm2(card, quality) {
    if (quality < 0 || quality > 5) {
        throw new Error("Quality must be an integer between 0 and 5.");
    }

    let { repetition, easeFactor, interval } = card;

    // If the quality of the response is lower than 3, start repetitions for the item from the beginning.
    if (quality < 3) {
        repetition = 0;
        interval = 1; // Reset interval to 1 day.
    } else {
        // If the quality is 3 or higher, update the ease factor and calculate the new interval.
        repetition += 1;

        // Update the ease factor.
        easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
        if (easeFactor < 1.3) {
            easeFactor = 1.3; // The ease factor should not be less than 1.3.
        }

        // Set the new interval.
        if (repetition === 1) {
            interval = 1;
        } else if (repetition === 2) {
            interval = 6;
        } else {
            interval = Math.round(interval * easeFactor);
        }
    }

    // Calculate the next due date.
    const today = new Date();
    const dueDate = new Date(today.setDate(today.getDate() + interval));

    return {
        ...card,
        repetition,
        easeFactor,
        interval,
        dueDate: dueDate.toISOString().split('T')[0], // Store date as YYYY-MM-DD
    };
}

/**
 * Creates a new card with default SRS values.
 * @param {string} id - The unique identifier for the card.
 * @returns {object} A new card object.
 */
export function createNewCard(id) {
    return {
        id,
        repetition: 0,
        easeFactor: 2.5,
        interval: 0,
        dueDate: null,
    };
}
