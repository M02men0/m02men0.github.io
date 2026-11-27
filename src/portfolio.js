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
let destination = null;

// Use the browser's gesture boundary where available. Fall back to an idle
// timer on older browsers.
function onScrollFinished(target, callback) {
  if ('onscrollend' in target) {
    target.addEventListener('scrollend', callback);
    return;
  }
  let timer;
  target.addEventListener('scroll', () => {
    clearTimeout(timer);
    timer = setTimeout(callback, 180);
  }, {passive: true});
}

function activeIndex() {
  const range = track.scrollWidth - track.clientWidth;
  return range > 0 ? Math.round(track.scrollLeft / range * (visibleProjects.length - 1)) : 0;
}

function updateControls() {
  const index = activeIndex();
  const text = `${index + 1} of ${visibleProjects.length}`;
  if (position.textContent !== text) position.textContent = text;
  const navigationIndex = destination ?? index;
  previous.setAttribute('aria-disabled', String(navigationIndex <= 0));
  next.setAttribute('aria-disabled', String(navigationIndex >= visibleProjects.length - 1));
}

function goTo(index) {
  if (index < 0 || index >= visibleProjects.length || index === (destination ?? activeIndex())) return;
  destination = index;
  const range = track.scrollWidth - track.clientWidth;
  track.scrollTo({
    left: range * index / (visibleProjects.length - 1),
    behavior: reducedMotion.matches ? 'instant' : 'smooth'
  });
  updateControls();
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
  destination = null;
  track.scrollTo({left: 0, behavior: 'instant'});
  if (visibleProjects.length) updateControls();
});

previous.addEventListener('click', () => goTo((destination ?? activeIndex()) - 1));
next.addEventListener('click', () => goTo((destination ?? activeIndex()) + 1));

track.addEventListener('keydown', event => {
  if (event.target !== track || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  const index = destination ?? activeIndex();
  const targets = {
    ArrowLeft: index - 1,
    ArrowRight: index + 1,
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

function followCarouselPosition() {
  destination = null;
  if (visibleProjects.length) updateControls();
}
onScrollFinished(track, followCarouselPosition);
for (const event of ['pointerdown', 'wheel']) {
  track.addEventListener(event, followCarouselPosition, {passive: true});
}

const pageSections = [...document.querySelectorAll('main > section:not(.hero), main > footer')];
let lastPageY = window.scrollY;
let pageDirection = 0;
let settlingPage = false;

document.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (y !== lastPageY) pageDirection = Math.sign(y - lastPageY);
  lastPageY = y;
}, {passive: true});

onScrollFinished(document, () => {
  if (settlingPage) {
    settlingPage = false;
    return;
  }
  if (reducedMotion.matches || !pageDirection) return;

  const {scrollHeight, clientHeight} = document.documentElement;
  const maxY = scrollHeight - clientHeight;
  const y = window.scrollY;
  if (y < 0 || y > maxY) return;

  // Only settle toward the next nearby edge in the current scroll direction.
  // The user can move away from a heading without being pulled back.
  const edges = [0, ...pageSections.map(section => Math.min(maxY, y + section.getBoundingClientRect().top))];
  const nearest = edges.map(edge => pageDirection * (edge - y))
    .reduce((distance, nextDistance) => nextDistance > 1 && nextDistance < distance ? nextDistance : distance, 65);

  if (nearest < 65) {
    settlingPage = true;
    window.scrollTo({top: y + pageDirection * nearest, behavior: 'smooth'});
  }
});

function interruptPageSnap() {
  if (settlingPage) window.scrollTo({top: window.scrollY, behavior: 'instant'});
}
document.addEventListener('wheel', event => {
  if (event.deltaY) interruptPageSnap();
}, {passive: true});
document.addEventListener('touchstart', interruptPageSnap, {passive: true});
