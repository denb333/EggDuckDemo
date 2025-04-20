// duckMovement.ts - Duck movement logic
import { Duck } from '../Types/types';
import { GAME_CONSTANTS } from '../Constant/constant';

export function moveDuck(duck: Duck): void {
    if (!duck.moving) return;
    
    const duckElement = document.getElementById(duck.id) as HTMLImageElement;
    if (!duckElement) return;

    // Calculate new position based on movement type
    moveByType(duck);

    // Update duck position on screen
    updateDuckPosition(duck, duckElement);
    
    // Check if duck is in pond
    handlePondDetection(duck, duckElement);
}

function moveByType(duck: Duck): void {
    const { DUCK } = GAME_CONSTANTS;
    
    switch (duck.movementType) {
        case "linear":
            moveLinear(duck);
            break;   
        case "circular":
            moveCircular(duck);
            break;
        case "zigzag":
            moveZigzag(duck);
            break;
        case "random":
            moveRandom(duck);
            break;
    }
    
    // Apply boundary constraints
    if (duck.position.left >= DUCK.MAX_LEFT) duck.position.left = DUCK.MAX_LEFT;
    if (duck.position.left <= DUCK.MIN_LEFT) duck.position.left = DUCK.MIN_LEFT;
    if (duck.position.top >= DUCK.MAX_TOP) duck.position.top = DUCK.MAX_TOP;
    if (duck.position.top <= DUCK.MIN_TOP) duck.position.top = DUCK.MIN_TOP;
}

function moveLinear(duck: Duck): void {
    const { DUCK } = GAME_CONSTANTS;
    
    duck.position.left += duck.direction.x * duck.speed;
    duck.position.top += duck.direction.y * duck.speed;
    
    // Bounce off edges
    if (duck.position.left >= DUCK.MAX_LEFT || duck.position.left <= DUCK.MIN_LEFT) {
        duck.direction.x *= -1;
    }
    if (duck.position.top >= DUCK.MAX_TOP || duck.position.top <= DUCK.MIN_TOP) {
        duck.direction.y *= -1;
    }
}

function moveCircular(duck: Duck): void {
    // Ensure required properties exist
    if (!duck.centerPoint || !duck.radius || duck.pathProgress === undefined) {
        duck.centerPoint = { left: duck.position.left, top: duck.position.top };
        duck.radius = 15;
        duck.pathProgress = 0;
    }
    
    duck.pathProgress += duck.speed * 0.05;
    duck.position.left = duck.centerPoint.left + Math.cos(duck.pathProgress) * duck.radius;
    duck.position.top = duck.centerPoint.top + Math.sin(duck.pathProgress) * duck.radius;
    
    // Update direction based on movement
    duck.direction.x = Math.cos(duck.pathProgress + Math.PI/2) > 0 ? 1 : -1;
}

function moveZigzag(duck: Duck): void {
    const { DUCK } = GAME_CONSTANTS;
    
    duck.position.left += duck.direction.x * duck.speed;
    
    if (duck.zigzagAmplitude === undefined) {
        duck.zigzagAmplitude = 5;
    }
    
    // Create zigzag pattern using sine wave
    duck.position.top = duck.position.top + Math.sin(duck.position.left * 0.1) * duck.speed * 0.5;
    
    // Bounce off horizontal edges
    if (duck.position.left >= DUCK.MAX_LEFT || duck.position.left <= DUCK.MIN_LEFT) {
        duck.direction.x *= -1;
    }
}

function moveRandom(duck: Duck): void {
    const { DUCK } = GAME_CONSTANTS;
    
    // Random direction changes
    if (Math.random() < 0.02) {
        // 2% chance to change direction each frame
        duck.direction.x = Math.random() > 0.5 ? 1 : -1;
        duck.direction.y = Math.random() > 0.5 ? 0.5 : -0.5;
    }
    
    duck.position.left += duck.direction.x * duck.speed;
    duck.position.top += duck.direction.y * duck.speed;
    
    // Bounce off edges
    if (duck.position.left >= DUCK.MAX_LEFT || duck.position.left <= DUCK.MIN_LEFT) {
        duck.direction.x *= -1;
    }
    if (duck.position.top >= DUCK.MAX_TOP || duck.position.top <= DUCK.MIN_TOP) {
        duck.direction.y *= -1;
    }
}

function updateDuckPosition(duck: Duck, duckElement: HTMLImageElement): void {
    duckElement.style.left = `${duck.position.left}%`;
    duckElement.style.top = `${duck.position.top}%`;
}

function handlePondDetection(duck: Duck, duckElement: HTMLImageElement): void {
    const { POND } = GAME_CONSTANTS;
    
    const isInPond = 
        duck.position.left >= POND.LEFT && 
        duck.position.left <= POND.RIGHT && 
        duck.position.top >= POND.TOP && 
        duck.position.top <= POND.BOTTOM;

    if (isInPond && !duck.inPond) {
        enterPond(duck, duckElement);
    } else if (!isInPond && duck.inPond) {
        exitPond(duck);
    }
    
    // Update duck sprite based on movement direction (only when not in pond)
    if (!isInPond) {
        updateDuckSprite(duck, duckElement);
    }
}

function enterPond(duck: Duck, duckElement: HTMLImageElement): void {
    duck.inPond = true;
    duckElement.src = duck.direction.x === 1 ? "../assets/duck/relax/a3.png" : "../assets/duck/relax/a1.png";
    
    duck.relaxTimer1 = setTimeout(() => {
        if (duck.inPond) {
            duckElement.src = duck.direction.x === 1 ? "../assets/duck/relax/a5.png" : "../assets/duck/relax/a7.png";
            duck.relaxTimer2 = setTimeout(() => {
                if (duck.inPond) {
                    duckElement.src = duck.direction.x === 1 ? "../assets/duck/relax/a6.png" : "../assets/duck/relax/a8.png";
                }
            }, 5000);
        }
    }, 2000);
}

function exitPond(duck: Duck): void {
    duck.inPond = false;
    if (duck.relaxTimer1) clearTimeout(duck.relaxTimer1);
    if (duck.relaxTimer2) clearTimeout(duck.relaxTimer2);
}

function updateDuckSprite(duck: Duck, duckElement: HTMLImageElement): void {
    duckElement.src = `../assets/duck/right-left/a${duck.frame + (duck.direction.x === -1 ? 2 : 0)}.png`;
    duck.frame = duck.frame === 1 ? 2 : 1;
}