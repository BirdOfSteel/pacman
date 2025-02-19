import { ghostArray } from "../classes/Ghost.js";
import hexMixer from "./hexMixer.js";

export default function checkForGhostOverlap(ghost) {
    let isColourMixed = false;
    let mixedColour = null;
    let coloursToMix = [];

    let filteredGhostArray = ghostArray.filter((selectedGhost, i) => { // removes passed in ghost from array
        return selectedGhost === ghost ? false : true;
    })
    
    filteredGhostArray.map((selectedGhost) => {
        if (selectedGhost.posX === ghost.posX && selectedGhost.posY === ghost.posY) {
            coloursToMix.push(selectedGhost.colour);
            coloursToMix.push(ghost.colour)
            isColourMixed = true;
        }
    });

    if (coloursToMix.length == 2) { // will only mix colours if there's two ghosts overlapping, as function only works with 2.
        mixedColour = hexMixer(coloursToMix[0], coloursToMix[1], 50);
    }

    return {isColourMixed, mixedColour};
}