const filters = document.querySelector('.filters');
const track = document.querySelector('#project-cards');
const projects = [...track.querySelectorAll('[data-area]')];
const controls = document.querySelector('.carousel-controls');
const previous = document.querySelector('#previous-project');
const next = document.querySelector('#next-project');
const position = document.querySelector('#project-position');
const noMatches = document.querySelector('#no-matching-projects');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

let visibleProjects = projects;
let scrollFrame = 0;

function activeIndex() {
  const range = track.scrollWidth - track.clientWidth;
  return range > 0 ? Math.round(track.scrollLeft / range * (visibleProjects.length - 1)) : 0;
}

function updateControls() {
  const index = activeIndex();
  const text = `${index + 1} of ${visibleProjects.length}`;
  if (position.textContent !== text) position.textContent = text;
  previous.setAttribute('aria-disabled', String(index <= 0));
  next.setAttribute('aria-disabled', String(index >= visibleProjects.length - 1));
}

function goTo(index) {
  if (index < 0 || index >= visibleProjects.length || index === activeIndex()) return;
  const range = track.scrollWidth - track.clientWidth;
  track.scrollTo({
    left: range * index / (visibleProjects.length - 1),
    behavior: reducedMotion.matches ? 'instant' : 'smooth'
  });
}

filters.hidden = projects.length === 0;
controls.hidden = projects.length === 0;
if (projects.length) updateControls();

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
  visibleProjects = projects.filter(project => !project.hidden);
  track.hidden = visibleProjects.length === 0;
  controls.hidden = track.hidden;
  noMatches.hidden = !track.hidden;
  document.querySelector('#project-count').textContent = `${visibleProjects.length} projects shown.`;
  track.scrollTo({left: 0, behavior: 'instant'});
  if (visibleProjects.length) updateControls();
});

previous.addEventListener('click', () => goTo(activeIndex() - 1));
next.addEventListener('click', () => goTo(activeIndex() + 1));

track.addEventListener('keydown', event => {
  if (event.target !== track || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const targets = {
    ArrowLeft: activeIndex() - 1,
    ArrowRight: activeIndex() + 1,
    Home: 0,
    End: visibleProjects.length - 1
  };
  if (!Object.hasOwn(targets, event.key)) return;
  event.preventDefault();
  goTo(targets[event.key]);
});

track.addEventListener('scroll', () => {
  if (scrollFrame || !visibleProjects.length) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    if (visibleProjects.length) updateControls();
  });
}, {passive: true});

new ResizeObserver(() => {
  if (visibleProjects.length) updateControls();
}).observe(track);
