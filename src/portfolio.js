const filters = document.querySelector('.filters');
const projects = [...document.querySelectorAll('[data-area]')];
filters.hidden = false;
filters.addEventListener('click', event => {
  const selected = event.target.closest('button[data-filter]');
  if (!selected) return;
  const area = selected.dataset.filter;
  for (const button of filters.querySelectorAll('button')) {
    button.setAttribute('aria-pressed', String(button === selected));
  }
  for (const project of projects) {
    project.hidden = area !== 'all' && !project.dataset.area.split(' ').includes(area);
  }
  const count = projects.filter(project => !project.hidden).length;
  document.querySelector('#project-count').textContent = count + ' projects shown.';
});

const coil = document.querySelector('#coil');
const canvas = document.querySelector('#wave');
const context = canvas.getContext('2d');

function drawSignal() {
  const inductance = Number(coil.value);
  const frequency = 1 / (2 * Math.PI * Math.sqrt(inductance * 1e-6 * 10e-9));
  document.querySelector('#inductance').value = inductance + ' µH';
  document.querySelector('#frequency').value = (frequency / 1000).toFixed(1) + ' kHz';
  coil.setAttribute('aria-valuetext', inductance + ' microhenries');
  if (!context) return;
  const { width, height } = canvas;
  context.clearRect(0, 0, width, height);
  context.strokeStyle = '#c1ee96';
  context.lineWidth = 4;
  context.beginPath();
  for (let x = 0; x <= width; x++) {
    const time = x / width * 25e-6;
    const y = height * (0.5 - 0.39 * Math.sin(2 * Math.PI * frequency * time));
    if (x === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  }
  context.stroke();
}

document.querySelector('.controls').hidden = false;
coil.addEventListener('input', drawSignal);
drawSignal();
