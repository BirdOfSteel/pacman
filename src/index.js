import { mapCanvas, mapContext, pointsCanvas, pointsContext } from './ctx.js';

import { pacman } from './classes/Pacman.js';
import { ghostArray } from './classes/Ghost.js';

import { points, resetPoints } from './utils/handleGetCollectable.js';
import hasAControlBeenPressed from './utils/hasAControlBeenPressed.js';
import { initialiseMap } from './utils/map.js';
import generateGhostCanvasArray from './utils/generateGhostCanvasArray.js';

export let isGameRunning = false;
export let gameInterval = null;
export let isGameOver = false;

export function setIsGameRunning(state) {
    isGameRunning = state;
}

export function setIsGameOver(state) {
    isGameOver = state;
}

// Important variables:
// - In Ghost.js, the Ghost class contains a method called 
//   handleIncreaseProbabilityOfChase. Difficulty can be controlled
//   by modifying difficultyIncrement and difficultyPerPoints.

document.getElementById('points-text').innerHTML = `Points: ${points}`;
const ghostCanvasArray = generateGhostCanvasArray();


function prepareGame() {
    ghostCanvasArray.map((canvasObject) => {
        document.getElementById('canvas-container').append(canvasObject.canvas);
    })

    resetPoints();

    pacman.posX = 14;
    pacman.posY = 23;

    initialiseMap();
    
    pacman.initialisePosition(mapContext);

    ghostArray.forEach((ghost) => {
        ghost.initialisePosition();
    })
}

prepareGame();

function resetGame() {
    document.getElementById('game-end-div').style.display = 'none';

    isGameRunning = false;
    isGameOver = false;
    
    mapContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    pointsContext.clearRect(0, 0, pointsCanvas.width, pointsCanvas.height);

    resetPoints();
    initialiseMap();

    ghostCanvasArray.forEach((canvasObject) => {
        canvasObject.context.clearRect(0, 0, canvasObject.canvas.width, canvasObject.canvas.height)
    })

    ghostArray.forEach((ghost) => {
        ghost.posX = ghost.startX;
        ghost.posY = ghost.startY;
        ghost.isIdle = true;
        ghost.isExitingBase = false;
        ghost.isExploring = false;
        ghost.initialisePosition();
    })

    pacman.posX = 14;
    pacman.posY = 23;
    pacman.initialisePosition();
    
    timeoutIdArray.forEach((id) => {
        clearTimeout(id)
    })
}
document.getElementById('restart-game-btn').addEventListener('click', () => resetGame());

let timeoutIdArray = []

function startGhostReleaseTimers() {
    ghostArray.forEach((ghost) => {
        const timeout = setTimeout(() => {
            ghost.isIdle = false;
            ghost.isExitingBase = true;
        }, ghost.releaseDelay)

        timeoutIdArray.push(timeout)
    })
}

function handleMovements() {
    if (!isGameRunning) return;

    pacman.move();
    
    ghostArray.forEach((ghost) => {
        ghost.move();
    })
}

function gameLoop() {
    if (isGameRunning) {
        console.log("running")
        if (gameInterval === null) {
            gameInterval = setInterval(() => handleMovements(), 200)
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

    if (!isGameRunning && !isGameOver) {
        if (hasAControlBeenPressed(e.key)) {
            setIsGameRunning(true);
            startGhostReleaseTimers();
            gameLoop();
        }
    }

    if (e.key === 'i') {
        prepareGame();
    }
})