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

// A toroidal helix, projected from 3D. Draw the far turns first so the
// overlapping strands read as a single winding.
const canvas = document.querySelector('.wireframe');
const brush = canvas.getContext('2d');

if (brush) {
  const hero = canvas.closest('.hero');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const turns = [];
  const segments = 100;
  const samples = 16;
  for (let turn = 0; turn < segments; turn++) {
    const points = [];
    for (let step = 0; step <= samples; step++) {
      const t = (turn + step / samples) / segments * 2 * Math.PI;
      const winding = t * segments;
      const radius = 1 + 0.39 * Math.cos(winding);
      points.push([radius * Math.cos(t), radius * Math.sin(t), 0.39 * Math.sin(winding)]);
    }
    turns.push(points);
  }

  let frame = 0;
  let pointerX = 0;
  let pointerY = 0;
  function draw() {
    frame = 0;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const resolution = Math.min(devicePixelRatio, 2);
    const pixelWidth = Math.round(width * resolution);
    const pixelHeight = Math.round(height * resolution);
    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    brush.setTransform(resolution, 0, 0, resolution, 0, 0);
    brush.clearRect(0, 0, width, height);
    const pitch = 0.95 + pointerY * 0.34;
    const tilt = -0.55 + pointerX * 0.38;
    const scale = width * 0.31;
    const projected = turns.map(points => {
      const path = new Path2D();
      let depth = 0;
      points.forEach(([x, y, z], i) => {
        const vertical = y * Math.cos(pitch) - z * Math.sin(pitch);
        depth += y * Math.sin(pitch) + z * Math.cos(pitch);
        const px = width / 2 + scale * (x * Math.cos(tilt) - vertical * Math.sin(tilt));
        const py = height / 2 + scale * (x * Math.sin(tilt) + vertical * Math.cos(tilt));
        if (i === 0) path.moveTo(px, py);
        else path.lineTo(px, py);
      });
      return {path, depth: depth / points.length};
    });
    projected.sort((a, b) => a.depth - b.depth);
    for (const {path, depth} of projected) {
      brush.strokeStyle = 'hsl(148 25% ' + (42 - 22 * depth) + '%)';
      brush.lineWidth = Math.max(0.85, width / 340);
      brush.stroke(path);
    }
  }
  function scheduleDraw() {
    if (!frame) frame = requestAnimationFrame(draw);
  }
  function reset() {
    pointerX = pointerY = 0;
    scheduleDraw();
  }
  function follow(event) {
    if (reducedMotion.matches) return;
    const bounds = hero.getBoundingClientRect();
    pointerX = 2 * (event.clientX - bounds.left) / bounds.width - 1;
    pointerY = 2 * (event.clientY - bounds.top) / bounds.height - 1;
    scheduleDraw();
  }

  canvas.hidden = false;
  hero.addEventListener('pointermove', follow);
  hero.addEventListener('pointerdown', follow);
  hero.addEventListener('pointerleave', event => {
    if (event.pointerType !== 'touch') reset();
  });
  hero.addEventListener('pointercancel', reset);
  reducedMotion.addEventListener('change', reset);
  new ResizeObserver(scheduleDraw).observe(canvas);
  draw();
}
