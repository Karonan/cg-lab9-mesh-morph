import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(30, 20, 25);

renderer.render(scene, camera);
const controls = new OrbitControls(camera, renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight();
scene.add(directionalLight);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

// ------------------------ Geometry & Material ---------------------
const SPHERE_RADIUS = 10;
const sphereGeometry = new THREE.SphereGeometry(SPHERE_RADIUS, 32, 16);
const material = new THREE.MeshStandardMaterial({
  color: 0xff6347,
});
material.side = THREE.DoubleSide;

const boxGeometry = new THREE.BoxGeometry(20, 20, 20, 10, 10, 10);
const boxMaterial = new THREE.MeshStandardMaterial({
  color: 0xfcba03,
});
boxMaterial.side = THREE.DoubleSide;

const sphere = new THREE.Mesh(sphereGeometry, material);
scene.add(sphere);
sphere.visible = false;

// ----------------------- Box to Sphere --------------------------
const boxVertex = boxGeometry.attributes.position;
const boxMorphPosition = new Float32Array(boxVertex.count * 3);
const boxMorphNormal = new Float32Array(boxVertex.count * 3);
for (let i = 0; i < boxVertex.count; i++) {
  const vertex = new THREE.Vector3(
    boxVertex.array[3 * i],
    boxVertex.array[3 * i + 1],
    boxVertex.array[3 * i + 2]
  ).normalize();

  boxMorphNormal[3 * i] = vertex.x;
  boxMorphNormal[3 * i + 1] = vertex.y;
  boxMorphNormal[3 * i + 2] = vertex.z;

  const newVertex = vertex.multiplyScalar(SPHERE_RADIUS);
  boxMorphPosition[3 * i] = newVertex.x;
  boxMorphPosition[3 * i + 1] = newVertex.y;
  boxMorphPosition[3 * i + 2] = newVertex.z;
}
boxGeometry.morphAttributes.position = [];
boxGeometry.morphAttributes.position.push(
  new THREE.BufferAttribute(boxMorphPosition, 3)
);
boxGeometry.morphAttributes.normal = [];
boxGeometry.morphAttributes.normal.push(
  new THREE.BufferAttribute(boxMorphNormal, 3)
);
const box = new THREE.Mesh(boxGeometry, boxMaterial);
box.morphTargetInfluences[0] = 1;
scene.add(box);

// ------------------------ Morphing -------------------------------
const baseVertex = sphereGeometry.attributes.position;
const morphAttr = new Float32Array(baseVertex.count * 3);

// for (let i = 0; i < baseVertex.count; i++) {
//   const ray = new THREE.Raycaster(
//     new THREE.Vector3(0, 0, 0),
//     new THREE.Vector3(
//       baseVertex.array[3 * i],
//       baseVertex.array[3 * i + 1],
//       baseVertex.array[3 * i + 2]
//     ).normalize()
//   );
//   const intersects = ray.intersectObject(box);
//   morphAttr[3 * i] = intersects[0].point.x;
//   morphAttr[3 * i + 1] = intersects[0].point.y;
//   morphAttr[3 * i + 2] = intersects[0].point.z;
// }
// sphereGeometry.morphAttributes.position = [];
// sphereGeometry.morphAttributes.position.push(
//   new THREE.BufferAttribute(morphAttr, 3)
// );

// sphere.morphTargetInfluences[0] = 1.0;
let isMorphing = false;
document.addEventListener("click", () => {
  isMorphing = true;
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  directionalLight.position.copy(camera.position);

  if (box.morphTargetInfluences[0] > 0 && isMorphing) {
    box.morphTargetInfluences[0] -= 0.01;
  } else {
    isMorphing = false;
  }

  renderer.render(scene, camera);
}

animate();
