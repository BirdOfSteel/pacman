import { mapCanvas } from "../ctx.js";
import { mapArray } from "./map.js";

let mapArrayCopy = mapArray.map(row => row.slice());

export default function updateCharacterPositionOnMap(prevX, prevY, posX, posY, character) {
    let prevRowAsArray = [...mapArrayCopy[prevY]];
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
        mapArrayCopy[prevY] = prevRowAsArray.join('');
    }

    let currentRowAsArray = [...mapArrayCopy[posY]];
    currentRowAsArray[posX] = characterSymbol;
    mapArrayCopy[posY] = currentRowAsArray.join('');
}
  
