import { Duck } from '../Types/types';
import { moveDuckToBasket } from './eggLaying';
import { GAME_CONSTANTS } from '../Constant/constant';
import { ducks } from '../DuckManager/duckManager';

export function setupRandomEggLaying(): void {
    ducks.forEach(scheduleEggLayingForDuck);
}

function scheduleEggLayingForDuck(duck: Duck): void {
    const { MIN_EGG_TIME, MAX_EGG_TIME } = GAME_CONSTANTS.MOVEMENT;
    
    // Clear any existing interval for this duck
    if (duck.autoMoveInterval) {
        clearTimeout(duck.autoMoveInterval);
    }
    
    // Calculate a random time for this specific duck
    const nextEggTime = MIN_EGG_TIME + Math.random() * (MAX_EGG_TIME - MIN_EGG_TIME);
    
    // Schedule the egg-laying event for this duck
    duck.autoMoveInterval = setTimeout(() => {
        if (duck.moving) {
            // Make the duck go to the basket
            moveDuckToBasket(duck);
            
            // After the duck returns from laying, schedule the next egg-laying
            setTimeout(() => {
                scheduleEggLayingForDuck(duck);
            }, 25000); // allow time for movement + laying + return
        } else {
            // If duck is busy, try again in a bit
            setTimeout(() => {
                scheduleEggLayingForDuck(duck);
            }, 5000);
        }
    }, nextEggTime);
}