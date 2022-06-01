import * as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FlyControls } from 'three/examples/jsm/controls/FlyControls'

//define THREEJS presets
export let camera, scene, canvas, controls, renderer, sizes

/**
 * Base
 */
// Canvas
canvas = document.querySelector('canvas.webgl')
console.log(canvas)

// Scene
scene = new THREE.Scene()

let devices = [
    {
        'hostname': 'hobgoblin',
        'ipv4': '192.168.1.154',
        'notUnknown': true,
        'group':'',
        'geometry': 2,
        'material': 0x59DD41,
        'position': 1
    },
    {
        'hostname': 'witch-machine',
        'ipv4': '192.168.1.174',
        'notUnknown': true,
        'group':'',
        'geometry': 2,
        'material': 0xff0002,
        'position': 3
    },
    {
        'hostname': 'constant',
        'ipv4': '192.168.1.164',
        'notUnknown': false,
        'group':'',
        'geometry': 2,
        'material': 0x41DDC5,
        'position': 5
    },
    {
        'hostname': 'centrum',
        'ipv4': '192.168.1.164',
        'notUnknown': false,
        'group':'',
        'geometry': 2,
        'material': 0x5c345b,
        'position': 7
    },
]

/**
 * Object
 */
 const createMesh = function(){
    //Loop through every item in devices
    for(let i = 0; i < devices.length; i++){
        let geometry = new THREE.SphereGeometry(devices[i].geometry, 32, 16) 
        let material = new THREE.MeshBasicMaterial({ color: devices[i].material, wireframe: devices[i].notUnknown })
        let mesh = new THREE.Mesh(geometry, material)
        mesh.name = devices[i].hostname
        mesh.position.set(devices[i].position * devices[i].geometry, 0 , 0)
        scene.add(mesh)
    }
}
createMesh();

// Create mesh array
const mesh = []
scene.traverse(function(child) {
    //if (child instanceof THREE.Mesh) {
    if (child.type === 'Mesh') {
    //append to mesh array
    mesh.push(child)
    }
});
let lastMeshPosition = mesh[mesh.length - 1].position.x;



 /**
 * Sizes
 */
sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
 
 //camera
camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 10 + lastMeshPosition
camera.position.x = 6
scene.add(camera)

//FlyControls
controls = new FlyControls( camera )
controls.movementSpeed = 10;
controls.rollSpeed = Math.PI / 24
controls.autoForward = false
controls.dragToLook = true

/**
 * Fullscreen
 */
window.addEventListener('dblclick', () =>
{
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement

    if(!fullscreenElement)
    {
        if(canvas.requestFullscreen)
        {
            canvas.requestFullscreen()
        }
        else if(canvas.webkitRequestFullscreen)
        {
            canvas.webkitRequestFullscreen()
        }
    }
    else
    {
        if(document.exitFullscreen)
        {
            document.exitFullscreen()
        }
        else if(document.webkitExitFullscreen)
        {
            document.webkitExitFullscreen()
        }
    }
})

/**
 * Renderer
 */
renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.render(scene, camera)


//Animtions 
const tick = () =>
{
    //Update objects
    for (let i = 0; i < mesh.length; i++ ){
        mesh[i].rotation.y += 0.005    
    }
    

    //Render
    renderer.render(scene, camera)

    controls.update(0.01)

    window.requestAnimationFrame(tick)


}
tick()

