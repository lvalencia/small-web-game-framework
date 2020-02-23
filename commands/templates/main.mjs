import THREE from './dependencies/three.mjs';
import Stats from './dependencies/stats.mjs';
import * as dat from './dependencies/dat.gui.mjs';
import {AxisGridHelper} from './helpers/axisGridHelper.mjs';

const canvas = document.getElementById('scene');
const context = canvas.getContext('webgl2');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xf0ead6);
const cameraFOV = 75;
const cameraAspect = window.innerWidth / window.innerHeight;
const cameraNearClipping = 0.1;
const cameraFarClipping = 10;
const camera = new THREE.PerspectiveCamera(
    cameraFOV,
    cameraAspect,
    cameraNearClipping,
    cameraFarClipping
);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({context, canvas});
renderer.setSize(window.innerWidth, window.innerHeight, false);

function Statistics() {
    const stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0';
    stats.domElement.style.left = '0';
    return stats;
}

const stats = Statistics();
document.body.appendChild(stats.domElement);

function adjustView({canvas, renderer, camera}) {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width !== canvas.width || height !== canvas.height) {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height, false);
    }
}

const gui = new dat.GUI();

function makeAxisGrid(node, label, units) {
    const helper = new AxisGridHelper(node, units);
    gui.add(helper, 'visible').name(label);
}

const light =  new THREE.DirectionalLight(0xffffff, 1);
light.position.set(-1, 2, 4);
scene.add(light);

const unit = 1;
const boxBufferGeometry = new THREE.BoxBufferGeometry(unit, unit, unit);
const boxMaterial = new THREE.MeshPhongMaterial({
    color: 0xff0000
});
const box = new THREE.Mesh(boxBufferGeometry, boxMaterial);
scene.add(box);
makeAxisGrid(box, 'box');

function animate(time) {
    time *= 0.001;
    adjustView({canvas, renderer, camera});

    box.rotation.x = time;
    box.rotation.y = time;

    renderer.render(scene, camera);

    stats.update();
    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);