// import { Duck, Basket } from './Types/types';
// import { incrementEggAndCoin } from './Ultils/storage';

// // Duck definitions with movement types
// export const ducks: Duck[] = [];
// export const baskets: Basket[] = [];

// export function initializeBaskets(): void {
//     // Xóa rổ hiện có nếu có
//     baskets.length = 0;
    
//     // Tạo 3 rổ với vị trí cố định
//     baskets.push({
//         id: 'basket1', left: 40, top: 72,
//         position: { left: 40, top: 72 }  // Fixed: Initialize position object
//     });
//     baskets.push({
//         id: 'basket2', left: 50, top: 72,
//         position: { left: 50, top: 72 }  // Fixed: Initialize position object
//     });
//     baskets.push({
//         id: 'basket3', left: 60, top: 72,
//         position: { left: 60, top: 72 }  // Fixed: Initialize position object
//     });


//     // Tạo phần tử DOM cho mỗi rổ
//     baskets.forEach(basket => {
//         const basketElement = document.createElement('img');
//         basketElement.id = basket.id;
//         basketElement.classList.add('basket');
//         basketElement.src = "../assets/rotrung.png"; // Đường dẫn đến hình ảnh rổ
//         basketElement.style.position = 'absolute';
//         basketElement.style.width = '100px'; // Điều chỉnh kích thước phù hợp
//         basketElement.style.left = `${basket.left}%`;
//         basketElement.style.top = `${basket.top}%`;
//         basketElement.style.zIndex = '1'; // Đảm bảo rổ nằm dưới vịt
        
//         document.body.appendChild(basketElement);
//     });
// }

// // Function to dynamically update ducks based on duckCount
// export function updateDucksBasedOnCount(): void {
//     const duckCount = parseInt(localStorage.getItem('duckCount') || '3');
//     const currentDuckCount = ducks.length;
    
//     // Add more ducks if needed
//     if (duckCount > currentDuckCount) {
//         for (let i = currentDuckCount; i < duckCount; i++) {
//             // Create a new duck with randomized properties
//             const newDuck: Duck = {
//                 id: `duck${i + 1}`,
//                 size: 100 ,
//                 position: {
//                     left: 10 + Math.random() * 70,
//                     top: 30 + Math.random() * 55
//                 },
                
//                 direction: {
//                     x: Math.random() > 0.5 ? 1 : -1,
//                     y: Math.random() > 0.5 ? 0.5 : -0.5
//                 },
//                 speed: 0.2 + Math.random() * 0.2,
//                 frame: 1,

//                 moving: true,
//                 inPond: false,
//                 movementType: ["linear", "circular", "zigzag", "random"][Math.floor(Math.random() * 4)] as Duck["movementType"],
//                 autoMoveInterval: undefined,
//                 selectedBasket: null  // Fixed: Initialize as null instead of Math
//             };
            
//             // Add movement-specific properties
//             if (newDuck.movementType === "circular") {
//                 newDuck.centerPoint = { left: newDuck.position.left, top: newDuck.position.top };
//                 newDuck.radius = 10 + Math.random() * 10;
//                 newDuck.pathProgress = Math.random() * Math.PI * 2;
//             } else if (newDuck.movementType === "zigzag") {
//                 newDuck.zigzagAmplitude = 3 + Math.random() * 5;
//             }
            
//             // Add to ducks array
//             ducks.push(newDuck);
            
//             // Create DOM element for the new duck
//             const duckElement = document.createElement('img');
//             duckElement.id = newDuck.id;
//             duckElement.classList.add('duck');
//             duckElement.src = `../assets/duck/right-left/a${newDuck.direction.x > 0 ? 1 : 3}.png`;
//             duckElement.style.position = 'absolute';
//             duckElement.style.width = '100px';
//             duckElement.style.left = `${newDuck.position.left}%`;
//             duckElement.style.top = `${newDuck.position.top}%`;
//             duckElement.style.cursor = 'pointer';
            
//             // Add to DOM
//             document.body.appendChild(duckElement);
//         }
//     }
//     // Remove ducks if there are too many (not likely in your game, but added for completeness)
//     else if (duckCount < currentDuckCount && duckCount >= 3) {
//         // Remove excess ducks (keeping at least the original 3)
//         for (let i = currentDuckCount - 1; i >= duckCount; i--) {
//             const duckToRemove = ducks.pop();
//             if (duckToRemove) {
//                 const element = document.getElementById(duckToRemove.id);
//                 if (element) element.remove();
                
