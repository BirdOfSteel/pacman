export let totalPointsOnMap = 0;
export let pointsCollected = 0;
export let points = 0;

export function addOneToTotalPointsOnMap() {
    totalPointsOnMap += 1;
};

export function resetTotalPointsOnMap() {
    totalPointsOnMap = 0;
};

export function addOneToPointsCollected() {
    pointsCollected += 1;
}

export function resetPointsCollected() {
    pointsCollected = 0;
}

export function addToPoints(pointsToAdd) {
    points += pointsToAdd;
}

export function addGhostToPoints() {
    points += 200;
    document.getElementById('points-text').innerHTML = `Points: ${points}`;
}

export function resetPoints() {
    points = 0;
    pointsCollected = 0;
    resetTotalPointsOnMap();
    document.getElementById('points-text').innerHTML = `Points: ${points}`;
}