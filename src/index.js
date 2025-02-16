import { ctx } from './ctx.js';

import { pacman } from './classes/Pacman.js';
import { pinky } from './classes/Ghost.js';

import { points, resetPoints } from './utils/handleGetCollectable.js';
import hasAControlBeenPressed from './utils/hasAControlBeenPressed.js';
import { initialiseMap } from './utils/map.js';

export let isGameRunning = false;
export let gameInterval = null;

export function setIsGameRunning(state) {
    isGameRunning = state;
}

document.getElementById('points-text').innerHTML = `Points: ${points}`;

function prepareGame() {
    resetPoints();

    pacman.posX = 14;
    pacman.posY = 23;
    pinky.posX = 14;
    pinky.posY = 13;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    initialiseMap();
    
    pacman.initialisePosition(ctx);
    pinky.initialisePosition(ctx);
}

prepareGame();

function handleMovements() {
    if (!isGameRunning) return;

    pacman.move(ctx);
    pinky.move(ctx);
}

function gameLoop() {
    if (isGameRunning) {
        console.log("running")
        if (gameInterval === null) {
            gameInterval = setInterval(() => handleMovements(), 250)
        }
    }
}


// controls

window.addEventListener('keydown', (e) => {
    e.preventDefault();

    if (e.key === 'ArrowUp' || e.key === 'w') {
        pacman.queuedDirection = {x: 0, y: -1};
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        pacman.queuedDirection = {x: 1, y: 0};
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        pacman.queuedDirection = {x: -1, y: 0};
    } else if (e.key === 'ArrowDown' || e.key === 's') {
        pacman.queuedDirection = {x: 0, y: 1};
    }

    if (!isGameRunning) {
        if (hasAControlBeenPressed(e.key)) {
            setIsGameRunning(true);
            gameLoop();
        }
    }

    if (e.key === 'i') {
        prepareGame();
    }
})