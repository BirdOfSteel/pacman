import { tileSize } from './map.js';
import { ctx } from './ctx.js';
import isNextPositionValid from './utils/isNextPositionValid.js';
import handleGetCollectable, { points } from './utils/handleGetCollectable.js';
import findWhereGhostCanMove from './utils/findWhereGhostCanMove.js';
import hasAControlBeenPressed from './utils/hasAControlBeenPressed.js';

document.getElementById('points-text').innerHTML = `Points: ${points}`;

class Pacman {
    constructor() {
        this.posX = 14; // starting x
        this.posY = 23; // starting y
        this.direction = {x: 0, y: 0};
        this.queuedDirection = {x: 0, y: 0};
    }

    initialisePosition() {
        document.getElementById('pacman-container');
        ctx.fillStyle = 'yellow';
        ctx.beginPath();
        ctx.arc(
            this.posX*tileSize + 5, 
            this.posY*tileSize + 4, 
            16, 
            0, 
            Math.PI * 2
        );
        ctx.fill();

        handleGetCollectable(this.posX, this.posY);
    }

    move() {
        const nextPosition = isNextPositionValid(this.posX,this.posY, this.direction);
        const nextQueuedPosition = isNextPositionValid(this.posX, this.posY, this.queuedDirection); 
    
        const isDirectionEqualToQueuedDirection =
            JSON.stringify(this.direction) === JSON.stringify(this.queuedDirection)

        
        ctx.clearRect( // IMPORTANT: this is constantly looped, removing the pixels over pacman. Adjust below values to position where the rectangle should be cut from. 
            this.posX * tileSize - 11, 
            this.posY * tileSize - 12,  
            32, 
            32
        );

        if (!isDirectionEqualToQueuedDirection && nextQueuedPosition.isNextPositionAllowed) {
            this.direction = this.queuedDirection;

            this.posX = this.posX + this.direction.x;
            this.posY = this.posY + this.direction.y;

        } else if (nextPosition.isNextPositionAllowed) {

            this.posX = this.posX + this.direction.x;
            this.posY = this.posY + this.direction.y;
        } 

        this.initialisePosition();
    }
}

class Pinky {
    constructor() {
        this.posX = 14;
        this.posY = 13;
        this.direction = {x: 0, y: 0};
        this.previousDirection = {x: 0, y: 0};

        this.isIdle = true;

        this.isExitingBase = false;
        this.isExploring = false;
    }

    initialisePosition() {
        document.getElementById('pacman-container');
        ctx.fillStyle = 'pink';
        ctx.beginPath();
        ctx.arc(
            this.posX*tileSize + 5, 
            this.posY*tileSize + 4, 
            16, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
    }

    clearLastPosition() {
        ctx.clearRect( // IMPORTANT: this is constantly looped, removing the pixels over pacman. Adjust below values to position where the rectangle should be cut from. 
            this.posX * tileSize - 11, 
            this.posY * tileSize - 12,  
            32, 
            32
        );
    }

    idleMovement() {

        if (this.direction.y === 0 || this.direction.y === -1) {
            this.direction.y = 1;
        } else {
            this.direction.y = -1;
        }
        
        this.posY = this.posY + this.direction.y;
    }

    releaseFromBase() {
        const nextPosition = isNextPositionValid(this.posX,this.posY, this.direction);

        if (nextPosition.isNextPositionAllowed) {
            this.posY = 11
        } else {
            this.isExitingBase = false;
            this.isExploring = true;
        }
    }
    
    exploreMap() {
        const nextPosition = isNextPositionValid(this.posX, this.posY, this.direction);
        
        if (!nextPosition.isNextPositionAllowed) {
            let allowedMovementArray = findWhereGhostCanMove(this.posX, this.posY);
            allowedMovementArray = allowedMovementArray.filter((directionObject) => {
                const x = directionObject.x;
                const y = directionObject.y;
                return directionObject.x != this.direction.x && directionObject.y != this.direction.y;
            })

            const randomNumber = Math.floor(Math.random() * allowedMovementArray.length);
            const randomDirection = allowedMovementArray[randomNumber];
            console.log(this.direction)
            console.log(allowedMovementArray)

            this.direction = randomDirection;
        }

        this.posX = this.posX + this.direction.x;
        this.posY = this.posY + this.direction.y;
    }

    move() {
        if (isGameRunning) {
            this.clearLastPosition();

            if (this.isIdle) {
                this.idleMovement();
            } else if (this.isExitingBase) {
                this.releaseFromBase();
            } else if (this.isExploring) {
                this.exploreMap();
            }
            
            this.initialisePosition();
        }
    }
}



//
let hasHandleReleaseGhostsRun = false;

function handleReleaseGhosts() {
    setTimeout(() => { // release pinky
        pinky.isIdle = false;
        pinky.isExitingBase = true;
    },2000)
}
//


const pacman = new Pacman();
const pinky = new Pinky();


// set up and loop game

let isGameRunning = false;

pacman.initialisePosition(ctx);
pinky.initialisePosition(ctx);

function handleMovements() {
    pacman.move(ctx);
    pinky.move(ctx);

    if (!hasHandleReleaseGhostsRun) {
        hasHandleReleaseGhostsRun = true;
        handleReleaseGhosts();
        console.log("RAN")
    }
}

function gameLoop() {
    if (isGameRunning) {
        setInterval(() => handleMovements(), 250)
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
            isGameRunning = true;
            gameLoop();
        }
    }
})