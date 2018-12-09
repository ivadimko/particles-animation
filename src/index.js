import * as THREE from 'three';
import { TweenLite, Power4 } from 'gsap/TweenLite';
import matterhorn from './images/matterhorn-particles.png';
import vertex from './shaders/vertex.glsl';
import fragment from './shaders/fragment.glsl';
import perlinNoise from './perlinNoise';
import './styles/main.scss';

const dpi = window.devicePixelRatio;

let vw = window.innerWidth;
let vh = window.innerHeight;

let aspect = vw / vh;
let imageAspect = 1;

const renderer = new THREE.WebGLRenderer({
  alpha: true,
});

renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(dpi);

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  70,
  aspect,
  0.001, 100,
);

camera.position.z = 1;

scene.add(camera);

const geometry = new THREE.BufferGeometry();
const material = new THREE.ShaderMaterial({
  uniforms: {
    time: { type: 'f', value: 1 },
    progress: { type: 'f', value: 0 },
  },
  vertexShader: vertex,
  fragmentShader: fragment,
  transparent: true,
});

let mesh = null;

const update = () => {
  material.uniforms.time.value += 0.01;
};

const resize = () => {
  vw = window.innerWidth;
  vh = window.innerHeight;

  renderer.setSize(vw, vh);

  aspect = vw / vh;
  camera.aspect = aspect;

  const dist = camera.position.z - mesh.position.z;

  const height = 1;

  camera.fov = 2 * (180 / Math.PI) * Math.atan(height / (2 * dist));

  mesh.scale.x = imageAspect * 0.5;
  mesh.scale.y = 0.5;


  camera.updateProjectionMatrix();
};

const render = () => {
  update();
  requestAnimationFrame(render);

  renderer.render(scene, camera);
};

const init = (imageData) => {
  const positions = [];
  const noisePos = [];
  const colors = [];
  const { data, width, height } = imageData;
  let i = 0;
  let j = 0;
  for (let x = 0; x < width; x += 1) {
    i += 0.01;
    for (let y = 0; y < height; y += 1) {
      j += 0.01;
      const coord = (x * 4 + y * 4 * width);
      const point = {
        r: data[coord] / 255,
        g: data[coord + 1] / 255,
        b: data[coord + 2] / 255,
        a: data[coord + 3] / 255,
      };
      if (point.a > 0) {
        positions.push((x - width / 2) / width, (-y + height / 2) / height, point.a);
        noisePos.push(
          2 - perlinNoise(Math.sin(i), Math.cos(j), i + j / 2) * 4,
          4 - perlinNoise(Math.sin(j), Math.cos(i), j + i / 2) * 8,
          2 - perlinNoise(Math.sin(j), Math.cos(i), j + i / 2) * 4,
        );
        colors.push(point.r, point.g, point.b, point.a * 5);
      }
    }
  }

  geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.addAttribute('noise', new THREE.Float32BufferAttribute(noisePos, 3));
  geometry.addAttribute('color', new THREE.Float32BufferAttribute(colors, 4));

  mesh = new THREE.Points(geometry, material);

  scene.add(mesh);

  resize();
  window.addEventListener('resize', resize);

  requestAnimationFrame(render);
};

const image = new Image();

image.addEventListener('load', () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const { width, height } = image;
  imageAspect = width / height;
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(image, 0, 0);
  init(ctx.getImageData(0, 0, width, height));

  let reverse = false;
  document.body.addEventListener('click', () => {
    if (reverse) {
      reverse = false;
      TweenLite.to(material.uniforms.progress, 3, { value: 0 });
    } else {
      reverse = true;
      TweenLite.to(material.uniforms.progress, 3, { value: 1, ease: Power4.easeInOut });
    }
  });
});

image.src = matterhorn;
