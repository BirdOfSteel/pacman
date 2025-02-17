import { generatePointsMapArray, tileSize } from "./map.js";
import { resetTotalPointsOnMap } from "./totalPointsOnMap.js";
import { pointsContext } from "../ctx.js";

export let points = 0;

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

    if (rowAsArray[posX] === '.') {
        rowAsArray[posX] = ' ';
        pointsMapArray[posY] = rowAsArray.join('');

        pointsContext.fillStyle = 'pink'
        pointsContext.clearRect(posX * tileSize + 1, posY * tileSize + 1, tileSize/3, tileSize/3)
        // pointsContext.rect(posX * tileSize + 1.5, posY * tileSize + 1, tileSize/3, tileSize/3);

        points += 10;
        document.getElementById('points-text').innerHTML = `Points: ${points}`;
    }
}
