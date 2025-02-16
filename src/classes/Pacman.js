import { mapContext } from "../ctx.js";
import { setIsGameRunning } from "../index.js";
import { tileSize } from "../utils/map.js";
import handleGetCollectable from "../utils/handleGetCollectable.js";
import isNextPositionValid from "../utils/isNextPositionValid.js";
import updateCharacterPositionOnMap from "../utils/updateCharacterPositionOnMap.js";

import { pinky } from "./Ghost.js";

class Pacman {
    constructor(startX, startY) {
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

    initialisePosition() {
        document.getElementById('pacman-container');
        mapContext.fillStyle = 'yellow';
        mapContext.beginPath();
        mapContext.arc(
            this.posX*tileSize + 5, 
            this.posY*tileSize + 4, 
            tileSize / 1.75, 
            0, 
            Math.PI * 2
        );
        mapContext.fill();

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

    checkForGameEnd() {
        const pacmanLocation = {x: this.posX, y: this.posY};
        const ghostsArray = [pinky]; // add ghosts to this array for collision detection

        let isPacmanOnGhost = false;

        for (let i = 0; i != ghostsArray.length; i++) {
            const ghost = ghostsArray[i];
            if (ghost.posX === pacmanLocation.x && ghost.posY === pacmanLocation.y) {
                isPacmanOnGhost = true;
            } else if (ghost.prevX === pacmanLocation.x && ghost.prevY === pacmanLocation.y) {
                isPacmanOnGhost = true;
            }
        }

        if (isPacmanOnGhost) {
            setIsGameRunning(false);
            document.getElementById('game-end-div').style.display = 'flex';
            console.log("END");
        }
    }

    move() {
        this.checkForGameEnd();
        this.clearLastPosition();
        this.prevX = this.posX;
        this.prevY = this.posY;

        const nextPosition = isNextPositionValid(this.posX,this.posY, this.direction);
        const nextQueuedPosition = isNextPositionValid(this.posX, this.posY, this.queuedDirection); 

        const isDirectionEqualToQueuedDirection =
            JSON.stringify(this.direction) === JSON.stringify(this.queuedDirection);

        if (!isDirectionEqualToQueuedDirection && nextQueuedPosition.isAllowed) {
            this.direction = this.queuedDirection;

            this.posX = this.posX + this.direction.x;
            this.posY = this.posY + this.direction.y;
        } else if (nextPosition.isAllowed) {

            this.posX = this.posX + this.direction.x;
            this.posY = this.posY + this.direction.y;
        } 

        this.initialisePosition();
        this.updatePositionOnMap();
    }
}

export const pacman = new Pacman();