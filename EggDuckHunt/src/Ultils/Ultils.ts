import { Duck, Position } from "../Types/types";
import { GAME_CONSTANTS,MOVEMENT_TYPES } from "../Constant/constant"; // Adjust the path as needed


export function getRandomMovementType(): Duck["movementType"] {
         return MOVEMENT_TYPES[Math.floor(Math.random() * MOVEMENT_TYPES.length)];
}

export function getRandomDirection(): { x: number, y: number } {
    return {
        x: Math.random() > 0.5 ? 1 : -1,
        y: Math.random() > 0.5 ? 0.5 : -0.5
    };
}

export function getRandomPosition(): Position {
    const { DUCK } = GAME_CONSTANTS;
    return {
        left: DUCK.MIN_LEFT + Math.random() * (DUCK.MAX_LEFT - DUCK.MIN_LEFT),
        top: DUCK.MIN_TOP + Math.random() * (DUCK.MAX_TOP - DUCK.MIN_TOP)
    };
}
