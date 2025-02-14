import isNextPositionValid from "./isNextPositionValid.js";

export default function findWhereGhostCanMove(posX, posY) {
    const directionsArray = [ 
        {x: 1, y:0}, 
        {x:-1, y:0}, 
        {x:0, y:1}, 
        {x:0, y:-1} 
    ]

    let allowedDirectionsArray = [];
    
    for (let i = 0; i < directionsArray.length; i++) {
        console.log(directionsArray[i])
        console.log(isNextPositionValid(posX, posY, directionsArray[i]))
        if (isNextPositionValid(posX, posY, directionsArray[i]).isNextPositionAllowed) {
            allowedDirectionsArray.push(directionsArray[i]);
        }
    }
    
    console.log(allowedDirectionsArray)
    return allowedDirectionsArray;
}