import { ghostArray } from "../classes/Ghost.js";

export default function generateGhostCanvasArray() {
    let canvasObjectArray = [];
    const mapCanvasHeight = document.getElementById('map-canvas').height;
    const mapCanvasWidth = document.getElementById('map-canvas').width;

    ghostArray.forEach((ghost) => {
        const canvas = document.createElement('canvas');
        const canvasContext = canvas.getContext('2d');

        canvas.height = mapCanvasHeight;
        canvas.width = mapCanvasWidth;

        canvas.id = `${ghost.name}-canvas`;
        canvas.className = `ghostCanvas`;

        ghost.context = canvasContext;

        const canvasObject = {name: ghost.name, canvas: canvas, context: canvasContext};
        canvasObjectArray.push(canvasObject);
    })

    return canvasObjectArray
}