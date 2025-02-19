import { generatePointsMapArray, tileSize } from "./map.js";
import { points, addToPoints, addOneToPointsCollected, pointsCollected, totalPointsOnMap } from "./points/pointsHandler.js";
import { pointsContext } from "../ctx.js";
import { ghostArray } from "../classes/Ghost.js";
import levelManager, { nextLevel } from "./levels/levelManager.js";
import { pacman } from "../classes/Pacman.js";
import { removeGhostIntervals, setGhostIntervals } from "../index.js";

let pointsMapArray = generatePointsMapArray();
let frightenedTimeoutIdArray = []

export default function handleGetCollectable(posX, posY) {
    // console.log(pointsMapArray[posY]) // this logs current row. can be used to verify array position is synced with visual position.

    if (levelManager().areAllPointsCollected) { // goes to next level if all points are collected
        nextLevel();
    } else {
        let rowAsArray = [...pointsMapArray[posY]];
        const char = rowAsArray[posX];
    
        if (char === '.') {
            rowAsArray[posX] = ' ';
            pointsMapArray[posY] = rowAsArray.join('');
    
            pointsContext.clearRect(posX * tileSize + 1, posY * tileSize + 1, tileSize/3, tileSize/3)
    
            addToPoints(10);
            addOneToPointsCollected();
            document.getElementById('points-text').innerHTML = `Points: ${points}`;
        } else if (char === 'o') {
            rowAsArray[posX] = ' ';
            pointsMapArray[posY] = rowAsArray.join('');
    
            pointsContext.clearRect(posX * tileSize - 4, posY * tileSize - 4, tileSize/1, tileSize/1)
    
            addToPoints(50);
            addOneToPointsCollected();
            document.getElementById('points-text').innerHTML = `Points: ${points}`;
            
            frightenedTimeoutIdArray.forEach((id) => {
                clearTimeout(id)
            })
            frightenedTimeoutIdArray = [];

            ghostArray.forEach((ghost) => {
                ghost.isFrightened = true;

                if (ghost.flashInterval) { // clears flash interval if ghost is already frightened
                    clearInterval(ghost.flashInterval);
                    ghost.flashInterval = null;
                }

                removeGhostIntervals();
                setGhostIntervals();
                ghost.initialisePosition();
    
                ghost.direction.x = ghost.oppositeDirection.x;
                ghost.direction.y = ghost.oppositeDirection.y;
                
                frightenedTimeoutIdArray.push(setTimeout(() => { // controls length of isFrightened
                    ghost.isFrightened = false;
                    removeGhostIntervals();
                    setGhostIntervals();
                }, 10000));
                
                setTimeout(() => { // start flashing near end of isFrightened mode
                    ghost.startFlashing();
                }, 8000)
            }) 
        }
    }
}

export function resetPointsMapArray() {
    pointsMapArray = generatePointsMapArray();
}