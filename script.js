document.addEventListener('DOMContentLoaded', async () => {
  // Select DOM elements
  const containers = document.querySelectorAll('.section-container');
  const sidebar = document.querySelector('.sidebar-container');
  const sidebarDetails = document.querySelector('.sidebar-details');
  const body = document.body;
  
  // Log to help debug
  console.log('Found section containers:', containers.length);

  // Define imports data with titles and content
  const japanImports = {
    section1: {
      title: 'K Trucks',
      content: 'Browse our selection of compact Japanese Kei trucks, perfect for urban deliveries and small businesses. Features include excellent fuel economy and easy maneuverability.'
    },
    section2: {
      title: 'Kotatsu',
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
      content: ''
    }
  };

  // Fetch external links
  let externalLink = 'https://skiptskool.onrender.com/'; // Hardcoded fallback
  let externalSvg = './assets/SKPTSKL-T1.svg'; // Default to direct path even if fetch fails

  try {
    console.log('Attempting to fetch links.json...');
    const response = await fetch('links.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch links.json: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Successfully loaded links.json:', data);
    
    // Verify that we're getting the correct data
    console.log('Raw skiptSkool value:', data.skiptSkool);
    
    // Only override if the values exist and aren't empty
    if (data.skiptSkool && data.skiptSkool.trim() !== '') {
      externalLink = data.skiptSkool;
    }
    
    if (data.svgImage && data.svgImage.trim() !== '') {
      externalSvg = data.svgImage;
    }
    
    console.log('External link set to:', externalLink);
    console.log('SVG image path set to:', externalSvg);
  } catch (error) {
    console.error('Error loading links.json:', error);
    // Continue with defaults set above
  }

  // Function to update section content
  const updateSections = (imports) => {
    containers.forEach((container, index) => {
      const sectionKey = `section${index + 1}`;
      const summary = container.querySelector('.section-summary');
      const contentDiv = container.querySelector('.section-content');

      // Update summary text and content
      if (imports[sectionKey]) {
        summary.textContent = imports[sectionKey].title;

        // Special handling for Section 5
        if (sectionKey === 'section5') {
          // Create a new image element to test loading
          const testImg = new Image();
          testImg.onload = () => {
            console.log(`SVG loaded successfully: ${externalSvg}`);
          };
          testImg.onerror = (e) => {
            console.error(`Failed to load SVG: ${externalSvg}`, e);
            // Fall back to a text-only version if image fails
            contentDiv.innerHTML = `
              <p><a href="${externalLink}" target="_blank" rel="noopener noreferrer">SKIPT SKOOL</a></p>
              <div class="svg-container">
                <a href="${externalLink}" target="_blank" rel="noopener noreferrer">
                  <p style="color: #E04C4C; font-weight: bold;">SKIPT SKOOL</p>
                </a>
              </div>
            `;
          };
          testImg.src = externalSvg;
          
          // Set initial HTML with verified link
          contentDiv.innerHTML = `
            <p><a href="${externalLink}" target="_blank" rel="noopener noreferrer">SKIPT SKOOL</a></p>
            <div class="svg-container">
              <a href="${externalLink}" target="_blank" rel="noopener noreferrer">
                <img src="${externalSvg}" alt="SKIPT SKOOL Logo" class="svg-image" 
                     onerror="this.onerror=null; console.error('Image failed to load'); this.style.display='none'; this.parentNode.innerHTML='<p style=\\'color: #E04C4C; font-weight: bold;\\'>SKIPT SKOOL</p>';">
              </a>
            </div>
          `;
        } else {
          contentDiv.innerHTML = `<p>${imports[sectionKey].content}</p>`;
        }
      }
    });
  };

  // Initialize with Japan imports
  updateSections(japanImports);

  // Add event listener for sidebar toggle
  if (sidebarDetails) {
    sidebarDetails.addEventListener('toggle', () => {
      if (sidebarDetails.open) {
        console.log('Sidebar opened');
        sidebar.classList.add('expanded');
        body.classList.add('menu-expanded');
      } else {
        console.log('Sidebar closed');
        sidebar.classList.remove('expanded');
        body.classList.remove('menu-expanded');
      }
    });
  }
});