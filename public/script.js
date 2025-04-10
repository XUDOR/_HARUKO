document.addEventListener('DOMContentLoaded', async () => {
  // Select DOM elements
  const containers = document.querySelectorAll('.section-container');
  const sidebar = document.querySelector('.sidebar-container');
  const sidebarDetails = document.querySelector('.sidebar-details');
  const submenuDetails = document.querySelectorAll('.submenu-details');
  const body = document.body;
  
  // K Trucks specific elements
  const kTrucksGrid = document.getElementById('ktrucks-grid');
  const kTruckModal = document.getElementById('ktruck-modal');
  let kTruckImages = [];
  let kTruckDescriptions = [];
  
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

  // Function to load K Truck data
  const loadKTruckData = async () => {
    try {
      // Load K Truck images
      const imageResponse = await fetch('ktruckimage.json');
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch ktruckimage.json: ${imageResponse.status}`);
      }
      kTruckImages = await imageResponse.json();
      
      // Load K Truck descriptions
      const descResponse = await fetch('ktruckdescription.json');
      if (!descResponse.ok) {
        throw new Error(`Failed to fetch ktruckdescription.json: ${descResponse.status}`);
      }
      kTruckDescriptions = await descResponse.json();
      
      console.log('K Truck data loaded:', kTruckImages.length, 'images,', kTruckDescriptions.length, 'descriptions');
      
      // Populate the K Trucks grid
      populateKTrucksGrid();
      
    } catch (error) {
      console.error('Error loading K Truck data:', error);
      if (kTrucksGrid) {
        kTrucksGrid.innerHTML = `<div class="loading-indicator">Error loading K Trucks data: ${error.message}</div>`;
      }
    }
  };
  
  // Function to populate K Trucks grid
  const populateKTrucksGrid = () => {
    if (!kTrucksGrid) return;
    
    // Clear existing content
    kTrucksGrid.innerHTML = '';
    
    // Create elements for each K Truck
    kTruckImages.forEach(truck => {
      const truckItem = document.createElement('div');
      truckItem.className = 'product-item';
      truckItem.dataset.id = truck.id;
      
      // Use the actual image path from the JSON
      const imageSrc = truck.thumbnailUrl;
      
      truckItem.innerHTML = `
        <img class="product-image" src="${imageSrc}" alt="${truck.alt}" 
             onerror="this.src='https://via.placeholder.com/200x150?text=${truck.id}'">
        <div class="product-title">${truck.alt}</div>
      `;
      
      // Add click event to show details
      truckItem.addEventListener('click', () => showKTruckDetails(truck.id));
      
      kTrucksGrid.appendChild(truckItem);
    });
  };
  
  // Function to show K Truck details
  const showKTruckDetails = (truckId) => {
    if (!kTruckModal) return;
    
    console.log('Showing details for truck:', truckId);
    
    // Find the truck data
    const imageData = kTruckImages.find(img => img.id === truckId);
    const descData = kTruckDescriptions.find(desc => desc.id === truckId);
    
    if (!imageData || !descData) {
      console.error('Could not find data for truck ID:', truckId);
      return;
    }
    
    // Get the container for the details
    const detailContainer = kTruckModal.querySelector('.product-detail-container');
    
    // Use the actual image path from the JSON for the full-size image
    const imageSrc = imageData.imageUrl;
    
    // Build the detail HTML
    detailContainer.innerHTML = `
      <img class="product-detail-image" src="${imageSrc}" alt="${imageData.alt}" 
           onerror="this.src='https://via.placeholder.com/800x500?text=${truckId}'">
      <h2 class="product-detail-title">${descData.title}</h2>
      
      <div class="product-detail-specs">
        <div class="spec-item">
          <div class="spec-label">Year</div>
          <div class="spec-value">${descData.year}</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">Engine</div>
          <div class="spec-value">${descData.engine}</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">Transmission</div>
          <div class="spec-value">${descData.transmission}</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">Capacity</div>
          <div class="spec-value">${descData.capacity}</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">Mileage</div>
          <div class="spec-value">${descData.mileage}</div>
        </div>
        <div class="spec-item">
          <div class="spec-label">Price</div>
          <div class="spec-value">${descData.price}</div>
        </div>
      </div>
      
      <p class="product-detail-description">${descData.description}</p>
    `;
    
    // Show the modal
    kTruckModal.style.display = 'flex';
    
    // Add event listener to close modal
    const closeButton = kTruckModal.querySelector('.close-modal');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        kTruckModal.style.display = 'none';
      });
    }
    
    // Add event listener to close modal when clicking outside
    kTruckModal.addEventListener('click', (event) => {
      if (event.target === kTruckModal) {
        kTruckModal.style.display = 'none';
      }
    });
  };

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
        } else if (sectionKey === 'section1') {
          // For K Trucks section, only add the product container if not already present
          if (!contentDiv.querySelector('.product-scroll-container')) {
            contentDiv.innerHTML = `
              <p>${imports[sectionKey].content}</p>
              
              <!-- Horizontal scrollable container -->
              <div class="product-scroll-container">
                <div class="product-grid" id="ktrucks-grid">
                  <!-- Products will be dynamically loaded here -->
                  <div class="loading-indicator">Loading K Trucks...</div>
                </div>
              </div>
              
              <!-- Product Detail Modal -->
              <div class="product-modal" id="ktruck-modal">
                <div class="modal-content">
                  <span class="close-modal">&times;</span>
                  <div class="product-detail-container">
                    <!-- Product details will be loaded here -->
                  </div>
                </div>
              </div>
            `;
            
            // Get references to the newly added elements
            kTrucksGrid = document.getElementById('ktrucks-grid');
            kTruckModal = document.getElementById('ktruck-modal');
            
            // Load K Truck data when section is created
            loadKTruckData();
          }
        } else {
          contentDiv.innerHTML = `<p>${imports[sectionKey].content}</p>`;
        }
      }
    });
  };

  // Initialize with Japan imports
  updateSections(japanImports);

  // Function to close all submenus
  const closeAllSubmenus = () => {
    submenuDetails.forEach(submenu => {
      submenu.open = false;
    });
    sidebar.classList.remove('submenu-expanded');
    body.classList.remove('submenu-expanded');
  };

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
        sidebar.classList.remove('submenu-expanded');
        body.classList.remove('menu-expanded');
        body.classList.remove('submenu-expanded');
        // Close all submenus when sidebar is closed
        closeAllSubmenus();
      }
    });
  }

  // Add event listeners for submenu toggles
  if (submenuDetails.length > 0) {
    submenuDetails.forEach(submenu => {
      submenu.addEventListener('toggle', (event) => {
        event.stopPropagation(); // Prevent event from bubbling up to sidebar-details
        
        if (submenu.open) {
          console.log('Submenu opened');
          
          // Close other open submenus
          submenuDetails.forEach(other => {
            if (other !== submenu && other.open) {
              other.open = false;
            }
          });
          
          // Expand sidebar further for submenu
          sidebar.classList.add('submenu-expanded');
          body.classList.add('submenu-expanded');
        } else {
          console.log('Submenu closed');
          
          // Check if any other submenus are open
          const anySubmenuOpen = Array.from(submenuDetails).some(detail => detail.open);
          
          if (!anySubmenuOpen) {
            // If no submenus are open, collapse back to regular expanded state
            sidebar.classList.remove('submenu-expanded');
            body.classList.remove('submenu-expanded');
          }
        }
      });
    });
  }

  // Add event listener to close K Truck modal with ESC key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && kTruckModal && kTruckModal.style.display === 'flex') {
      kTruckModal.style.display = 'none';
    }
  });
});