//                 // Clear any timers for the removed duck
//                 if (duckToRemove.autoMoveInterval) clearTimeout(duckToRemove.autoMoveInterval);
//                 if (duckToRemove.relaxTimer1) clearTimeout(duckToRemove.relaxTimer1);
//                 if (duckToRemove.relaxTimer2) clearTimeout(duckToRemove.relaxTimer2);
//             }
//         }
//     }
// }

// export function moveDuck(duck: Duck): void {
//     if (!duck.moving) return;
//     const duckElement = document.getElementById(duck.id) as HTMLImageElement;
//     if (!duckElement) return;

//     // Calculate new position based on movement type
//     switch (duck.movementType) {
//         case "linear":
//             // Simple linear movement (left-right)
//             duck.position.left += duck.direction.x * duck.speed;
//             duck.position.top += duck.direction.y * duck.speed;
            
//             // Bounce off edges
//             if (duck.position.left >= 80 || duck.position.left <= 10) {
//                 duck.direction.x *= -1;
//             }
//             if (duck.position.top >= 85 || duck.position.top <= 30) {
//                 duck.direction.y *= -1;
//             }
//             break;   
//         case "circular":
//             // Circular movement
//             if (duck.pathProgress === undefined || duck.centerPoint === undefined || duck.radius === undefined) {
//                 // Default values if not defined
//                 duck.pathProgress = 0;
//                 duck.centerPoint = { left: 50, top: 50 };
//                 duck.radius = 15;
//             }
            
//             duck.pathProgress += duck.speed * 0.05;
//             duck.position.left = duck.centerPoint.left + Math.cos(duck.pathProgress) * duck.radius;
//             duck.position.top = duck.centerPoint.top + Math.sin(duck.pathProgress) * duck.radius;
            
//             // Update direction based on movement
//             duck.direction.x = Math.cos(duck.pathProgress + Math.PI/2) > 0 ? 1 : -1;
//             break;
            
//         case "zigzag":
//             // Zigzag movement
//             duck.position.left += duck.direction.x * duck.speed;
            
//             if (duck.zigzagAmplitude === undefined) {
//                 duck.zigzagAmplitude = 5;
//             }
            
//             // Create zigzag pattern using sine wave
//             duck.position.top = duck.position.top + Math.sin(duck.position.left * 0.1) * duck.speed * 0.5;
            
//             // Bounce off horizontal edges
//             if (duck.position.left >= 80 || duck.position.left <= 10) {
//                 duck.direction.x *= -1;
//             }
            
//             // Keep within vertical bounds
//             if (duck.position.top >= 85) duck.position.top = 85;
//             if (duck.position.top <= 30) duck.position.top = 30;
//             break;
            
//         case "random":
//             // Random direction changes
//             if (Math.random() < 0.02) {
//                 // 2% chance to change direction each frame
//                 duck.direction.x = Math.random() > 0.5 ? 1 : -1;
//                 duck.direction.y = Math.random() > 0.5 ? 0.5 : -0.5;
//             }
            
//             duck.position.left += duck.direction.x * duck.speed;
//             duck.position.top += duck.direction.y * duck.speed;
            
//             // Bounce off edges
//             if (duck.position.left >= 80 || duck.position.left <= 10) {
//                 duck.direction.x *= -1;
//             }
//             if (duck.position.top >= 85 || duck.position.top <= 30) {
//                 duck.direction.y *= -1;
//             }
//             break;
//     }

//     // Update duck position on screen
//     duckElement.style.left = `${duck.position.left}%`;
//     duckElement.style.top = `${duck.position.top}%`;
    
//     // Check if duck is in pond
//     const pondLeft = 0, pondRight = 100, pondTop = 70, pondBottom = 100;
//     const isInPond = duck.position.left >= pondLeft && 
//                      duck.position.left <= pondRight && 
//                      duck.position.top >= pondTop && 
//                      duck.position.top <= pondBottom;

//     if (isInPond && !duck.inPond) {
//         duck.inPond = true;
//         duckElement.src = duck.direction.x === 1 ? "../assets/duck/relax/a3.png" : "../assets/duck/relax/a1.png";
//         duck.relaxTimer1 = setTimeout(() => {
//             if (duck.inPond) {
//                 duckElement.src = duck.direction.x === 1 ? "../assets/duck/relax/a5.png" : "../assets/duck/relax/a7.png";
//                 duck.relaxTimer2 = setTimeout(() => {
//                     if (duck.inPond) {
//                         duckElement.src = duck.direction.x === 1 ? "../assets/duck/relax/a6.png" : "../assets/duck/relax/a8.png";
//                     }
//                 }, 5000);
//             }
//         }, 2000);
//     } else if (!isInPond && duck.inPond) {
//         duck.inPond = false;
//         if (duck.relaxTimer1) clearTimeout(duck.relaxTimer1);
//         if (duck.relaxTimer2) clearTimeout(duck.relaxTimer2);
//     }
    
