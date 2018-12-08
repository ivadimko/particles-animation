import '@/styles/main.scss';
import Particle from './particle';

const dpi = window.devicePixelRatio;

let vw = window.innerWidth;
let vh = window.innerHeight;
let time = 0;


const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const dots = [];
const count = 5000;

const update = () => {
  time += 0.01;
};

const resize = () => {
  vw = window.innerWidth;
  vh = window.innerHeight;

  canvas.width = vw * dpi;
  canvas.height = vh * dpi;

  canvas.style.width = `${vw}px`;
  canvas.style.height = `${vh}px`;
};

resize();
window.addEventListener('resize', resize);

for (let i = 0; i < count; i += 1) {
  dots.push(new Particle(ctx, Math.random() * vw * dpi, Math.random() * vh * dpi));
}

const render = () => {
  update();
  requestAnimationFrame(render);

  ctx.clearRect(0, 0, vw * dpi, vh * dpi);

  dots.forEach(dot => dot.render(time, vw, vh));
};

requestAnimationFrame(render);
