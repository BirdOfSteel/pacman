import { mapArray, tileSize } from "../utils/map.js";
import { isGameRunning } from "../index.js";
import updateCharacterPositionOnMap from "../utils/updateCharacterPositionOnMap.js";
import isNextPositionValid from "../utils/isNextPositionValid.js";
import findWhereGhostCanMove from "../utils/findWhereGhostCanMove.js";
import convertPathingTileToDirection from "../utils/convertPathingTileToDirection.js";
import { points } from "../utils/points/pointsHandler.js";
import { generatePath } from "../utils/pathFinder.js";
import { totalPointsOnMap } from "../utils/points/pointsHandler.js";
import checkForGhostOverlap from "../utils/checkForGhostOverlap.js";
import generateGhostCanvasArray from "../utils/generateGhostCanvasArray.js";
import { pacman } from "./Pacman.js";

class Ghost {
    constructor(name, colour, startX, startY, releaseDelay) {
        this.name = name;
        this.colour = colour;

        this.frightenedColour = '#4D94D1';
        this.flashColour = '#cfcfcf';

        this.releaseDelay = releaseDelay;

        this.startX = startX;
        this.startY = startY;

        this.posX = startX;
        this.posY = startY;
        this.previousPosition = {x: 0, y: 0};
        
        this.direction = {x: 0, y: 0};
        this.oppositeDirection = {x: 0, y: 0};

        this.flashInterval = null;
        this.isFrightened = false;

        this.isIdle = true;
        this.isExitingBase = false;
        this.isExploring = false;

        this.baseProbabilityOfChase = 0.1;
        this.probabilityOfChase = this.baseProbabilityOfChase;
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

    startFlashing() {
        this.flashInterval = setInterval(() => {
            this.frightenedColour = this.frightenedColour === this.flashColour ? '#4D94D1' : '#cfcfcf';
            this.initialisePosition();
        }, 350)
        this.initialisePosition();
    }

    initialisePosition() {
        const ghostOverlapObject = checkForGhostOverlap(this);
        let colour = this.colour;
        
        if (this.isFrightened) {
            colour = this.frightenedColour;
        } else if (ghostOverlapObject.isColourMixed) {
            colour = ghostOverlapObject.mixedColour;
        }

        this.context.fillStyle = colour;
        this.context.beginPath();
        this.context.arc(
            this.posX*tileSize + 5, 
            this.posY*tileSize + 4, 
            tileSize / 1.75, 
            0, 
            Math.PI * 2
        );
        this.context.fill();
    }

    clearLastPosition() {
        this.context.clearRect( // IMPORTANT: this is constantly looped, removing the pixels over pacman. Adjust below values to position where the rectangle should be cut from. 
            this.posX * tileSize - 11, 
            this.posY * tileSize - 12,  
            32, 
            32
        );
    }

    idleMovement() {
        if (this.posY === this.startY) {
            this.posY += 1;
        } else {
            this.posY -= 1;
        }
    }

    releaseFromBase() {
        const nextPosition = isNextPositionValid(this.posX, this.posY, this.direction);

        if (nextPosition.isNextPositionAllowed) {
            this.posY = this.posY - 1;
        } else {
            this.posX = 14;
            this.posY = 11;
            this.isExitingBase = false;
            this.isExploring = true;
        }
        
        this.recordLastPosition();
    } 

    resetValues() {
        this.clearLastPosition();
        this.posX = this.startX;
        this.posY = this.startY;
        this.isIdle = true;
        this.isExitingBase = false;
        this.isExploring = false;
        this.initialisePosition();
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

    usePathfinding() { // uses pathfinding to chase pacman
        const pathfinderArray = generatePath(this.posX, this.posY);
        const pathDirection = convertPathingTileToDirection(this.posX, this.posY, pathfinderArray[0].x, pathfinderArray[0].y)
        const oppositePathDirection = pathDirection.oppositeDirection;

        if (pathfinderArray[0].x === oppositePathDirection.x && pathfinderArray[0].y === this.oppositeDirection.y) {
            this.moveRandomly(); // moves randomly if pathfinder moves ghost backwards
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

        const difficultyMultiplier = Math.floor(currentNumberOfPoints / difficultyPerPoints);
        this.probabilityOfChase = this.baseProbabilityOfChase + (difficultyIncrement * difficultyMultiplier);
    
        if (this.probabilityOfChase >= 0.8) { // pathfinding is capped at being used 80% of the time
            this.probabilityOfChase = 0.8;
        }
    }
    
    exploreMap() {
        const randomNumber = Math.random();
        const pathfinderArray = generatePath(this.posX, this.posY);
        const pathDirection = convertPathingTileToDirection(this.previousPosition.x, this.previousPosition.y, pathfinderArray[0].x, pathfinderArray[0].y)

        if (this.isFrightened) {
            this.moveRandomly(); // moves randomly when frightened
        } else {
            if (this.probabilityOfChase > randomNumber) {
                // pathDirection.direction.x and .y will equal 0 if pathfinder wants to go backwards. if this happens, ghost will move randomly instead.
                if (pathDirection.direction.x === 0 && pathDirection.direction.y === 0) {
                    this.moveRandomly();
                } else {
                    this.usePathfinding();
                }
            } else {
                this.moveRandomly();
            }
        }


        // handles teleporting
        const characterOnMapArray = mapArray[this.posY][this.posX];

        if (characterOnMapArray === '>') {
            this.posX = 27;
        } else if (characterOnMapArray === '<') {
            this.posX = 1;
        }
        
        this.recordDirection();
    }

    move() {
        if (isGameRunning) {
            this.handleIncreaseProbabilityOfChase();
            this.clearLastPosition();

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



export const blinky = new Ghost('blinky', '#FF0000', 11, 13, 500); // 500
export const pinky = new Ghost('pinky', '#FFB8FF', 13, 13, 4000); // 4000
export const inky = new Ghost('inky', '#00FFFF', 15, 13, 12000); // 12000
export const clyde = new Ghost('clyde', '#FFB852', 17, 13, 20000); // 20000

export const ghostArray = [blinky, pinky, inky, clyde];

const ghostCanvasArray = generateGhostCanvasArray();

ghostArray.forEach((ghost, i) => {
    ghost.context = ghostCanvasArray[i].context;
})