//     // Update duck sprite based on movement direction (only when not in pond)
//     if (!isInPond) {
//         duckElement.src = `../assets/duck/right-left/a${duck.frame + (duck.direction.x === -1 ? 2 : 0)}.png`;
//         duck.frame = duck.frame === 1 ? 2 : 1;
//     }
// }

// export function moveDuckToBasket(duck: Duck): void {
//     if (!duck.moving) return;
//     duck.moving = false;
//     const duckElement = document.getElementById(duck.id) as HTMLImageElement;
//     if (!duckElement) return;
    
//     duck.originalPosition = { left: duck.position.left, top: duck.position.top };
//     const selectedBasket = baskets[Math.floor(Math.random() * baskets.length)];
//     duck.selectedBasket = selectedBasket;
    
//     // Fixed: Use the basket's position correctly
//     const targetLeft = selectedBasket.position.left;
//     const targetTop = selectedBasket.position.top - 2;
    
//     // Determine path type randomly for basket approach
//     const pathType = Math.random() < 0.5 ? "direct" : "arc";
    
//     let startTime = Date.now();
//     const duration = 15000; // 15 seconds to complete the movement
//     const startPosition = { left: duck.position.left, top: duck.position.top };
    
//     // For arc movement, calculate a control point
//     const controlPoint = {
//         left: (startPosition.left + targetLeft) / 2 + (Math.random() * 20 - 10),
//         top: Math.min(startPosition.top, targetTop) - 10 - Math.random() * 10
//     };
    
//     // Update duck sprite based on initial horizontal direction
//     const initialDirection = targetLeft > duck.position.left ? 1 : -1;
//     duckElement.src = `../assets/duck/right-left/a${initialDirection > 0 ? 1 : 3}.png`;
    
//     let moveInterval = setInterval(() => {
//         const elapsedTime = Date.now() - startTime;
//         const progress = Math.min(elapsedTime / duration, 1);
        
//         if (progress >= 1) {
//             // Movement complete
//             clearInterval(moveInterval);
            
//             // Set duck to final position
//             duck.position.left = targetLeft;
//             duck.position.top = targetTop;
//             duckElement.style.left = `${duck.position.left}%`;
//             duckElement.style.top = `${duck.position.top}%`;
//             const duckSound = document.getElementById("duckSound") as HTMLAudioElement;
//             if(duckSound){
//                 duckSound.play().catch(() => console.log("Tự động phát bị chặn, yêu cầu thao tác từ người dùng."));
//             }
//             layEgg(duck, duckElement);
//             return;
//         }
        
//         // Calculate new position based on path type
//         if (pathType === "direct") {
//             // Linear interpolation for direct path
//             duck.position.left = startPosition.left + (targetLeft - startPosition.left) * progress;
//             duck.position.top = startPosition.top + (targetTop - startPosition.top) * progress;
//         } else {
//             // Quadratic Bezier curve for arc path
//             const t = progress;
//             const mt = 1 - t;
            
//             duck.position.left = mt * mt * startPosition.left + 2 * mt * t * controlPoint.left + t * t * targetLeft;
//             duck.position.top = mt * mt * startPosition.top + 2 * mt * t * controlPoint.top + t * t * targetTop;
//         }
        
//         // Update duck position
//         duckElement.style.left = `${duck.position.left}%`;
//         duckElement.style.top = `${duck.position.top}%`;
        
//         // Update duck sprite based on horizontal direction
//         const currentDirection = duck.position.left > startPosition.left ? 1 : -1;
//         duckElement.src = `../assets/duck/right-left/a${duck.frame + (currentDirection === -1 ? 2 : 0)}.png`;
//         duck.frame = duck.frame === 1 ? 2 : 1;
        
//     }, 100);
// }

// // Function to setup independent egg-laying for each duck
// export function setuprandomlayegg(): void {
//    ducks.forEach(duck => {
//     // Clear any existing interval for this duck
//     if (duck.autoMoveInterval) {
//         clearTimeout(duck.autoMoveInterval);
//     }
    
