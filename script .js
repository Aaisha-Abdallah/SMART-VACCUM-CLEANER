const vacuum =
document.getElementById("vacuum");

const dock = document.getElementById("dock");
let returningToDock = false;

let battery = 100;
const batteryDisplay  = document.getElementById("battery");

let direction = "right"

let speed = 4;
let x = 10;
let y = 10;
let dx = 2;
let dy = 2;
let Cleaning = false;

function startCleaning() {
    if (!Cleaning && battery > 0) {
        Cleaning = true;
        moveVacuum();
    }
}

function stopCleaning () {
   Cleaning = false;
}

function changeSpeed (value) {
    speed = Number (value)
}


function moveVacuum() {
    if (!Cleaning) return;

    // If battery is low, return to dock
    if (battery <= 20 && !returningToDock) {
        returningToDock = true;
    }

    if (returningToDock) {
        const dockRect = dock.getBoundingClientRect();
        const vacuumRect = vacuum.getBoundingClientRect();

        if (vacuumRect.left < dockRect.lef)  x += 1;
        if (vacuumRect.left > dockRect.left) x -= 1;
        if (vacuumRect.top < dockRect.top) y += 1;
        if (vacuumRect.top > dockRect.top) y -= 1;

        // If reached dock & charge 
        if (
            Math.abs(vacuumRect.left - dockRect.left) < 5 &&
            Math.abs(vacuumRect.top - dockRect.top) < 5
        ) {
            battery += 1;
            batteryDisplay.textContent = Math.floor(battery);
            if (battery >= 100) {
                returningToDock = false;
            }
            return;
        }

    }

    // Drain battery
    battery -=0.002;
    batteryDisplay.textContent = Math.max(0,Math.floor(battery));

    if (battery <= 0) {
        Cleaning = false;
        alert("Battery empty ! Vacuumstopped."); return;
    }

   // Cleaning pattern
if (direction === "right") {
    x += speed;

    if (x >= 470) {
        x = 470;
        y += 40;
        direction = "left";
    }

} else if (direction === "left") {
    x -= speed;

    if (x <= 0) {
        x = 0;
        y += 40;
        direction = "right";
    }
}

// Start again from the top when the vacuum reaches the bottom
if (y >= 370) {
    x = 0;
    y = 0;
    direction = "right";
}

   // Obstacle detection
document.querySelectorAll(".obstacle").forEach(obs => {
    const o = obs.getBoundingClientRect();
    const v = vacuum.getBoundingClientRect();

    if (
        v.left < o.right &&
        v.right > o.left &&
        v.top < o.bottom &&
        v.bottom > o.top
    ) {
        // Move down and change direction
        y += 40;

        if (direction === "right") {
            direction = "left";
            x = Math.min(x, 470);
        } else {
            direction = "right";
            x = Math.max(x, 0);
        }
    }
});

    vacuum.style.left = x + "px";
    vacuum.style.top = y + "px";

    requestAnimationFrame(moveVacuum);
}