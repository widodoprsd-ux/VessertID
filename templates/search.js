const q = document.getElementById('q');
const cards = [...document.querySelectorAll('.card')];

q.addEventListener('input', () => {
  const v = q.value.toLowerCase();
  cards.forEach(c => {
    c.style.display = c.dataset.name.includes(v) ? '' : 'none';
  });
});
