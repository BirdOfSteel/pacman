const map = [
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
    "     |.|| ┌--   --┐ ||.|     ",
    "-----┘.└┘ |       | └┘.└-----",
    "      .   |       |   .      ",
    "-----┐.┌┐ └-------┘ ┌┐.┌-----",
    "     |.||           ||.|     ",
    "     |.|| ┌-------┐ ||.|     ",
    "     |.|| |       | ||.|     ",
    "┌----┘.└┘ └--┐ ┌--┘ └┘.└----┐",
    "|............| |............|",
    "|.┌--┐.┌---┐.| |.┌---┐.┌--┐.|",
    "|.└-┐|.└---┘.└-┘.└---┘.|┌-┘.|",
    "|o..||........p........||..o|",
    "└-┐.||.┌┐.┌-------┐.┌┐.||.┌-┘",
    "┌-┘.└┘.||.└--┐ ┌--┘.||.└┘.└-┐",
    "|......└┘....| |....└┘......|",
    "|.┌--------┐.| |.┌--------┐.|",
    "|.└--------┘.└-┘.└--------┘.|",
    "|...........................|",
    "└---------------------------┘"
];

class Pacman {
    constructor() {
        this.posX = 14;
        this.posY = 23;
    }

    initialisePosition(ctx) {
        document.getElementById('pacman-container');
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(
            this.posX*tileSize + tileSize/7, // change the '/ 7' to a different number to adjust how pacman is centered 
            this.posY*tileSize + tileSize/7, 
            16, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
    }
    
    moveRight(ctx) {
        ctx.clearRect( // IMPORTANT: this is constantly looped, removing the pixels over pacman. Adjust below values to position where the rectangle should be cut from. 
            this.posX * tileSize - 13, 
            this.posY * tileSize - 12,  
            32, 
            32
        );
        this.posX += 0.01;
        this.initialisePosition(ctx)
    }
}

const pacman = new Pacman()
  
const canvas = document.getElementById('game-container');
const ctx = canvas.getContext('2d');

const tileSize = 28;

canvas.width = tileSize * map[0].length;
canvas.height = tileSize * map.length;

const mapAsRows = map.map((row) => {
    return [...row]
})

// initialise map
for (let row = 0; row < map.length; row++) {
    for (let col = 0; col < map[0].length; col++) {
        const char = mapAsRows[row][col]

        if (char === '|') {
            ctx.fillStyle = 'blue';
            ctx.fillRect(col * tileSize, row * tileSize - tileSize/3, tileSize /3, tileSize)
        } else if (char === '-') {
            ctx.fillStyle = 'blue';
            ctx.fillRect(col * tileSize - tileSize/3, row * tileSize, tileSize, tileSize /3)
        } else if (char === '┌') {
            ctx.beginPath();
            ctx.strokeStyle = 'blue';
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
            ctx.strokeStyle = 'blue';
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
            ctx.strokeStyle = 'blue';
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
            ctx.strokeStyle = 'blue';
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
            ctx.fillRect(col * tileSize, row * tileSize, tileSize / 4, tileSize / 4)
        }
        else {
            ctx.fillStyle = 'red';
        }

    }
}

pacman.initialisePosition(ctx)

function gameLoop() {
    pacman.moveRight(ctx);
    console.log(Number.isInteger(pacman.posX*tileSize) ? pacman.posX*tileSize : '')
    requestAnimationFrame(gameLoop)
}

gameLoop();