// Import necessary functions from other modules
import { initializeBaskets } from './Basket/baskets';
import { changeDuckMovementType, updateDucksBasedOnCount } from './DuckManager/duckManager';
import { moveDuck } from './State/duckMovement';
import { initializeGameStorage, updateCounters, incrementEggAndCoin } from './Ultils/storage';
import {ducks} from './DuckManager/duckManager';
import { moveDuckToBasket } from './Egg/eggLaying';
import { setupRandomEggLaying } from './Egg/eggScheduler';
// Execute when the HTML document has fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize game storage, ensuring saved data is loaded
    initializeGameStorage();

    // Update UI counters for eggs and coins
    updateCounters();

    // Adjust duck-related elements based on current count
    updateDucksBasedOnCount();

    // Move each duck at an interval of 150 milliseconds
    ducks.forEach(duck => setInterval(() => moveDuck(duck), 150));

    // Initialize background music and duck sounds
    initializeAudio();

    // Randomly generate eggs from ducks
    setupRandomEggLaying();

    // Set up baskets for egg collection
    initializeBaskets();
});

export { 
    moveDuck, 
    moveDuckToBasket,
    changeDuckMovementType,
    setupRandomEggLaying as setuprandomlayegg
};

/**
 * Initializes and plays background music with volume control.
 * If autoplay is blocked, logs a message.
 */
function initializeAudio(): void {
    const bgMusic = document.getElementById("bgMusic") as HTMLAudioElement;
    if (bgMusic) {
        bgMusic.volume = 0.3;
        bgMusic.play().catch(() => console.log("Autoplay blocked, user interaction required."));
    }
}

