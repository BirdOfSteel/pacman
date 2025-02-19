import { mapContext } from "../ctx.js";
import { isGameRunning, removeGhostIntervals, setGhostIntervals, setIsGameRunning } from "../index.js";
import { tileSize } from "../utils/map.js";
import handleGetCollectable from "../utils/handleGetCollectable.js";
import { addToPoints, points } from "../utils/points/pointsHandler.js";
import isNextPositionValid from "../utils/isNextPositionValid.js";
import updateCharacterPositionOnMap from "../utils/updateCharacterPositionOnMap.js";
import { setIsGameOver } from "../index.js";

import { ghostArray } from "./Ghost.js";
import { pacmanLives, subtractLife } from "../utils/lives/livesManager.js";

class Pacman {
    constructor(startX, startY) {
        this.startX = startX;
        this.startY = startY;
        this.posX = startX; // starting x
        this.posY = startY; // starting y

        this.prevX = null;
        this.prevY = null;

        this.direction = {x: 0, y: 0};
        this.queuedDirection = {x: 0, y: 0};
    }

    updatePositionOnMap() {
        updateCharacterPositionOnMap(
            this.prevX,
            this.prevY,
            this.posX,
            this.posY,
            'pacman'
        )
    }

    resetPosition() {
        this.posX = this.startX;
        this.posY = this.startY;
        this.direction = {x: 0, y: 0};
        this.initialisePosition();
    }

    initialisePosition() {
        document.getElementById('pacman-container');
        let rotation = 0

        mapContext.save();
        mapContext.translate(this.posX * tileSize + 5, this.posY * tileSize + 4);
        
        if (this.direction.x === 1) { // handles rotation based on direction
            rotation = 0;
        } else if (this.direction.y === 1) {
            rotation = 90;
        } else if (this.direction.x === -1) {
            rotation = 180;
        } else if (this.direction.y === - 1) {
            rotation = 270;
        }

        mapContext.rotate((rotation * Math.PI) / 180);
        mapContext.fillStyle = 'yellow';
        mapContext.beginPath();
        mapContext.moveTo(0, 0);
        mapContext.arc(
            0, 
            0, 
            tileSize / 1.75, 
            Math.PI * 0.25,
            Math.PI * 1.75 
        );
        mapContext.closePath();
        mapContext.fill();
        mapContext.restore();
        handleGetCollectable(this.posX, this.posY);
    }

    clearLastPosition() {
        mapContext.clearRect( // IMPORTANT: this is constantly looped, removing the pixels over pacman. Adjust below values to position where the rectangle should be cut from. 
            this.posX * tileSize - 11, 
            this.posY * tileSize - 12,  
            32, 
            32
        );
    }

    checkForGhostCollision() {
        let isPacmanOnGhost = false;
        let ghostOnPacman = null;

        for (let i = 0; i != ghostArray.length; i++) {
            const ghost = ghostArray[i];
            if (ghost.posX === pacman.posX && ghost.posY === pacman.posY) {
                isPacmanOnGhost = true;
                ghostOnPacman = ghost;
            }
        }

        if (isPacmanOnGhost) {
            if (ghostOnPacman.isFrightened) { // empowered pacman kills ghost
                ghostOnPacman.clearLastPosition();
                ghostOnPacman.posX = 14;
                ghostOnPacman.posY = 11;
                ghostOnPacman.initialisePosition();
                
                ghostOnPacman.isFrightened = false;

                addToPoints(200); // 200 points for ghost kill
                removeGhostIntervals();
                setGhostIntervals();
            } else { // pacman dies
                if (pacmanLives-1 > 0) {
                    subtractLife();
                } else {
                    console.log("ran")
                    setIsGameRunning(false);
                    setIsGameOver(true);

                    document.getElementById('game-end-div-text').innerHTML = `Game over!`;
                    document.getElementById('game-end-div-points').innerHTML = `Points: ${points}`;
                    document.getElementById('game-end-div').style.display = 'flex';
                }
            }
        }
    }

    move() {
        if (isGameRunning) {
            this.checkForGhostCollision();
            
            if (pacmanLives > 0) {
                this.clearLastPosition();
                this.prevX = this.posX;
                this.prevY = this.posY;
        
                const nextPosition = isNextPositionValid(
                    this.posX,
                    this.posY, 
                    this.direction, 
                    'pacman'
                );
                const nextQueuedPosition = isNextPositionValid(
                    this.posX, 
                    this.posY, 
                    this.queuedDirection, 
                    'pacman'
                ); 
        
                if (nextQueuedPosition.isAllowed) {
                    this.direction = this.queuedDirection;
        
                    this.posX = this.posX + this.direction.x;
                    this.posY = this.posY + this.direction.y;
                } else if (nextPosition.isAllowed) {
        
                    this.posX = this.posX + this.direction.x;
                    this.posY = this.posY + this.direction.y;
                }
                
                // handles teleporting
                if (nextPosition.char === '>') {
                    this.posX = 27;
                } else if (nextPosition.char === '<') {
                    this.posX = 1;
                }
        
                this.initialisePosition();
                this.updatePositionOnMap();
            }
        }
    }
}

export const pacman = new Pacman(14, 23);