//     // Setup individual duck egg-laying schedule
//     scheduleEggLayingForDuck(duck);
//   });
// }

// // Function to schedule egg-laying for a specific duck
// function scheduleEggLayingForDuck(duck: Duck): void {
//     const minTime = 20000; // Minimum time between egg laying (20 seconds)
//     const maxTime = 60000; // Maximum time between egg laying (60 seconds)
    
//     // Calculate a random time for this specific duck - each duck gets a different random time
//     const nextEggTime = minTime + Math.random() * (maxTime - minTime);
    
//     // Schedule the egg-laying event for this duck
//     duck.autoMoveInterval = setTimeout(() => {
//         if (duck.moving) {
//             // Make the duck go to the basket
//             moveDuckToBasket(duck);
            
//             // After the duck returns from laying (approx 15s for movement + 1s delay + 2s laying + 5s return = ~23s)
//             // Schedule the next egg-laying for this duck
//             setTimeout(() => {
//                 scheduleEggLayingForDuck(duck);
//             }, 25000);
//         } else {
//             // If duck is busy, try again in a bit
//             setTimeout(() => {
//                 scheduleEggLayingForDuck(duck);
//             }, 5000);
//         }
//     }, nextEggTime);
// }

// function layEgg(duck: Duck, duckElement: HTMLImageElement): void {
//     setTimeout(() => {
//         const egg = document.createElement("img");
//         egg.src = "../assets/duck/egg.png";
//         egg.classList.add("egg-basket");
//         egg.style.position = "absolute";
//         egg.style.width = "30px";
//         egg.style.zIndex = "2"; 
//         if(duck.selectedBasket && duck.selectedBasket.position){
//             egg.style.left = `${duck.position.left + 1.5}%`;  // Added 10px to the right
//             egg.style.top = `${duck.position.top + 3}%`;  // Added 10px down
//         } else {
//             // Fallback position if no basket is selected
//             egg.style.left = `${duck.position.left - 1.55 }%`;  // Added 10px to the right
//             egg.style.top = `${duck.position.top + 1.55 }%`;    // Added 10px down
//         }
        
//         egg.style.cursor = "pointer"; // Add pointer cursor to indicate clickability
        
//         // Add click event listener to the egg
//         egg.addEventListener('click', () => {
//             // Increment egg and coin count
//             incrementEggAndCoin();
            
//             // Remove the egg from the DOM
//             document.body.removeChild(egg);
//         });
        
//         document.body.appendChild(egg);      
//         setTimeout(() => returnToOriginal(duck, duckElement), 2000);
//     }, 1000);
// }

// function returnToOriginal(duck: Duck, duckElement: HTMLImageElement): void {
//     if (!duck.originalPosition) return;
    
//     // Create a path back to the original position
//     const startPosition = { left: duck.position.left, top: duck.position.top };
//     const targetPosition = duck.originalPosition;
    
//     let startTime = Date.now();
//     const duration = 5000; // 5 seconds to return
    
//     const returnInterval = setInterval(() => {
//         const elapsedTime = Date.now() - startTime;
//         const progress = Math.min(elapsedTime / duration, 1);
        
//         if (progress >= 1) {
//             clearInterval(returnInterval);
//             duck.position.left = targetPosition.left;
//             duck.position.top = targetPosition.top;
//             duck.moving = true;
//             return;
//         }
        
//         // Linear interpolation for return journey
//         duck.position.left = startPosition.left + (targetPosition.left - startPosition.left) * progress;
//         duck.position.top = startPosition.top + (targetPosition.top - startPosition.top) * progress;
        
//         duckElement.style.left = `${duck.position.left}%`;
//         duckElement.style.top = `${duck.position.top}%`;
        
//         // Update duck sprite based on horizontal direction
//         const currentDirection = duck.position.left > startPosition.left ? 1 : -1;
//         duckElement.src = `../assets/duck/right-left/a${duck.frame + (currentDirection === -1 ? 2 : 0)}.png`;
//         duck.frame = duck.frame === 1 ? 2 : 1;
//     }, 50);
// }

// export function changeDuckMovementType(duckId: string, newMovementType: Duck["movementType"]): void {
//     const duck = ducks.find(d => d.id === duckId);
//     if (!duck) return;
    
//     duck.movementType = newMovementType;
    
//     // Reset any movement-specific properties
//     if (newMovementType === "circular") {
//         duck.centerPoint = { 
//             left: duck.position.left, 
//             top: duck.position.top 
//         };
//         duck.radius = 15;
//         duck.pathProgress = 0;
//     }
// }