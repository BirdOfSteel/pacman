import { ctx } from "../ctx.js";
import { tileSize } from "../utils/map.js";
import { isGameRunning } from "../index.js";
import updateCharacterPositionOnMap from "../utils/updateCharacterPositionOnMap.js";
import isNextPositionValid from "../utils/isNextPositionValid.js";
import findWhereGhostCanMove from "../utils/findWhereGhostCanMove.js";
import directionTowardsPacman from "../utils/directionTowardsPacman.js";

import { generatePath } from "../utils/pathFinder.js";

class Ghost {
    constructor(name, colour, posX, posY, releaseDelay) {
        this.name = name;
        this.colour = colour;

        this.posX = posX; // 14
        this.posY = posY; // 13
        this.prevX = null;
        this.prevY = null;
        this.direction = {x: 0, y: 0};
        this.previousDirection = {x: 0, y: 0};

        this.isIdle = true;

        this.isExitingBase = false;
        this.isExploring = false;

        setTimeout(() => { // release ghost
            this.isIdle = false;
            this.isExitingBase = true;
        }, releaseDelay)
    }

    updatePositionOnMap() {
        updateCharacterPositionOnMap(
            this.prevX, 
            this.prevY, 
            this.posX, 
            this.posY,
            this.name
        )
    }

    initialisePosition() {
        document.getElementById('pacman-container');
        ctx.fillStyle = this.colour;
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
            this.posY = this.posY - 1;
        } else {
            this.posY = 11;
            this.isExitingBase = false;
            this.isExploring = true;
        }
    }
    
    exploreMap() {
        let allowedMovementArray = findWhereGhostCanMove(this.posX, this.posY);
        const chasePacmanDirection = directionTowardsPacman(this.posX, this.posY);
        const pathfinderArray = generatePath(this.posX, this.posY);

        let oppositeDirection = {x: 0, y: 0};

        switch (this.direction.x) {
            case 1: 
                oppositeDirection.x = -1;
                break;
            case -1:
                oppositeDirection.x = 1;
                break;
        }

        switch (this.direction.y) {
            case 1: 
                oppositeDirection.y = -1;
                break;
            case -1:
                oppositeDirection.y = 1;
                break;
            }


        allowedMovementArray = allowedMovementArray.filter((directionObject) => {
            return (
                directionObject.x != oppositeDirection.x || 
                directionObject.y != oppositeDirection.y
            );
        })

        // this.posX MUST be set to pathFinderArray[0].y co-ordinate, and so on for posX. Flipping them will break it.
        this.posX = pathfinderArray[0].y;
        this.posY = pathfinderArray[0].x;
    }

    move() {
        if (isGameRunning) {
            this.clearLastPosition();
            this.prevX = this.posX;
            this.prevY = this.posY;

            if (this.isIdle) {
                this.idleMovement();
            } else if (this.isExitingBase) {
                this.releaseFromBase();
            } else if (this.isExploring) {
                this.exploreMap();
            }
            
            this.initialisePosition();
            this.updatePositionOnMap();
        }
    }
}

function convertPathfindToDirection(pathfinderObject) {
    let newPosition = {x: pathfinderObject.y, y: pathfinderObject.x};
    
    return newPosition;
}

export const pinky = new Ghost('pinky', 'pink', 14, 13, 5000);