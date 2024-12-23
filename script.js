document.addEventListener('DOMContentLoaded', () => {
  const collapsibles = document.querySelectorAll('.collapsible');
  
  collapsibles.forEach((collapsible) => {
    collapsible.addEventListener('click', () => {
      const content = collapsible.nextElementSibling;
      content.style.display = content.style.display === 'block' ? 'none' : 'block';
    });
  });
});
