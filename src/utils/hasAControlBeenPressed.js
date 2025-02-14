export default function hasAControlBeenPressed(keyPress) {
    let keyPressBoolean = false;

    switch (keyPress) {
        case 'ArrowUp': 
        case 'w':
        case 'ArrowLeft':
        case 'a':
        case 'ArrowRight':
        case 'd':
        case 'ArrowDown':
        case 's':
            keyPressBoolean = true;
            break;
    }
    
    return keyPressBoolean;
}
