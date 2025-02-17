import { mapArray } from "./map.js";

export default function isNextPositionValid(posX, posY, direction) {
    const nextPositionAsTile = mapArray[posY + direction.y][posX + direction.x];
    let nextPositionObject = {
        x: posX + direction.x, 
        y: posY + direction.y, 
        char: nextPositionAsTile,
        isAllowed: true
    };

    switch (nextPositionAsTile) {
        case '|': case '-': case '└': case '┘': case '┌': case '┐': case '=': case '>': case '<':
            nextPositionObject.isAllowed = false;
            break;
    }

    // if (nextPositionObject.isAllowed) {
    //     console.log(nextPositionObject)
    // }

    return nextPositionObject;
}