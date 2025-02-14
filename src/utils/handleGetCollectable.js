import { mapArray } from "../map.js";

export let points = 0;
document.getElementById('points-text').innerHTML = `Points: ${points}`;

export default function handleGetCollectable(posX, posY) {
    // console.log(mapArray[posY]) // this logs current row. can be used to verify array position is synced with visual position.
    let rowAsArray = [...mapArray[posY]];

    if (rowAsArray[posX] === '.') {
        rowAsArray[posX] = ' ';
        mapArray[posY] = rowAsArray.join('');

        points += 10;
        document.getElementById('points-text').innerHTML = `Points: ${points}`;
    }
}
