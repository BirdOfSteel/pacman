import { ctx, canvas } from '../ctx.js';

export const tileSize = 28;

export let mapArray = [
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

const mapAsRows = mapArray.map((row) => {
    return [...row]
})

canvas.width = tileSize * mapArray[0].length;
canvas.height = tileSize * mapArray.length;

// initialise map
export function initialiseMap() {
    for (let row = 0; row < mapArray.length; row++) {
        for (let col = 0; col < mapArray[0].length; col++) {
            const char = mapAsRows[row][col]
    
            if (char === '|') {
                ctx.fillStyle ='#1A2AFF';
                ctx.fillRect(col * tileSize, row * tileSize - tileSize/3, tileSize /3, tileSize)
            } else if (char === '-') {
                ctx.fillStyle = '#1A2AFF';
                ctx.fillRect(col * tileSize - tileSize/3, row * tileSize, tileSize, tileSize /3)
            } else if (char === '┌') {
                ctx.beginPath();
                ctx.strokeStyle = '#1A2AFF';
                ctx.lineWidth = tileSize / 3;
                // Start at the top-right corner of the tile
                ctx.moveTo(col * tileSize + tileSize / 1.25, row * tileSize + tileSize / 6); // Starting at the top-right corner
                // horizontal line going left
                ctx.lineTo(col * tileSize + tileSize / 6, row * tileSize + tileSize / 6);
                // vertical line going down
                ctx.lineTo(col * tileSize + tileSize / 6, row * tileSize + tileSize / 1.25);
                ctx.stroke();
            } else if (char === '┐') {
                ctx.beginPath();
                ctx.strokeStyle = '#1A2AFF';
                ctx.lineWidth = tileSize / 3;
                // Start at the top-left corner of the tile
                ctx.moveTo(col * tileSize - tileSize / 3, row * tileSize + tileSize / 6); // Starting at the top-right corner
                // horizontal line going right
                ctx.lineTo(col * tileSize + tileSize / 6, row * tileSize + tileSize / 6);
                // vertical line going down
                ctx.lineTo(col * tileSize + tileSize / 6, row * tileSize + tileSize / 1.25);
                ctx.stroke();
            } else if (char === '└') {
                ctx.beginPath();
                ctx.strokeStyle = '#1A2AFF';
                ctx.lineWidth = tileSize / 3;
                // Start at the bottom-right corner of the tile
                ctx.moveTo(col * tileSize + tileSize / 1.25, row * tileSize + tileSize / 6); // Starting at the top-right corner
                // horizontal line going left
                ctx.lineTo(col * tileSize + tileSize / 6, row * tileSize + tileSize / 6);
                // vertical line going up
                ctx.lineTo(col * tileSize + tileSize / 6, row * tileSize - tileSize / 3);
                ctx.stroke();
            } else if (char === '┘') {
                ctx.beginPath();
                ctx.strokeStyle = '#1A2AFF';
                ctx.lineWidth = tileSize / 3;
                // Start at the bottom-left corner of the tile
                ctx.moveTo(col * tileSize - tileSize / 3, row * tileSize + tileSize / 6); // Starting at the top-right corner
                // horizontal line going right
                ctx.lineTo(col * tileSize + tileSize / 6, row * tileSize + tileSize / 6);
                // vertical line going up
                ctx.lineTo(col * tileSize + tileSize / 6, row * tileSize - tileSize / 3);
                ctx.stroke();
            } else if (char === ' ') {
                ctx.fillStyle = 'black';
                ctx.fillRect(col * tileSize / 1, row * tileSize, tileSize, tileSize)
            } else if (char === '.') { // probs needs centering
                ctx.fillStyle = 'yellow';
                ctx.fillRect(col * tileSize + 1.5, row * tileSize + 1, tileSize / 4, tileSize / 4)
            }
            else {
                ctx.fillStyle = 'red';
            }
    
        }
    }
}