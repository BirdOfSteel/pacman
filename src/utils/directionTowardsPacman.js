import { pacman } from "../classes/Pacman.js";

export default function directionTowardsPacman(ghostX, ghostY) {
    let myDirection = {x: 0, y: 0};
    
    // Horizontal movement (X-axis)
    if (pacman.posX > ghostX) {
        myDirection.x = 1;  // Move right
    } else if (pacman.posX < ghostX) {
        myDirection.x = -1; // Move left
    }

    // Vertical movement (Y-axis)
    if (pacman.posY > ghostY) {
        myDirection.y = 1;  // Move down
    } else if (pacman.posY < ghostY) {
        myDirection.y = -1; // Move up
    }

    return myDirection;
}