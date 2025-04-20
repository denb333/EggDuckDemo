import { Duck, Basket, Position } from '../Types/types';
import { baskets } from '../Basket/baskets';
import { incrementEggAndCoin } from '../Ultils/storage';
import { GAME_CONSTANTS } from '../Constant/constant';

export function moveDuckToBasket(duck: Duck): void {
    if (!duck.moving) return;
    duck.moving = false;
    
    const duckElement = document.getElementById(duck.id) as HTMLImageElement;
    if (!duckElement) return;
    
    // Save original position
    duck.originalPosition = { left: duck.position.left, top: duck.position.top };
    
    // Select random basket
    const selectedBasket = baskets[Math.floor(Math.random() * baskets.length)];
    duck.selectedBasket = selectedBasket;
    
    // Set target position
    const targetLeft = selectedBasket.position.left;
    const targetTop = selectedBasket.position.top - 2;
    
    // Determine path type randomly for basket approach
    const pathType = Math.random() < 0.5 ? "direct" : "arc";
    
    animateDuckToBasket(duck, duckElement, targetLeft, targetTop, pathType);
}

function animateDuckToBasket(
    duck: Duck, 
    duckElement: HTMLImageElement, 
    targetLeft: number, 
    targetTop: number, 
    pathType: string
): void {
    const startTime = Date.now();
    const duration = GAME_CONSTANTS.MOVEMENT.EGG_LAYING_DURATION;
    const startPosition = { left: duck.position.left, top: duck.position.top };
    
    // For arc movement, calculate a control point
    const controlPoint = {
        left: (startPosition.left + targetLeft) / 2 + (Math.random() * 20 - 10),
        top: Math.min(startPosition.top, targetTop) - 10 - Math.random() * 10
    };
    
    // Update duck sprite based on initial horizontal direction
    const initialDirection = targetLeft > duck.position.left ? 1 : -1;
    duckElement.src = `../assets/duck/right-left/a${initialDirection > 0 ? 1 : 3}.png`;
    
    const moveInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        if (progress >= 1) {
            // Movement complete
            clearInterval(moveInterval);
            
            // Set duck to final position
            duck.position.left = targetLeft;
            duck.position.top = targetTop;
            duckElement.style.left = `${duck.position.left}%`;
            duckElement.style.top = `${duck.position.top}%`;
            
            playDuckSound();
            layEgg(duck, duckElement);
            return;
        }
        
        calculateMovementPosition(duck, startPosition, targetLeft, targetTop, controlPoint, pathType, progress);
        
        // Update duck position
        duckElement.style.left = `${duck.position.left}%`;
        duckElement.style.top = `${duck.position.top}%`;
        
        // Update duck sprite based on horizontal direction
        updateMovingDuckSprite(duck, duckElement, startPosition);
        
    }, 100);
}

function calculateMovementPosition(
    duck: Duck, 
    startPosition: Position, 
    targetLeft: number, 
    targetTop: number, 
    controlPoint: Position, 
    pathType: string, 
    progress: number
): void {
    if (pathType === "direct") {
        // Linear interpolation for direct path
        duck.position.left = startPosition.left + (targetLeft - startPosition.left) * progress;
        duck.position.top = startPosition.top + (targetTop - startPosition.top) * progress;
    } else {
        // Quadratic Bezier curve for arc path
        const t = progress;
        const mt = 1 - t;
        
        duck.position.left = mt * mt * startPosition.left + 2 * mt * t * controlPoint.left + t * t * targetLeft;
        duck.position.top = mt * mt * startPosition.top + 2 * mt * t * controlPoint.top + t * t * targetTop;
    }
}

function updateMovingDuckSprite(duck: Duck, duckElement: HTMLImageElement, startPosition: Position): void {
    const currentDirection = duck.position.left > startPosition.left ? 1 : -1;
    duckElement.src = `../assets/duck/right-left/a${duck.frame + (currentDirection === -1 ? 2 : 0)}.png`;
    duck.frame = duck.frame === 1 ? 2 : 1;
}

function playDuckSound(): void {
    const duckSound = document.getElementById("duckSound") as HTMLAudioElement;
    if(duckSound) {
        duckSound.play().catch(() => console.log("Tự động phát bị chặn, yêu cầu thao tác từ người dùng."));
    }
}

function layEgg(duck: Duck, duckElement: HTMLImageElement): void {
    setTimeout(() => {
        createEggElement(duck);
        setTimeout(() => returnToOriginal(duck, duckElement), 2000);
    }, 1000);
}

function createEggElement(duck: Duck): void {
    const egg = document.createElement("img");
    egg.src = "../assets/duck/egg.png";
    egg.classList.add("egg-basket");
    egg.style.position = "absolute";
    egg.style.width = "30px";
    egg.style.zIndex = "2"; 
    
    // Position the egg
    if(duck.selectedBasket && duck.selectedBasket.position) {
        egg.style.left = `${duck.position.left + 1.5}%`;
        egg.style.top = `${duck.position.top + 3}%`;
    } else {
        // Fallback position if no basket is selected
        egg.style.left = `${duck.position.left - 1.55}%`;
        egg.style.top = `${duck.position.top + 1.55}%`;
    }
    
    egg.style.cursor = "pointer";
    
    // Add click event listener to the egg
    egg.addEventListener('click', () => {
        // Increment egg and coin count
        incrementEggAndCoin();
        
        // Remove the egg from the DOM
        document.body.removeChild(egg);
    });
    
    document.body.appendChild(egg);
}

function returnToOriginal(duck: Duck, duckElement: HTMLImageElement): void {
    if (!duck.originalPosition) return;
    
    // Create a path back to the original position
    const startPosition = { left: duck.position.left, top: duck.position.top };
    const targetPosition = duck.originalPosition;
    
    const startTime = Date.now();
    const duration = GAME_CONSTANTS.MOVEMENT.RETURN_DURATION;
    
    const returnInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        if (progress >= 1) {
            clearInterval(returnInterval);
            duck.position.left = targetPosition.left;
            duck.position.top = targetPosition.top;
            duck.moving = true;
            return;
        }
        
        // Linear interpolation for return journey
        duck.position.left = startPosition.left + (targetPosition.left - startPosition.left) * progress;
        duck.position.top = startPosition.top + (targetPosition.top - startPosition.top) * progress;
        
        duckElement.style.left = `${duck.position.left}%`;
        duckElement.style.top = `${duck.position.top}%`;
        
        // Update duck sprite based on horizontal direction
        const currentDirection = duck.position.left > startPosition.left ? 1 : -1;
        duckElement.src = `../assets/duck/right-left/a${duck.frame + (currentDirection === -1 ? 2 : 0)}.png`;
        duck.frame = duck.frame === 1 ? 2 : 1;
    }, 50);
}