import { mapArray } from "../map.js";

export default function updateCharacterPositionOnMap(prevX, prevY, posX, posY, character) {
    let prevRowAsArray = [...mapArray[prevY]];
    let characterSymbol = null;

    switch (character) {
        case 'pacman': 
            characterSymbol = 'P';
            break;
        case 'blinky':
            characterSymbol = 'b';
            break;
        case 'pinky': 
            characterSymbol = 'p';
            break;
        case 'inky':
            characterSymbol = 'i';
            break;
        case 'clyde':
            characterSymbol = 'c';
            break;
    }

    if (prevRowAsArray[prevX] === characterSymbol) { // erases last pinky position
        prevRowAsArray[prevX] = ' ';
        mapArray[prevY] = prevRowAsArray.join('');
    }

    let currentRowAsArray = [...mapArray[posY]];
    currentRowAsArray[posX] = characterSymbol;
    mapArray[posY] = currentRowAsArray.join('');
}
  
