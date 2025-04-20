// 📌 Get DOM elements (Retrieve references to UI elements)
const eggCountchangeEl = document.getElementById('eggCount') as HTMLElement;
const coinCountchangeEl = document.getElementById('coinCount') as HTMLElement;

const exchangeBtn = document.getElementById('exchangeBtn') as HTMLButtonElement;
const duckcountcoinEl = document.getElementById('duckcoinCount') as HTMLElement;
const exchangeduckBtn = document.getElementById('exchangeduckBtn') as HTMLButtonElement;
const duckCountEl = document.getElementById('duckCount') as HTMLElement;
// 📌 Set up constants for exchange rates
const EGGS_PER_COIN: number = 10;  // 10 eggs = 1 coin
const COIN_PER_DUCK: number = 10;  // 10 coins = 1 duck

/**
 * 📌 Updates the UI display based on stored values.
 */
function updateDisplay(): void {
    eggCountchangeEl.textContent = localStorage.getItem('eggCount') || '0';
    coinCountchangeEl.textContent = localStorage.getItem('coinCount') || '0';
    duckcountcoinEl.textContent = localStorage.getItem('coinCount') || '0';
    duckCountEl.textContent = localStorage.getItem('duckCount') || '0';

    const coinCountchange = parseInt(coinCountchangeEl.textContent || '0');
    exchangeduckBtn.disabled = coinCountchange < COIN_PER_DUCK;  // Disable button if not enough coins

    const eggCountchange = parseInt(eggCountchangeEl.textContent || '0');
    exchangeBtn.disabled = eggCountchange < EGGS_PER_COIN; // Disable button if not enough eggs
}

/**
 * 📌 Converts eggs to coins when the exchange button is clicked.
 */
exchangeBtn.addEventListener('click', () => {
    let eggCount = parseInt(localStorage.getItem('eggCount') || '0');
    let coinCount = parseInt(localStorage.getItem('coinCount') || '0');

    if (eggCount >= EGGS_PER_COIN) {
        const coinsToAdd: number = Math.floor(eggCount / EGGS_PER_COIN); // Convert eggs to coins
        coinCount += coinsToAdd;
        eggCount %= EGGS_PER_COIN; // Remaining eggs

        localStorage.setItem('eggCount', eggCount.toString());
        localStorage.setItem('coinCount', coinCount.toString());
        updateDisplay(); // Refresh UI
    }
});

/**
 * 📌 Converts coins to ducks when the exchange button is clicked.
 */
exchangeduckBtn.addEventListener('click', () => {
    let coinCount = parseInt(localStorage.getItem('coinCount') || '0');
    let duckCount = parseInt(localStorage.getItem('duckCount') || '0');

    console.log("Before exchange:", { coinCount, duckCount });

    if (coinCount >= COIN_PER_DUCK) {
        coinCount -= COIN_PER_DUCK;
        duckCount += 1;

        localStorage.setItem('coinCount', coinCount.toString());
        localStorage.setItem('duckCount', duckCount.toString());
        updateDisplay(); // Refresh UI
    }

    console.log("After exchange:", { coinCount, duckCount });
});

/**
 * 📌 Automatically updates the UI every second.
 */
function autoUpdate() {
    setInterval(() => {
        updateDisplay();
    }, 1000);
}

// 📌 Initialize UI display on page load
updateDisplay();
autoUpdate();
// 📌 Get DOM elements (Retrieve references to UI elements)