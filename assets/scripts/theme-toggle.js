/* Client-side toggle: flips `data-theme` on <html> and persists to localStorage. */
(function () {
  var KEY = 'pupputer-theme';
  var btn = document.getElementById('theme-toggle');
  if (!btn) return;

  var current = localStorage.getItem(KEY) || 'default';
  document.documentElement.setAttribute('data-theme', current);

  btn.addEventListener('click', function () {
    current = current === 'dark' ? 'default' : 'dark';
    document.documentElement.setAttribute('data-theme', current);
    localStorage.setItem(KEY, current);
  });
})();
