/* Shows a floating "back to top" button after 400px of scroll. */
(function () {
  var btn = document.createElement('button');
  btn.textContent = '↑';
  btn.setAttribute('aria-label', 'Back to top');
  btn.className = 'back-to-top';
  btn.style.cssText =
    'position:fixed;right:1.5rem;bottom:1.5rem;width:2.5rem;height:2.5rem;' +
    'border-radius:50%;border:1px solid #ccc;background:#fff;cursor:pointer;' +
    'display:none;font-size:1rem;';
  document.body.appendChild(btn);

  window.addEventListener('scroll', function () {
    btn.style.display = window.scrollY > 400 ? 'block' : 'none';
  });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();
