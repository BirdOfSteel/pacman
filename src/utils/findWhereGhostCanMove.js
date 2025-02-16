import isNextPositionValid from "./isNextPositionValid.js";

export default function findWhereGhostCanMove(posX, posY) {
    const directionsArray = [ 
        {x: 1, y:0}, 
        {x:-1, y:0}, 
        {x:0, y:1}, 
        {x:0, y:-1} 
    ]

    let allowedCoordinatesArray = [];

    for (let i = 0; i < directionsArray.length; i++) {
        const nextPositionObject = isNextPositionValid(posX, posY, directionsArray[i]);
        if (nextPositionObject.isAllowed) {
            allowedCoordinatesArray.push(nextPositionObject);
        }
    }

    return allowedCoordinatesArray;
}