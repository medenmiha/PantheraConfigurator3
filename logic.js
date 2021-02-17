import * as THREE from 'https://threejs.org/build/three.module.js';

import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'https://threejs.org/examples/jsm/loaders/RGBELoader.js';
import { RoughnessMipmapper } from 'https://threejs.org/examples/jsm/utils/RoughnessMipmapper.js';

var container, controls, controls1;
var camera, scene, renderer, mixer, clock, camera1;
var exteriorCamera, interiorCamera, selectedCamera, selectedControls;
var action1, action2, action3, clip1, clip2, clip3;
var cameraPosition = { x : 0, y: 0, z: 0 };
var pogoj = false;
var cameraLook = new THREE.Vector3(0, 0, 0);  //

var partsArray = []; //



scene = new THREE.Scene();
clock = new THREE.Clock();

//CAMERAS
exteriorCamera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.25, 20 );
interiorCamera = new THREE.PerspectiveCamera( 65, window.innerWidth / window.innerHeight, 0.25, 20 );

selectedCamera = exteriorCamera;

container = document.createElement( 'div' );
document.body.appendChild( container );

renderer = new THREE.WebGLRenderer( { antialias: false } );  //true
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.8;
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild( renderer.domElement );

controls = new OrbitControls( selectedCamera, renderer.domElement );
controls.minDistance = 2;
controls.maxDistance = 10
controls.target.set( 0, 0, 0 );

//exteriorConfiguration(); //Default start from outside configuration

new RGBELoader()
  .setDataType( THREE.UnsignedByteType )
  .setPath( 'https://threejs.org/examples/textures/equirectangular/' )
  .load( 'venice_sunset_1k.hdr', function ( texture ) {

    var envMap = pmremGenerator.fromEquirectangular( texture ).texture;

    scene.background = envMap;
    scene.environment = envMap;

    texture.dispose();
    pmremGenerator.dispose();

    // model

    // use of RoughnessMipmapper is optional

    } );

var roughnessMipmapper = new RoughnessMipmapper( renderer );

var loader = new GLTFLoader();
loader.load( 'datoteke/pantherav7.gltf', function ( gltf ) {

        //window.alert(camera.target);
        //camera.position = gltf.cameras[0].position;

    

      gltf.scene.traverse( function ( child ) {

        partsArray.push(child);  //

        if ( child.isMesh ) {
          roughnessMipmapper.generateMipmaps( child.material );                      
          }
        } );
        
        scene.add( gltf.scene );
        
        //partsArray[100].visible = false;
        console.log("5") // 
        roughnessMipmapper.dispose();
        
        mixer = new THREE.AnimationMixer( gltf.scene );
        clip1 = gltf.animations[ 1 ];
        action1 = mixer.clipAction(clip1);
		
		    clip2 = gltf.animations[ 0 ];
		    action2 = mixer.clipAction(clip2);
		        
        clip3 = gltf.animations[ 2 ];
		    action3 = mixer.clipAction(clip3);
		       
        
      } );
 
var pmremGenerator = new THREE.PMREMGenerator( renderer );
pmremGenerator.compileEquirectangularShader();
  
controls.update();

window.addEventListener( 'resize', onWindowResize, false );

function onWindowResize() {

  selectedCamera.aspect = window.innerWidth / window.innerHeight;
  selectedCamera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {
  
  requestAnimationFrame( animate );
  
  var delta = clock.getDelta();
  
  if ( mixer ) mixer.update( delta );
	
  TWEEN.update();

  //console.log(cameraPosition);

  if ( pogoj ){
     selectedCamera.position.set( cameraPosition.x, cameraPosition.y, cameraPosition.z );
     selectedCamera.lookAt(cameraLook);
  }
  renderer.render( scene, selectedCamera );
}

function exteriorConfiguration(){

  pogoj = true;
  selectedCamera = exteriorCamera;

  cameraLook.x=0;
  cameraLook.y=0;
  cameraLook.z=2;

  controls.target.set( 0, 0, 2 );

  var target2 =  { x : -5, y:1.3, z: -5 };
  cameraPosition.x = selectedCamera.position.x
  cameraPosition.y = selectedCamera.position.y
  cameraPosition.z = selectedCamera.position.z

  const tween = new TWEEN.Tween(cameraPosition ).to(target2, 2000); //
  tween.start();
  setTimeout(() => {
    pogoj = false;
  }, 2000)
   
}

function seatsConfiguration(){

  action1.clampWhenFinished = true;
	action1.loop = THREE.LoopOnce;
  action1.play();

  action2.clampWhenFinished = true;
  action2.loop = THREE.LoopOnce;
  action2.play();

  action3.clampWhenFinished = true;
  action3.loop = THREE.LoopOnce;
  action3.play();

  pogoj = true;
  selectedCamera = exteriorCamera;

  var target1 =  { x : -2, y: 1.37, z: 1.16 };
  cameraPosition.x = selectedCamera.position.x
  cameraPosition.y = selectedCamera.position.y
  cameraPosition.z = selectedCamera.position.z
  const tween = new TWEEN.Tween(cameraPosition ).to(target1, 2000); //
  tween.start();
  setTimeout(() => {
    pogoj = false;
  }, 2000)
  
}


//Trenutno za rezervo
function interiorConfiguration(){
  interiorCamera.position.set( - 1, 0.6, -4 );
}

//NAVIGATION BUTTONS

document.getElementById("exteriorSection").onclick = function() {
  exteriorConfiguration();
};

document.getElementById("seatsSection").onclick = function() {
  seatsConfiguration();
};

document.getElementById("testIzbireSedezev").onclick = function() {

};

document.getElementById("slikaModra").onclick = function() {
  //preklop v modro
  partsArray[34].visible = false;
  partsArray[36].visible = false;  //prednjiSedezDesniPanthera2
  partsArray[35].visible = false;  //prednjiSedezLeviPanthera2 problem
};

document.getElementById("slikaRdeca").onclick = function() {
  //preklop v rdeco
  partsArray[34].visible = true;
  partsArray[36].visible = true;  //prednjiSedezDesniPanthera2
  partsArray[35].visible = true;  //prednjiSedezLeviPanthera2 problem

};

document.getElementById("oranznaPanthera").onclick = function() {
  partsArray[33].visible = true; //skinPanthera4  
  partsArray[32].visible = false; //skinPanthera3
  partsArray[31].visible = false; //skinPanthera2
};

document.getElementById("zelenaPanthera").onclick = function() {
  partsArray[33].visible = false; //skinPanthera4  
  partsArray[32].visible = true; //skinPanthera3
  partsArray[31].visible = false; //skinPanthera2
};

document.getElementById("modraPanthera").onclick = function() {
  partsArray[33].visible = false; //skinPanthera4  
  partsArray[32].visible = false; //skinPanthera3
  partsArray[31].visible = true; //skinPanthera2
};

document.getElementById("vijolicnaPanthera").onclick = function() {
  partsArray[33].visible = false; //skinPanthera4  
  partsArray[32].visible = false; //skinPanthera3
  partsArray[31].visible = false; //skinPanthera2
};

animate();


  //var target =  { x : 0, y: 0, z: 0 };
  //const tween = new TWEEN.Tween(position).to(target, 2000); //
  //tween.start();

