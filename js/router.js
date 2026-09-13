/* router.js — minimal hash-based router. Views are plain functions that
 * receive the #view-root container and render into it. No history stack
 * beyond the browser's native hash history.
 */
const Router = (() => {
  const routes = {};
  let root = null;
  let navEls = [];

  function register(path, renderFn) { routes[path] = renderFn; }

  function setNavElements(elements) { navEls = elements; }

  function updateNavHighlight(path) {
    navEls.forEach((el) => {
      if (el.dataset.route === path) el.classList.add('nav-active');
      else el.classList.remove('nav-active');
    });
  }

  function navigate(path) {
    if (location.hash !== '#' + path) {
      location.hash = path;
    } else {
      render(path);
    }
  }

  function render(path) {
    const fn = routes[path] || routes['home'];
    if (!root) root = document.getElementById('view-root');
    root.setAttribute('aria-busy', 'true');
    root.innerHTML = '';
    fn(root);
    root.setAttribute('aria-busy', 'false');
    updateNavHighlight(path);
    window.scrollTo(0, 0);
  }

  function currentPath() {
    return (location.hash || '#home').slice(1) || 'home';
  }

  function start() {
    root = document.getElementById('view-root');
    window.addEventListener('hashchange', () => render(currentPath()));
    render(currentPath());
  }

  return { register, navigate, start, setNavElements, currentPath };
})();
