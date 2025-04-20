/**
 * Waits until the document is fully loaded, then sets up the bag popup toggle functionality.
 */
document.addEventListener("DOMContentLoaded", () => {
    const bagIcon = document.querySelector(".icon-bag") as HTMLDivElement;
    const bagPopup = document.getElementById("bagPopup") as HTMLDivElement;

    if (bagIcon && bagPopup) {
        bagIcon.addEventListener("click", (event) => {
            // Toggle the visibility of the bag popup
            event.stopPropagation();
            bagPopup.style.display = bagPopup.style.display === "none" || bagPopup.style.display === "" ? "block" : "none";
        });
        bagPopup.addEventListener("click", (event) => {
            event.stopPropagation();
          });
    }
    document.addEventListener("click", () => {
        if(bagPopup.style.display === "block") {
            bagPopup.style.display = "none"; // Hide the popup when clicking outside
        }
    });
    // Initialize the bag popup to be hidden on load

});

/**
 * Waits until the document is fully loaded, then sets up a click event for each duck.
 */
document.addEventListener("DOMContentLoaded", () => {
    const ducks = document.querySelectorAll(".duck"); // Select all elements with class "duck"

    ducks.forEach((duck) => {
        duck.addEventListener("click", (event) => {
            const duckId = (event.target as HTMLElement).id; // Get the clicked duck's ID
            const duckName = `Duck ${duckId.replace("duck", "")}`; // Format the duck name
            const nextEggTime = getNextEggTime(duckId); // Get the time until the next egg
            // Display the duck's info
            showDuckInfo(event, duckName, nextEggTime);
        });
    });
});

/**
 * Generates a random time between 5 and 15 seconds for the next egg drop.
 * @param duckId - The ID of the duck (not used in this case, but can be useful for future logic).
 * @returns A string representing the time in seconds.
 */
function getNextEggTime(duckId: string): string {
    const timeLeft = Math.floor(Math.random() * 10) + 5; // Generate a random time (5-15 seconds)
    return `${timeLeft} seconds`;
}

/**
 * Displays a floating information box near the clicked duck showing its name and egg-laying time.
 * @param event - The mouse event that triggered the click.
 * @param name - The name of the duck.
 * @param time - The time remaining for the duck to lay an egg.
 */
function showDuckInfo(event: Event, name: string, time: string) {
    let infoBox = document.getElementById("duckInfo");

    if (!infoBox) {
        // Create the info box if it doesn't exist
        infoBox = document.createElement("div");
        infoBox.id = "duckInfo";
        infoBox.style.position = "absolute";
        infoBox.style.padding = "10px";
        infoBox.style.background = "rgba(0, 0, 0, 0.7)";
        infoBox.style.color = "#fff";
        infoBox.style.borderRadius = "5px";
        infoBox.style.fontSize = "16px";
        infoBox.style.pointerEvents = "none"; 
        document.body.appendChild(infoBox);
    }

    // Position the info box near the mouse click location
    const mouseEvent = event as MouseEvent;
    infoBox.style.top = `${mouseEvent.clientY + 10}px`;
    infoBox.style.left = `${mouseEvent.clientX + 10}px`;

    // Update the content of the info box
    infoBox.innerHTML = `<div>${name}</div><div>Next egg in: ${time}</div>`;

    // Remove the info box after 3 seconds
    setTimeout(() => {
        infoBox?.remove();
    }, 3000);
}
