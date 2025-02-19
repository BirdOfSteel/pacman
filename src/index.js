import { mapCanvas, mapContext, pointsCanvas, pointsContext } from './ctx.js';
import { pacman } from './classes/Pacman.js';
import { ghostArray } from './classes/Ghost.js';
import { addOneLife, livesManager, resetLives } from './utils/lives/livesManager.js';
import { points, pointsCollected, resetPoints, resetTotalPointsOnMap } from './utils/points/pointsHandler.js';
import hasAControlBeenPressed from './utils/hasAControlBeenPressed.js';
import { initialiseMap } from './utils/map.js';
import generateGhostCanvasArray from './utils/generateGhostCanvasArray.js';
import { level } from './utils/levels/levelManager.js';
import { resetPointsCollected } from './utils/points/pointsHandler.js';
import { resetPointsMapArray } from './utils/handleGetCollectable.js';

const [blinky, pinky, inky, clyde] = ghostArray;

export let isGameRunning = false;
export let isGameOver = false;

const gameIntervalDelay = 200;

export let pacmanIntervalId = null;

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
document.getElementById('restart-game-btn').addEventListener('click', () => resetGame());

const ghostCanvasArray = generateGhostCanvasArray();

export function clearAllIntervals() {
    clearInterval(pacmanIntervalId);
    ghostIntervalIdArray.forEach((id) => {
        clearInterval(id);
    });
}

function prepareGame() {
    document.getElementById('level-text').innerHTML = `Level: ${level}`;
    ghostCanvasArray.map((canvasObject) => {
        document.getElementById('game-container').append(canvasObject.canvas);
    })

    livesManager();
    initialiseMap();

    pacman.posX = 14;
    pacman.posY = 23;
    
    pacman.initialisePosition(mapContext);

    ghostArray.forEach((ghost) => {
        ghost.initialisePosition();
    })
}

prepareGame();

export function prepareNextLevel() {
    addOneLife();
    setIsGameRunning(false);

    mapContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    pointsContext.clearRect(0, 0, pointsCanvas.width, pointsCanvas.height);

    resetPointsMapArray();
    resetTotalPointsOnMap();
    resetPointsCollected();
    initialiseMap();
    clearAllIntervals();

    ghostIntervalIdArray.forEach((id) => { // reset setTimeouts for ghost release
        clearTimeout(id)
    })

    ghostArray.forEach((ghost) => { // reset ghost states
        ghost.resetValues();
    })

    pacman.resetPosition();
    pacman.initialisePosition();
}

export function resetGame() {
    document.getElementById('game-end-div').style.display = 'none';

    isGameRunning = false;
    isGameOver = false;
    
    mapContext.clearRect(0, 0, mapCanvas.width, mapCanvas.height);
    pointsContext.clearRect(0, 0, pointsCanvas.width, pointsCanvas.height);

    resetPoints();
    resetPointsCollected();
    resetPointsMapArray();
    resetLives();
    initialiseMap();
    removeGhostIntervals();

    clearInterval(pacmanIntervalId);
    
    ghostIntervalIdArray.forEach((id) => { // reset setTimeouts for ghost release
        clearTimeout(id)
    })

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


let timeoutIdArray = []
let ghostIntervalIdArray = [];

function startGhostReleaseTimers() {
    ghostArray.forEach((ghost) => {
        const timeout = setTimeout(() => {
            ghost.isIdle = false;
            ghost.isExitingBase = true;
        }, ghost.releaseDelay)

        timeoutIdArray.push(timeout)
    })
}

export function removeGhostIntervals() {
    ghostIntervalIdArray.forEach((id) => {
        clearInterval(id);
    })
}

function setAllIntervals() {
    pacmanIntervalId = setInterval(() => pacman.move(), gameIntervalDelay)
    setGhostIntervals();
}

export function setGhostIntervals() {
    ghostArray.forEach((ghost) => {
        ghostIntervalIdArray.push(setInterval(() => ghost.move(), ghost.isFrightened ? gameIntervalDelay * 2 : gameIntervalDelay))
    })
}


function startGame() { // sets intervals to pacman and ghost
    if (isGameRunning) {
        setAllIntervals();
    }
}


// controls

window.addEventListener('keydown', (e) => {
    if (!isGameOver) {
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

        if (hasAControlBeenPressed(e.key) && !isGameRunning) {
            setIsGameRunning(true);
            startGhostReleaseTimers();
            startGame();
        }
    }
})