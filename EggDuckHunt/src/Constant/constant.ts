import { Duck } from "../Types/types";

export const GAME_CONSTANTS = {
    POND: {
        LEFT: 0,
        RIGHT: 100,
        TOP: 70,
        BOTTOM: 100
    },
    MOVEMENT: {
        MIN_EGG_TIME: 20000,
        MAX_EGG_TIME: 60000,
        EGG_LAYING_DURATION: 15000,
        RETURN_DURATION: 5000
    },
    DUCK: {
        MIN_LEFT: 10,
        MAX_LEFT: 80,
        MIN_TOP: 30,
        MAX_TOP: 85,
        DEFAULT_COUNT: 3
    }
};

export const MOVEMENT_TYPES: Duck["movementType"][] = ["linear", "circular", "zigzag", "random"];

