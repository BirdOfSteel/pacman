import { ghostArray } from "../../classes/Ghost.js";
import { clearAllIntervals, isGameRunning, pacmanIntervalId, prepareNextLevel, resetGame, setIsGameOver, setIsGameRunning } from "../../index.js";
import { points, pointsCollected, resetPointsCollected, resetTotalPointsOnMap, totalPointsOnMap } from "../points/pointsHandler.js";

export let level = 1;

export default function levelManager() {
    const areAllPointsCollected = pointsCollected === totalPointsOnMap;
    
    return { areAllPointsCollected }
}


export function nextLevel() {
    if (level === 5) { // game won
        clearAllIntervals();
        document.getElementById('game-end-div-text').innerHTML = `YOU WIN!`;
        document.getElementById('game-end-div-points').innerHTML = `Points: ${points}`;
        document.getElementById('game-end-div').style.display = 'flex';
    } else {
        ghostArray.forEach((ghost) => {
            ghost.baseProbabilityOfChase += 0.1;
        })
        
        clearAllIntervals();
        setTimeout(() => {
            level += 1;
            prepareNextLevel();
            document.getElementById('level-text').innerHTML = `Level: ${level}`;
        },3000);
    }
};