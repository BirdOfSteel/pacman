import { mapArray } from "./map.js";

export default function isNextPositionValid(posX, posY, direction) {
    const nextPositionInArray = mapArray[posY + direction.y][posX + direction.x];
    let isNextPositionAllowed = true;

    switch (nextPositionInArray) {
        case '|': case '-': case '└': case '┘': case '┌': case '┐': case '=':
            isNextPositionAllowed = false;
            break;
    }

    if (direction.x === 0 && direction.y === 0) {
        isNextPositionAllowed = false;
    }


    return { isNextPositionAllowed, nextPositionInArray };
}