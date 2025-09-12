/* INVIEW
********************************************** */
export const inview = () => {
  const FADE = 'is-inview';

  const setTransitionDelay = (el) => {
    const delay = el.dataset.transitionDelay;
    if (delay) el.style.transitionDelay = `${delay}s`;
  };

  const setCustomTransform = (el) => {
    if (el.dataset.transformCustom) el.style.transform = el.dataset.transformCustom;
  };

  const checkReset = (el, offset) => {
    window.addEventListener('load', () => {
      const rect = el.getBoundingClientRect();
      const isOutOfView = window.scrollY > rect.top + el.offsetHeight ||
                          window.scrollY < rect.top - window.innerHeight * offset;
      if (isOutOfView && el.dataset.reset) {
        el.style.transitionDelay = `${el.dataset.reset}s`;
      }
    });
  };

  const addClassOnEvent = (el, offset, className) => {
    ['load', 'scroll', 'resize'].forEach(event => {
      window.addEventListener(event, () => checkPos(el, offset, className));
    });
  };

  const checkPos = (el, offset, className) => {
    const rect = el.getBoundingClientRect();
    const isInView = rect.top <= window.innerHeight * offset &&
                     rect.bottom >= window.innerHeight * (1 - offset);
    if (isInView && !el.classList.contains(className)) {
      setTimeout(() => el.classList.add(className), 300);
    }
  };

  document.querySelectorAll('.js-inview').forEach(el => {
    const offset = el.dataset.offset || 0.95;
    setCustomTransform(el);
    setTransitionDelay(el);
    checkReset(el, offset);
    addClassOnEvent(el, offset, FADE);
    checkPos(el, offset, FADE);
  });
};
