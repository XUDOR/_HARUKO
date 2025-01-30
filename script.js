document.addEventListener('DOMContentLoaded', () => {
  // Select DOM elements
  const containers = document.querySelectorAll('.collapsible-container');

  // Define imports data with titles and content
  const japanImports = {
    section1: {
      title: 'Kei Trucks',
      content: 'Browse our selection of compact Japanese Kei trucks, perfect for urban deliveries and small businesses. Features include excellent fuel economy and easy maneuverability.'
    },
    section2: {
      title: 'Kotatsu Tables',
      content: 'Authentic Japanese Kotatsu tables, combining comfort and functionality. Perfect for keeping warm during winter while enjoying meals or relaxing.'
    },
    section3: {
      title: 'Anime',
      content: 'Explore our collection of Japanese animation, movies, music, and other media. Direct imports from Japan with original packaging.'
    },
    section4: {
      title: 'Japanese Store',
      content: 'Discover unique Japanese clothing styles and household items. From traditional wear to modern Japanese home goods.'
    },
    section5: {
      title: 'Gaijin Haiku',
      content: 'Immerse yourself in a collection of Japanese poetry and artistic expression. Unique imports that blend traditional and modern styles.'
    }
  };

  // Function to update section content
  const updateSections = (imports) => {
    containers.forEach((container, index) => {
      const sectionKey = `section${index + 1}`;
      const button = container.querySelector('.collapsible');
      const content = container.querySelector('.content p');

      // Update button text and content
      if (imports[sectionKey]) {
        button.textContent = imports[sectionKey].title;
        content.textContent = imports[sectionKey].content;
      }
    });
  };

  // Initialize with Japan imports
  updateSections(japanImports);

  // Collapsible sections event listeners
  containers.forEach((container) => {
    const button = container.querySelector('.collapsible');
    button.addEventListener('click', () => {
      const content = button.nextElementSibling;
      content.classList.toggle('show');
    });
  });
});
