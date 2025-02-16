import { mapContext } from "../ctx.js";
import { tileSize } from "../utils/map.js";
import { isGameRunning } from "../index.js";
import updateCharacterPositionOnMap from "../utils/updateCharacterPositionOnMap.js";
import isNextPositionValid from "../utils/isNextPositionValid.js";
import findWhereGhostCanMove from "../utils/findWhereGhostCanMove.js";
import convertPathingTileToDirection from "../utils/convertPathingTileToDirection.js";
import { points } from "../utils/handleGetCollectable.js";
import { generatePath } from "../utils/pathFinder.js";
import { totalPointsOnMap } from "../utils/totalPointsOnMap.js";

class Ghost {
    constructor(name, colour, startX, startY, delayRelease) {
        this.name = name;
        this.colour = colour;

        this.posX = startX;
        this.posY = startY;
        this.direction = {x: 0, y: 0};
        this.oppositeDirection = {x: 0, y: 0};
        this.previousPosition = {x: 0, y: 0};

        this.isIdle = true;
        this.isExitingBase = false;
        this.isExploring = false;

        this.baseProbabilityOfChase = 0.3;
        this.probabilityOfChase = this.baseProbabilityOfChase;

        setTimeout(() => { // release ghost after delay
            this.isIdle = false;
            this.isExitingBase = true;
        }, delayRelease)
    }

    updatePositionOnMap() {
        updateCharacterPositionOnMap(
            this.previousPosition.x, 
            this.previousPosition.y, 
            this.posX, 
            this.posY,
            this.name
        )
    }

    initialisePosition() {
        document.getElementById('pacman-container');
        mapContext.fillStyle = this.colour;
        mapContext.beginPath();
        mapContext.arc(
            this.posX*tileSize + 5, 
            this.posY*tileSize + 4, 
            tileSize / 1.75, 
            0, 
            Math.PI * 2
        );
        mapContext.fill();
    }

    clearLastPosition() {
        mapContext.clearRect( // IMPORTANT: this is constantly looped, removing the pixels over pacman. Adjust below values to position where the rectangle should be cut from. 
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
        
        this.posY += this.direction.y;
    }

    releaseFromBase() {
        const nextPosition = isNextPositionValid(this.posX, this.posY, this.direction);

        if (nextPosition.isNextPositionAllowed) {
            this.posY = this.posY - 1;
        } else {
            this.posY = 11;
            this.recordLastPosition();
            this.isExitingBase = false;
            this.isExploring = true;
        }
    }

    moveRandomly() { // calculates and moves ghost to a random valid tile, but not backwards.
        let allowedCoordinatesArray = findWhereGhostCanMove(this.posX, this.posY);

        allowedCoordinatesArray = allowedCoordinatesArray.filter((coordinateObject) => {
            if (coordinateObject.x === this.previousPosition.x && coordinateObject.y === this.previousPosition.y) {
                return false; // removes previous co-ordinate from allowedCoordinatesArray so ghost can't go backwards
            } else {
                return true;
            }
        })

        const randomNumber = Math.floor(Math.random() * allowedCoordinatesArray.length);
        const randomAllowedCoordinate = allowedCoordinatesArray[randomNumber];
    
        this.recordLastPosition();
        this.posX = randomAllowedCoordinate.x;
        this.posY = randomAllowedCoordinate.y;
    }

    chasePacman() { // uses pathfinding to chase pacman
        const pathfinderArray = generatePath(this.posX, this.posY);
        const pathDirection = convertPathingTileToDirection(this.previousPosition.x, this.previousPosition.y, pathfinderArray[0].x, pathfinderArray[0].y)
        const oppositePathDirection = pathDirection.oppositeDirection;


        if (pathfinderArray[0].x === oppositePathDirection.x && pathfinderArray[0].y === this.oppositeDirection.y) {
            this.moveRandomly();    
        } else {
            this.recordLastPosition();
            // this.posX MUST be set to pathFinderArray[0].y co-ordinate, and so on for posX. Flipping them will break it.
            this.posX = pathfinderArray[0].y;
            this.posY = pathfinderArray[0].x;
        }
    }

    recordDirection() { // calculates direction and opposite direction
        let direction = {x: 0, y: 0};
        let oppositeDirection = {x: 0, y: 0};

        if (this.posX > this.previousPosition.x) {
            direction.x = 1;
            oppositeDirection.x = -1;
        } else if (this.posX < this.previousPosition.x) {
            direction.x = -1;
            oppositeDirection.x = 1;
        }

        if (this.posY > this.previousPosition.y) {
            direction.y = 1;
            oppositeDirection.y = -1;
        } else if (this.posY < this.previousPosition.y) {
            direction.y = -1;
            oppositeDirection.y = 1;
        }


        this.direction = direction;
        this.oppositeDirection = oppositeDirection;
    }

    recordLastPosition() {
        this.previousPosition.x = this.posX; 
        this.previousPosition.y = this.posY; 
    }

    handleIncreaseProbabilityOfChase() {
        // difficultyPerPoints is a fraction of the total points you can obtain. Ghosts will increase pathfinding ability
        // depending on how many times the value of difficultyPerPoints is found in the obtained points.
        const difficultyIncrement = 0.1; // higher value means difficulty increases by more every time the required points are reached. Easier could be 0.05, or harder could be 0.2. 
        const difficultyPerPoints = Math.floor(totalPointsOnMap / 6); // higher divider means difficulty increases every fewer points reached
        const currentNumberOfPoints = points / 10;

        const difficultyMultiplier = Math.floor(currentNumberOfPoints / difficultyPerPoints); // multiplier for increasing difficulty, based on obtained points.
        this.probabilityOfChase = this.baseProbabilityOfChase + (difficultyIncrement * difficultyMultiplier);
    }
    
    exploreMap() {
        const randomNumber = Math.random();
        const pathfinderArray = generatePath(this.posX, this.posY);
        const pathDirection = convertPathingTileToDirection(this.previousPosition.x, this.previousPosition.y, pathfinderArray[0].x, pathfinderArray[0].y)

        if (this.probabilityOfChase > randomNumber) {
            // pathDirection.direction.x and .y will equal 0 if pathfinder wants to go backwards. if this happens, ghost will move randomly instead.
            if (pathDirection.direction.x === 0 && pathDirection.direction.y === 0) {
                this.moveRandomly();
            } else {
                this.chasePacman();
            }
        } else {
            this.moveRandomly();
        }
        
        this.recordDirection();
    }

    move() {
        if (isGameRunning) {
            this.clearLastPosition();
            this.handleIncreaseProbabilityOfChase();

            if (points)

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

export const pinky = new Ghost('pinky', 'pink', 14, 13, 2000);