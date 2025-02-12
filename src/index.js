const mapArray = [
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
    "|     .   |       |   .     |",
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
    "|......||....| |....||......|",
    "|.┌----┘└--┐.| |.┌--┘└----┐.|",
    "|.└--------┘.└-┘.└--------┘.|",
    "|...........................|",
    "└---------------------------┘"
];

let points = 0;

function isNextPositionValid(posX, posY, direction) {
    const nextPositionInArray = mapArray[posY + direction.y][posX + direction.x];
    let isNextPositionTrue = true;

    switch (nextPositionInArray) {
        case '|':
            isNextPositionTrue = false;
            break;
        case '-':
            isNextPositionTrue = false;
            break;
        case '└':
            isNextPositionTrue = false;
            break;
        case '┘':
            isNextPositionTrue = false;
            break;
        case '┌':
            isNextPositionTrue = false;
            break;
        case '┐':
            isNextPositionTrue = false;
            break;
    }

    if (direction == {x: 0, y: 0}) {
        isNextPositionTrue = false;
    }


    return { isNextPositionTrue, nextPositionInArray };
}

class Pacman {
    constructor() {
        this.posX = 14;
        this.posY = 23;
        this.nextPosition = null;
        this.direction = {x: 1, y: 0};
        this.queuedDirection = {x: 0, y: 0};
    }

    initialisePosition(ctx) {
        document.getElementById('pacman-container');
        ctx.fillStyle = 'green';
        ctx.beginPath();
        ctx.arc(
            this.posX*tileSize + 5, 
            this.posY*tileSize + 4, 
            16, 
            0, 
            Math.PI * 2
        );
        ctx.fill();
    }

    move(ctx) {
        const nextPosition = isNextPositionValid(this.posX,this.posY, this.direction);
        const nextQueuedPosition = isNextPositionValid(this.posX, this.posY, this.queuedDirection); 
    
        const isDirectionEqualToQueuedDirection =
            JSON.stringify(this.direction) === JSON.stringify(this.queuedDirection)

        
        ctx.clearRect( // IMPORTANT: this is constantly looped, removing the pixels over pacman. Adjust below values to position where the rectangle should be cut from. 
            this.posX * tileSize - 11, 
            this.posY * tileSize - 12,  
            32, 
            32
        );

        if (!isDirectionEqualToQueuedDirection && nextQueuedPosition.isNextPositionTrue) {
            this.direction = this.queuedDirection;

            
            ctx.clearRect( // IMPORTANT: this is constantly looped, removing the pixels over pacman. Adjust below values to position where the rectangle should be cut from. 
                this.posX * tileSize - 11, 
                this.posY * tileSize - 12,  
                32, 
                32
            );

            this.posX = this.posX + this.direction.x;
            this.posY = this.posY + this.direction.y;
        } else if (nextPosition.isNextPositionTrue) {


            this.posX = this.posX + this.direction.x;
            this.posY = this.posY + this.direction.y;
        } 

        this.initialisePosition(ctx);
    }
}

const pacman = new Pacman()
  
const canvas = document.getElementById('game-container');
const ctx = canvas.getContext('2d');

const tileSize = 28;

canvas.width = tileSize * mapArray[0].length;
canvas.height = tileSize * mapArray.length;

const mapAsRows = mapArray.map((row) => {
    return [...row]
})

// initialise map
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

pacman.initialisePosition(ctx)

function gameLoop() {
    setInterval(() => pacman.move(ctx), 500)
}

setTimeout(() => {
    gameLoop();
}, 1000)

window.addEventListener('keydown', (e) => {
    e.preventDefault();

    if (e.key === 'ArrowUp' || e.key === 'w') {
        pacman.queuedDirection = {x: 0, y: -1};
        // const { nextPositionInArray } = isNextPositionValid(pacman.posX, pacman.posY, {x: 0, y: -1})
        // console.log(nextPositionInArray)
    } else if (e.key === 'ArrowRight' || e.key === 'd') {
        pacman.queuedDirection = {x: 1, y: 0};

    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        pacman.queuedDirection = {x: -1, y: 0};
        

    } else if (e.key === 'ArrowDown' || e.key === 's') {
        pacman.queuedDirection = {x: 0, y: 1};
    }
})


document.getElementById('points-text').innerHTML = `Points: ${points}`;