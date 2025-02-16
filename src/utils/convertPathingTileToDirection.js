export default function convertPathingTileToDirection(posX, posY, pathX, pathY) {
    let direction = {x: 0, y: 0};
    let oppositeDirection = {x: 0, y: 0};
    
    
    if (posX > pathY) {
        direction.x = -1;
        oppositeDirection.x = 1;
    } else if (posX < pathY) {
        direction.x = 1;
        oppositeDirection.x = -1;
    }

    if (posY > pathX) {
        direction.y = -1;
        oppositeDirection.y = 1;
    } else if (posY < pathX) {
        direction.y = 1;
        oppositeDirection.y = -1;
    }

    return { direction, oppositeDirection }
}