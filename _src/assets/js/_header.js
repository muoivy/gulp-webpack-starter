/* Header Function
********************************************** */
export const initHeader = () => {
  // const header = document.querySelector('.js-header');
  const navToggle = document.querySelector('.js-toggle-nav');
  const headerHamburger = document.querySelector('.js-hamburger');
  const headerNav = document.querySelector('.js-nav');

  // Toggle Navigation
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isExpanded = headerHamburger.getAttribute('aria-expanded') === 'true';
      headerHamburger.setAttribute('aria-expanded', !isExpanded);
      headerNav.classList.toggle('is-active');
    });
  }
}
