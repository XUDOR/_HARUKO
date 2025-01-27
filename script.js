document.addEventListener('DOMContentLoaded', () => {
  // Select DOM elements
  const collapsibles = document.querySelectorAll('.collapsible');
  const toggleButton = document.getElementById('toggle-button');
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
      title: 'Apparel & Household',
      content: 'Discover unique Japanese clothing styles and household items. From traditional wear to modern Japanese home goods.'
    },
    section4: {
      title: 'Anime & Media',
      content: 'Explore our collection of Japanese animation, movies, music, and other media. Direct imports from Japan with original packaging.'
    }
  };

  const usImports = {
    section1: {
      title: 'Pickup Trucks',
      content: 'American-made pickup trucks known for their durability and power. Perfect for both work and leisure, featuring latest safety technologies.'
    },
    section2: {
      title: 'Coffee Tables',
      content: 'Modern American-designed coffee tables combining style and functionality. Made with premium materials for lasting quality.'
    },
    section3: {
      title: 'Clothing & Accessories',
      content: 'Contemporary American fashion and accessories. From casual wear to designer pieces, representing the latest US trends.'
    },
    section4: {
      title: 'Movies & Music',
      content: 'The latest in American entertainment, including Hollywood releases, popular music, and digital media content.'
    }
  };

  // Track current state
  let isJapanImports = true;

  // Function to update section content
  const updateSections = (imports) => {
    containers.forEach((container, index) => {
      const sectionKey = `section${index + 1}`;
      const button = container.querySelector('.collapsible');
      const content = container.querySelector('.content p');
      
      // Update button text and content
      button.textContent = imports[sectionKey].title;
      content.textContent = imports[sectionKey].content;
    });
  };

  // Initialize with Japan imports
  updateSections(japanImports);

  // Toggle button event listener
  toggleButton.addEventListener('click', () => {
    isJapanImports = !isJapanImports;
    toggleButton.textContent = isJapanImports ? 'Japan Imports' : 'U.S. Imports';
    updateSections(isJapanImports ? japanImports : usImports);
  });

  // Collapsible sections event listeners
  collapsibles.forEach((button) => {
    button.addEventListener('click', () => {
      // Toggle the clicked section
      const content = button.nextElementSibling;
      content.classList.toggle('show');
      
      // Optional: Close other sections
      // containers.forEach(container => {
      //   const otherContent = container.querySelector('.content');
      //   if (otherContent !== content) {
      //     otherContent.classList.remove('show');
      //   }
      // });
    });
  });
});