import * as THREE from 'three';

export function createCamera(gameWindow) {
    const DE2RAD = Math.PI / 180;

    const LEFT_MOUSE_BUTTON = 0;
    const MIDDLE_MOUSE_BUTTON = 1;
    const RIGHT_MOUSE_BUTTON = 2;

    const MIN_CAMERA_RADIUS = 10;
    const MAX_CAMERA_RADIUS = 20;
    const MIN_CAMERA_ELEVATION = 30;
    const MAX_CAMERA_ELEVATION = 90;
    const ROTATION_SESITIVITY = 0.5;
    const ZOOM_SESITIVITY = 0.02;
    const PAN_SESITIVITY = -0.01;

    const Y_AXIS = new THREE.Vector3(0, 1, 0);

    const camera = new THREE.PerspectiveCamera(75, gameWindow.offsetWidth / gameWindow.offsetHeight, 0.1, 1000);
    let cameraOrigin = new THREE.Vector3();
    let cameraRadius = (MIN_CAMERA_RADIUS + MAX_CAMERA_RADIUS) / 2;
    let cameraAzimuth = 135;
    let cameraElevation = 45;
    let isLeftMouseDown = false;
    let isRightMouseDown = false;
    let isMiddleMouseDown = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    updateCameraPosition();

    function onMouseDown(event) {
        if(event.button === LEFT_MOUSE_BUTTON) {
            isLeftMouseDown = true;
        } else if(event.button === RIGHT_MOUSE_BUTTON) {    
            isRightMouseDown = true;
        } else if(event.button === MIDDLE_MOUSE_BUTTON) {
            isMiddleMouseDown = true;
        }
    }

    function onMouseUp(event) {
        if(event.button === LEFT_MOUSE_BUTTON) {
            isLeftMouseDown = false;
        } else if(event.button === RIGHT_MOUSE_BUTTON) {
            isRightMouseDown = false;
        } else if(event.button === MIDDLE_MOUSE_BUTTON) {    
            isMiddleMouseDown = false; 
        }
    }

    function onMouseMove(event) {
        console.log("mouse move");

        const deltaX = event.clientX - prevMouseX;
        const deltaY = event.clientY - prevMouseY;

        // Rotate the camera
        if(isLeftMouseDown) {
            cameraAzimuth += (deltaX * ROTATION_SESITIVITY);
            cameraElevation += (deltaY * ROTATION_SESITIVITY);
            cameraElevation = Math.min(MAX_CAMERA_ELEVATION, Math.max(MIN_CAMERA_ELEVATION, cameraElevation));
            updateCameraPosition();
        }

        // Zoom the camera
        if(isRightMouseDown) {
            cameraRadius += deltaY * ZOOM_SESITIVITY;
            cameraRadius = Math.min(MAX_CAMERA_RADIUS, Math.max(MIN_CAMERA_RADIUS, cameraRadius));
            updateCameraPosition();
        }

        // Pan the camera
        if(isMiddleMouseDown) {
            const forward = new THREE.Vector3(0, 0, 1).applyAxisAngle(Y_AXIS, cameraAzimuth * DE2RAD);
            const left = new THREE.Vector3(1, 0, 0).applyAxisAngle(Y_AXIS, cameraAzimuth * DE2RAD);
            cameraOrigin.add(forward.multiplyScalar(deltaY * PAN_SESITIVITY));
            cameraOrigin.add(left.multiplyScalar(deltaX * PAN_SESITIVITY));
            updateCameraPosition();
        }

        prevMouseX = event.clientX;
        prevMouseY = event.clientY;
    }

    function updateCameraPosition() {
        camera.position.x = cameraRadius * Math.sin(cameraAzimuth * DE2RAD) * Math.cos(cameraElevation * DE2RAD);
        camera.position.y = cameraRadius * Math.sin(cameraElevation * DE2RAD);
        camera.position.z = cameraRadius * Math.cos(cameraAzimuth * DE2RAD) * Math.cos(cameraElevation * DE2RAD);
        camera.position.add(cameraOrigin);
        camera.lookAt(cameraOrigin);
        camera.updateMatrix();
    }

    return {
        camera,
        onMouseDown,
        onMouseUp,
        onMouseMove
    }
}