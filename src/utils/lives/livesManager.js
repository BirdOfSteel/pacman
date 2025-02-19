import { livesCanvas, livesContext, mapCanvas } from "../../ctx.js";

export let pacmanLives = 3;
const offsetX = mapCanvas.width - 25; // offset sprites x
const offSetY = 120; // offset sprites y
const spacing = 40; // spacing between sprites

export function livesManager() {
    livesCanvas.width = mapCanvas.width;
    renderLives();
}

export function resetLives() {
    pacmanLives = 3;
    renderLives();
}

export function addOneLife(num = 1) {
    pacmanLives += num;
    renderLives();
}

export function subtractLife(num = 1) {
    pacmanLives -= num;
    renderLives();
}

function drawPacman(x, y) {
    livesContext.fillStyle = 'yellow';
    livesContext.beginPath();
    livesContext.moveTo(x, y);
    livesContext.arc(
        x, 
        y, 
        15, // radius
        Math.PI * 0.25, // mouth
        Math.PI * 1.75
    );
    livesContext.closePath();
    livesContext.fill();
}

function renderLives() {
    let renderLimit = pacmanLives > 9 ? 9 : pacmanLives - 1; // controls max lives rendered
    
    livesContext.clearRect(0, 0, livesCanvas.width, livesCanvas.height);

    for (let i = 0; i < renderLimit; i++) {
        drawPacman(offsetX - i * spacing, offSetY);
    }
}
