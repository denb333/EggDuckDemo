// Game counters: Stores the number of eggs and coins
let eggCount: number = 0;
let coinCount: number = 0;

/**
 * Initializes game storage by checking if values exist in localStorage.
 * If not, it sets default values to 0.
 */
export function initializeGameStorage(): void {
    if (localStorage.getItem('eggCount') === null) {
        localStorage.setItem('eggCount', '0'); // Set default egg count
    }
    if (localStorage.getItem('coinCount') === null) {
        localStorage.setItem('coinCount', '0'); // Set default coin count
    }
    
    // Retrieve stored values from localStorage and update counters
    eggCount = parseInt(localStorage.getItem('eggCount') || '0');
    coinCount = parseInt(localStorage.getItem('coinCount') || '0');
}

/**
 * Increments the egg count, updates localStorage, and refreshes the UI.
 */
export function incrementEggAndCoin(): void {
    eggCount++; // Increase egg count

    // Save updated count to localStorage
    localStorage.setItem('eggCount', eggCount.toString());

    // Update the displayed counters on the webpage
    updateCounters();
}

/**
 * Updates the displayed counters for eggs and coins in the UI.
 */
export function updateCounters(): void {
    const eggCountElement = document.querySelector("#eggCounter span") as HTMLElement;
    const coinCountElement = document.querySelector("#coinCounter span") as HTMLElement;
    
    // Update the displayed text values with current counts
    eggCountElement.innerText = eggCount.toString();
    coinCountElement.innerText = coinCount.toString();
}

// Export variables for use in other modules
export { eggCount, coinCount };
