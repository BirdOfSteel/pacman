import { generatePointsMapArray, tileSize } from "./map.js";
import { resetTotalPointsOnMap } from "./totalPointsOnMap.js";
import { pointsContext } from "../ctx.js";
import { ghostArray } from "../classes/Ghost.js";
import { pacman } from "../classes/Pacman.js";

export let points = 0;

export function addGhostToPoints() {
    points += 200;
    document.getElementById('points-text').innerHTML = `Points: ${points}`;
}

document.getElementById('points-text').innerHTML = `Points: ${points}`;
let pointsMapArray = generatePointsMapArray();

export function resetPoints() {
    points = 0;
    resetTotalPointsOnMap();
    pointsMapArray = generatePointsMapArray();
    document.getElementById('points-text').innerHTML = `Points: ${points}`;
}

export default function handleGetCollectable(posX, posY) {
    // console.log(pointsMapArray[posY]) // this logs current row. can be used to verify array position is synced with visual position.
    let rowAsArray = [...pointsMapArray[posY]];
    const char = rowAsArray[posX];
    
    if (char === '.') {
        rowAsArray[posX] = ' ';
        pointsMapArray[posY] = rowAsArray.join('');

        pointsContext.clearRect(posX * tileSize + 1, posY * tileSize + 1, tileSize/3, tileSize/3)

        points += 10;
        document.getElementById('points-text').innerHTML = `Points: ${points}`;
    } else if (char === 'o') {
        rowAsArray[posX] = ' ';
        pointsMapArray[posY] = rowAsArray.join('');

        pointsContext.clearRect(posX * tileSize - 4, posY * tileSize - 4, tileSize/1, tileSize/1)

        points += 50;
        document.getElementById('points-text').innerHTML = `Points: ${points}`;
    
        ghostArray.forEach((ghost) => {
            ghost.isFrightened = true;

            ghost.direction.x = ghost.oppositeDirection.x;
            ghost.direction.y = ghost.oppositeDirection.y;
            setTimeout(() => {
                ghost.isFrightened = false;
            }, 10000)
        }) 
    }
}
