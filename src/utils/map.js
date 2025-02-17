import { mapContext, pointsContext, pointsCanvas, mapCanvas } from '../ctx.js';
import { addToTotalPointsOnMap } from './totalPointsOnMap.js';

export const tileSize = 20;

export const mapArray = [
    "┌---------------------------┐",
    "|............┌-┐............|",
    "|.┌--┐.┌---┐.| |.┌---┐.┌--┐.|",
    "|o|  |.|   |.| |.|   |.|  |o|",
    "|.└--┘.└---┘.└-┘.└---┘.└--┘.|",
    "|...........................|",
    "|.┌--┐.┌┐.┌-------┐.┌┐.┌--┐.|",
    "|.└--┘.||.└--┐ ┌--┘.||.└--┘.|",
    "|......||....| |....||......|",
    "└----┐.|└--┐ | | ┌--┘|.┌----┘",
    "     |.|┌--┘ └-┘ └--┐|.|     ",
    "     |.||           ||.|     ",
    "     |.|| ┌--===--┐ ||.|     ",
    "-----┘.└┘ |       | └┘.└-----",
    "|    |.   |       |   .|    |",
    "-----┐.┌┐ └-------┘ ┌┐.┌-----",
    "     |.||           ||.|     ",
    "     |.|| ┌-------┐ ||.|     ",
    "     |.|| |       | ||.|     ",
    "┌----┘.└┘ └--┐ ┌--┘ └┘.└----┐",
    "|............| |............|",
    "|.┌--┐.┌---┐.| |.┌---┐.┌--┐.|",
    "|.└-┐|.└---┘.└-┘.└---┘.|┌-┘.|",
    "|o..||........ ........||..o|",
    "└-┐.||.┌┐.┌-------┐.┌┐.||.┌-┘",
    "┌-┘.└┘.||.└--┐ ┌--┘.||.└┘.└-┐",
    "|......||....| |....||......|",
    "|.┌----┘└--┐.| |.┌--┘└----┐.|",
    "|.└--------┘.└-┘.└--------┘.|",
    "|...........................|",
    "└---------------------------┘"
];

// turns map array into a map containg only points or empty spaces, which is used to keep track of points

export function generatePointsMapArray() {
    return mapArray.map((currentRow) => {
        let pointsRow = [];
    
        for (let i = 0; i < currentRow.length; i++) {
            if (currentRow[i] === '.') {
                pointsRow.push(currentRow[i])
            } else {
                pointsRow.push(" ")
            }
        }
    
        return pointsRow.join('')
    })
}

const mapAsRows = mapArray.map((row) => {
    return [...row]
})

// set width for map and points canvas
mapCanvas.width = tileSize * mapArray[0].length;
mapCanvas.height = tileSize * mapArray.length;
pointsCanvas.width = tileSize * mapArray[0].length;
pointsCanvas.height = tileSize * mapArray.length;

// initialise map
export function initialiseMap() {
    for (let row = 0; row < mapArray.length; row++) {
        for (let col = 0; col < mapArray[0].length; col++) {
            const char = mapAsRows[row][col]
    
            if (char === '|') {
                mapContext.fillStyle ='#1A2AFF';
                mapContext.fillRect(col * tileSize, row * tileSize - tileSize/3, tileSize /3, tileSize)
            } else if (char === '-') {
                mapContext.fillStyle = '#1A2AFF';
                mapContext.fillRect(col * tileSize - tileSize/3, row * tileSize, tileSize, tileSize /3)
            } else if (char === '┌') {
                mapContext.beginPath();
                mapContext.strokeStyle = '#1A2AFF';
                mapContext.lineWidth = tileSize / 3;
                // Start at the top-right corner of the tile
                mapContext.moveTo(col * tileSize + tileSize / 1.25, row * tileSize + tileSize / 6); // Starting at the top-right corner
                // horizontal line going left
                mapContext.lineTo(col * tileSize + tileSize / 6, row * tileSize + tileSize / 6);
                // vertical line going down
                mapContext.lineTo(col * tileSize + tileSize / 6, row * tileSize + tileSize / 1.25);
                mapContext.stroke();
            } else if (char === '┐') {
                mapContext.beginPath();
                mapContext.strokeStyle = '#1A2AFF';
                mapContext.lineWidth = tileSize / 3;
                // Start at the top-left corner of the tile
                mapContext.moveTo(col * tileSize - tileSize / 3, row * tileSize + tileSize / 6); // Starting at the top-right corner
                // horizontal line going right
                mapContext.lineTo(col * tileSize + tileSize / 6, row * tileSize + tileSize / 6);
                // vertical line going down
                mapContext.lineTo(col * tileSize + tileSize / 6, row * tileSize + tileSize / 1.25);
                mapContext.stroke();
            } else if (char === '└') {
                mapContext.beginPath();
                mapContext.strokeStyle = '#1A2AFF';
                mapContext.lineWidth = tileSize / 3;
                // Start at the bottom-right corner of the tile
                mapContext.moveTo(col * tileSize + tileSize / 1.25, row * tileSize + tileSize / 6); // Starting at the top-right corner
                // horizontal line going left
                mapContext.lineTo(col * tileSize + tileSize / 6, row * tileSize + tileSize / 6);
                // vertical line going up
                mapContext.lineTo(col * tileSize + tileSize / 6, row * tileSize - tileSize / 3);
                mapContext.stroke();
            } else if (char === '┘') {
                mapContext.beginPath();
                mapContext.strokeStyle = '#1A2AFF';
                mapContext.lineWidth = tileSize / 3;
                // Start at the bottom-left corner of the tile
                mapContext.moveTo(col * tileSize - tileSize / 3, row * tileSize + tileSize / 6); // Starting at the top-right corner
                // horizontal line going right
                mapContext.lineTo(col * tileSize + tileSize / 6, row * tileSize + tileSize / 6);
                // vertical line going up
                mapContext.lineTo(col * tileSize + tileSize / 6, row * tileSize - tileSize / 3);
                mapContext.stroke();
            } else if (char === ' ') {
                mapContext.fillStyle = 'black';
                mapContext.fillRect(col * tileSize / 1, row * tileSize, tileSize, tileSize)
            } else if (char === '.') { // centering might need adjustment
                addToTotalPointsOnMap();
                pointsContext.fillStyle = 'yellow';
                pointsContext.fillRect(col * tileSize + 1.5, row * tileSize + 1, tileSize / 4, tileSize / 4)
            }
            else {
                mapContext.fillStyle = 'red';
            }
    
        }
    }
}