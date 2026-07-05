// Component by Ansh — github.com/ansh-dhanani
// Ported from React Bits GradualBlur for vanilla JS.

const GRADUAL_BLUR_DEFAULTS = {
  position: 'bottom',
  strength: 2,
  height: '6rem',
  divCount: 5,
  exponential: false,
  zIndex: 1000,
  opacity: 1,
  curve: 'linear',
  target: 'parent',
  className: '',
};

const GRADUAL_BLUR_CURVES = {
  linear: (p) => p,
  bezier: (p) => p * p * (3 - 2 * p),
  'ease-in': (p) => p * p,
  'ease-out': (p) => 1 - (1 - p) ** 2,
  'ease-in-out': (p) => (p < 0.5 ? 2 * p * p : 1 - ((-2 * p + 2) ** 2) / 2),
};

function getGradientDirection(position) {
  return ({
    top: 'to top',
    bottom: 'to bottom',
    left: 'to left',
    right: 'to right',
  })[position] || 'to bottom';
}

function mergeGradualBlurConfig(...configs) {
  return configs.reduce((acc, config) => ({ ...acc, ...config }), {});
}

function createGradualBlur(userConfig = {}) {
  const config = mergeGradualBlurConfig(GRADUAL_BLUR_DEFAULTS, userConfig);
  const isPageTarget = config.target === 'page';
  const isVertical = ['top', 'bottom'].includes(config.position);

  const root = document.createElement('div');
  root.className = [
    'gradual-blur',
    isPageTarget ? 'gradual-blur-page' : 'gradual-blur-parent',
    `gradual-blur-${config.position}`,
    config.className,
  ].filter(Boolean).join(' ');
  root.setAttribute('aria-hidden', 'true');

  const inner = document.createElement('div');
  inner.className = 'gradual-blur-inner';
  root.appendChild(inner);

  const curveFunc = GRADUAL_BLUR_CURVES[config.curve] || GRADUAL_BLUR_CURVES.linear;
  const increment = 100 / config.divCount;
  const direction = getGradientDirection(config.position);

  for (let i = 1; i <= config.divCount; i += 1) {
    let progress = i / config.divCount;
    progress = curveFunc(progress);

    let blurValue;
    if (config.exponential) {
      blurValue = 2 ** (progress * 4) * 0.0625 * config.strength;
    } else {
      blurValue = 0.0625 * (progress * config.divCount + 1) * config.strength;
    }

    const p1 = Math.round((increment * i - increment) * 10) / 10;
    const p2 = Math.round(increment * i * 10) / 10;
    const p3 = Math.round((increment * i + increment) * 10) / 10;
    const p4 = Math.round((increment * i + increment * 2) * 10) / 10;

    let gradient = `transparent ${p1}%, black ${p2}%`;
    if (p3 <= 100) gradient += `, black ${p3}%`;
    if (p4 <= 100) gradient += `, transparent ${p4}%`;

    const layer = document.createElement('div');
    layer.style.position = 'absolute';
    layer.style.inset = '0';
    layer.style.maskImage = `linear-gradient(${direction}, ${gradient})`;
    layer.style.webkitMaskImage = `linear-gradient(${direction}, ${gradient})`;
    layer.style.backdropFilter = `blur(${blurValue.toFixed(3)}rem)`;
    layer.style.webkitBackdropFilter = `blur(${blurValue.toFixed(3)}rem)`;
    layer.style.opacity = String(config.opacity);

    inner.appendChild(layer);
  }

  root.style.position = isPageTarget ? 'fixed' : 'absolute';
  root.style.pointerEvents = 'none';
  root.style.zIndex = String(isPageTarget ? config.zIndex + 100 : config.zIndex);

  if (isVertical) {
    root.style.height = config.height;
    root.style.width = config.width || '100%';
    root.style[config.position] = '0';
    root.style.left = '0';
    root.style.right = '0';
  }

  if (config.style) {
    Object.assign(root.style, config.style);
  }

  return root;
}

function initPageGradualBlurs() {
  const shared = {
    target: 'page',
    strength: 2,
    divCount: 6,
    curve: 'bezier',
    exponential: true,
    opacity: 1,
    zIndex: 4,
    className: 'gradual-blur--site',
  };

  document.body.append(
    createGradualBlur({
      ...shared,
      position: 'top',
      height: 'max(3.25rem, calc(2.25rem + env(safe-area-inset-top)))',
    }),
    createGradualBlur({
      ...shared,
      position: 'bottom',
      height: 'max(3.5rem, calc(2.5rem + env(safe-area-inset-bottom)))',
    }),
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPageGradualBlurs);
} else {
  initPageGradualBlurs();
}
