document.addEventListener('DOMContentLoaded', initializeApp);

async function initializeApp() {
  console.log('initializeApp: Application initialization started.');

  const elements = selectDOMelements();
  if (!elements) {
    console.error('initializeApp: Failed to select all required DOM elements.');
    return; // Stop execution if essential elements are missing
  }

  const appData = initializeAppData();

  try {
    await loadInitialData(appData, elements);
    renderInitialUI(appData, elements);
    setupEventListeners(elements, appData);

    console.log('initializeApp: Application initialization completed successfully.');
  } catch (error) {
    console.error('initializeApp: An error occurred during initialization:', error);
    displayError(elements.kTrucksGrid, 'Failed to load initial data.');
  }
}

function selectDOMelements() {
  try {
    const containers = document.querySelectorAll('.section-container');
    const sidebar = document.querySelector('.sidebar-container');
    const sidebarDetails = document.querySelector('.sidebar-details');
    const submenuDetails = Array.from(document.querySelectorAll('.submenu-details')); // Convert NodeList to Array
    const body = document.body;
    const kTrucksGrid = document.getElementById('ktrucks-grid');
    const kTruckModal = document.getElementById('ktruck-modal');

    if (!containers.length || !sidebar || !sidebarDetails || !submenuDetails.length || !body || !kTrucksGrid || !kTruckModal) {
      console.warn('selectDOMelements: One or more DOM elements were not found.');
      return null;
    }

    console.log('selectDOMelements: DOM elements selected successfully.');
    return {
      containers,
      sidebar,
      sidebarDetails,
      submenuDetails,
      body,
      kTrucksGrid,
      kTruckModal,
    };
  } catch (error) {
    console.error('selectDOMelements: Error selecting DOM elements:', error);
    return null;
  }
}

function initializeAppData() {
  console.log('initializeAppData: Initializing application data.');
  return {
    kTruckImages: [],
    kTruckDescriptions: [],
    externalLink: 'https://skiptskool.onrender.com/',
    externalSvg: './assets/SKPTSKL-T1.svg',
  };
}

async function loadInitialData(appData, elements) {
  console.log('loadInitialData: Loading initial data.');

  try {
    appData.kTruckImages = await fetchData('/api/data/ktruckimage.json');
    console.log('loadInitialData: K Truck images loaded:', appData.kTruckImages);

    appData.kTruckDescriptions = await fetchData('/api/data/ktruckdescription.json');
    console.log('loadInitialData: K Truck descriptions loaded:', appData.kTruckDescriptions);

    const linksData = await fetchData('/api/data/links.json');
    appData.externalLink = linksData.skiptSkool;
    appData.externalSvg = linksData.svgImage;
    console.log('loadInitialData: Links data loaded:', linksData);

  } catch (error) {
    console.error('loadInitialData: Error loading initial data:', error);
    throw error; // Propagate the error to initializeApp
  }
}

function renderInitialUI(appData, elements) {
  console.log('renderInitialUI: Rendering initial user interface.');

  const initialSections = {
    section1: { title: 'K Trucks', content: 'Browse our selection of compact Japanese Kei trucks, perfect for urban deliveries and small businesses. Features include excellent fuel economy and easy maneuverability.' },
    section2: { title: 'Kotatsu', content: 'Authentic Japanese Kotatsu tables, combining comfort and functionality. Perfect for keeping warm during winter while enjoying meals or relaxing.' },
    section3: { title: 'Anime', content: 'Explore our collection of Japanese animation, movies, music, and other media. Direct imports from Japan with original packaging.' },
    section4: { title: 'Japanese Store', content: 'Discover unique Japanese clothing styles and household items. From traditional wear to modern Japanese home goods.' },
    section5: { title: 'Gaijin Haiku', content: '' },
  };

  updateSections(elements.containers, initialSections, appData);
  populateKTrucksGrid(elements.kTrucksGrid, appData.kTruckImages);

  console.log('renderInitialUI: Initial UI rendering completed.');
}

function updateSections(containers, imports, appData) {
  console.log('updateSections: Updating sections with data:', imports);

  containers.forEach((container, index) => {
    const sectionKey = `section${index + 1}`;
    const summary = container.querySelector('.section-summary');
    const contentDiv = container.querySelector('.section-content');

    if (imports[sectionKey]) {
      console.log(`updateSections: Processing section: ${sectionKey}`);
      if (summary) {
        summary.textContent = imports[sectionKey].title;
      } else {
        console.warn(`updateSections: Summary element not found for section: ${sectionKey}`);
      }

      if (contentDiv) {
        if (sectionKey === 'section5') {
          renderGaijinHaikuSection(contentDiv, appData);
        } else if (sectionKey === 'section1') {
          renderKTrucksSection(contentDiv, imports[sectionKey].content);
        } else {
          contentDiv.innerHTML = `<p>${imports[sectionKey].content}</p>`;
        }
      } else {
        console.warn(`updateSections: Content div not found for section: ${sectionKey}`);
      }
    } else {
      console.warn(`updateSections: No data found for section: ${sectionKey}`);
    }
  });
}

function renderGaijinHaikuSection(contentDiv, appData) {
  console.log('renderGaijinHaikuSection: Rendering Gaijin Haiku section.');

  const testImg = new Image();
  testImg.onload = () => console.log(`renderGaijinHaikuSection: SVG loaded successfully: ${appData.externalSvg}`);
  testImg.onerror = (e) => {
    const errorMessage = `Failed to load SVG: ${appData.externalSvg}`;
    displayError(contentDiv, errorMessage);
    contentDiv.innerHTML = `<p><a href="${appData.externalLink}" target="_blank" rel="noopener noreferrer">SKIPT SKOOL</a></p><div class="svg-container"><a href="${appData.externalLink}" target="_blank" rel="noopener noreferrer"><p style="color: #E04C4C; font-weight: bold;">SKIPT SKOOL</p></a></div>`;
  };
  testImg.src = appData.externalSvg;

  contentDiv.innerHTML = `<p><a href="${appData.externalLink}" target="_blank" rel="noopener noreferrer">SKIPT SKOOL</a></p><div class="svg-container"><a href="${appData.externalLink}" target="_blank" rel="noopener noreferrer"><img src="${appData.externalSvg}" alt="SKIPT SKOOL Logo" class="svg-image" onerror="this.onerror=null; console.error('Image failed to load'); this.style.display='none'; this.parentNode.innerHTML='<p style=\\'color: #E04C4C; font-weight: bold;\\'>SKIPT SKOOL</p>';"></a></div>`;
}

function renderKTrucksSection(contentDiv, content) {
  console.log('renderKTrucksSection: Rendering K Trucks section.');
  contentDiv.innerHTML = `<p>${content}</p><div class="product-scroll-container"><div class="product-grid" id="ktrucks-grid"><div class="loading-indicator">Loading K Trucks...</div></div></div><div class="product-modal" id="ktruck-modal"><div class="modal-content"><span class="close-modal">&times;</span><div class="product-detail-container"></div></div></div>`;
}

function populateKTrucksGrid(kTrucksGrid, kTruckImages) {
  console.log('populateKTrucksGrid: Populating K Trucks grid.');

  if (!kTrucksGrid) {
    console.warn('populateKTrucksGrid: kTrucksGrid element is null. Cannot populate grid.');
    return;
  }

  if (!kTruckImages || !kTruckImages.length) {
    console.warn('populateKTrucksGrid: kTruckImages is empty or not loaded.');
    kTrucksGrid.innerHTML = '<div class="loading-indicator">No K Trucks data available.</div>';
    return;
  }

  kTrucksGrid.innerHTML = ''; // Clear existing content
  const fragment = document.createDocumentFragment(); // Use a fragment for efficiency

  kTruckImages.forEach(truck => {
    const truckItem = createTruckItem(truck);
    fragment.appendChild(truckItem);
  });

  kTrucksGrid.appendChild(fragment);
  console.log('populateKTrucksGrid: K Trucks grid populated successfully.');
}

function createTruckItem(truck) {
  const truckItem = document.createElement('div');
  truckItem.className = 'product-item';
  truckItem.dataset.id = truck.id;

  truckItem.innerHTML = `
    <img class="product-image" src="${truck.thumbnailUrl}" alt="${truck.alt}" onerror="this.src='https://via.placeholder.com/200x150?text=${truck.id}'">
    <div class="product-title">${truck.alt}</div>
  `;

  truckItem.addEventListener('click', () => showKTruckDetails(truck.id));
  return truckItem;
}

function showKTruckDetails(truckId) {
  console.log(`showKTruckDetails: Showing details for truck ID: ${truckId}`);

  const kTruckModal = document.getElementById('ktruck-modal');
  if (!kTruckModal) {
    console.warn('showKTruckDetails: kTruckModal element is null. Cannot show details.');
    return;
  }

  const imageData = appData.kTruckImages.find(img => img.id === truckId);
  const descData = appData.kTruckDescriptions.find(desc => desc.id === truckId);

  if (!imageData || !descData) {
    displayError(null, `Could not find data for truck ID: ${truckId}`);
    return;
  }

  kTruckModal.querySelector('.product-detail-container').innerHTML = createTruckDetailHTML(imageData, descData);
  kTruckModal.style.display = 'flex';

  const closeModal = kTruckModal.querySelector('.close-modal');
  if (closeModal) {
    closeModal.addEventListener('click', () => {
      console.log('showKTruckDetails: Closing modal.');
      kTruckModal.style.display = 'none';
    });
  }

  kTruckModal.addEventListener('click', (event) => {
    if (event.target === kTruckModal) {
      console.log('showKTruckDetails: Clicked outside modal. Hiding modal.');
      kTruckModal.style.display = 'none';
    }
  });
}

function createTruckDetailHTML(imageData, descData) {
  return `
    <img class="product-detail-image" src="${imageData.imageUrl}" alt="${imageData.alt}" onerror="this.src='https://via.placeholder.com/800x500?text=${imageData.id}'">
    <h2 class="product-detail-title">${descData.title}</h2>
    <div class="product-detail-specs">
        ${Object.entries(descData)
          .filter(([key]) => ['year', 'engine', 'transmission', 'capacity', 'mileage', 'price'].includes(key))
          .map(([key, value]) => `<div class="spec-item"><div class="spec-label">${key}</div><div class="spec-value">${value}</div></div>`)
          .join('')}
    </div>
    <p class="product-detail-description">${descData.description}</p>
  `;
}

function setupEventListeners(elements, appData) {
  console.log('setupEventListeners: Setting up event listeners.');

  if (elements.sidebarDetails) {
    elements.sidebarDetails.addEventListener('toggle', () => {
      console.log('setupEventListeners: sidebarDetails toggled.');
      elements.sidebar.classList.toggle('expanded', elements.sidebarDetails.open);
      elements.body.classList.toggle('menu-expanded', elements.sidebarDetails.open);
      elements.body.classList.toggle('submenu-expanded', elements.sidebarDetails.open && elements.submenuDetails.some(detail => detail.open));
      if (!elements.sidebarDetails.open) {
        closeAllSubmenus(elements.submenuDetails);
      }
    });
  } else {
    console.warn('setupEventListeners: sidebarDetails element not found.');
  }

  elements.submenuDetails.forEach(submenu => {
    submenu.addEventListener('toggle', (event) => {
      console.log('setupEventListeners: Submenu toggled:', submenu);
      event.stopPropagation();
      closeOtherSubmenus(elements.submenuDetails, submenu);
      elements.body.classList.toggle('submenu-expanded', elements.submenuDetails.some(detail => detail.open));
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && elements.kTruckModal && elements.kTruckModal.style.display === 'flex') {
      console.log('setupEventListeners: Escape key pressed. Hiding modal.');
      elements.kTruckModal.style.display = 'none';
    }
  });

  console.log('setupEventListeners: Event listeners set up successfully.');
}

function closeAllSubmenus(submenuDetails) {
  console.log('closeAllSubmenus: Closing all submenus.');
  submenuDetails.forEach(submenu => {
    submenu.open = false;
  });
}

function closeOtherSubmenus(submenuDetails, currentSubmenu) {
  console.log('closeOtherSubmenus: Closing other submenus.');
  submenuDetails.forEach(otherSubmenu => {
    if (otherSubmenu !== currentSubmenu) {
      otherSubmenu.open = false;
    }
  });
}

async function fetchData(url) {
  console.log(`fetchData: Fetching data from URL: ${url}`);
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorMessage = `fetchData: Failed to fetch ${url}: ${response.status} ${response.statusText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }
    const data = await response.json();
    console.log(`fetchData: Data fetched successfully from ${url}:`, data);
    return data;
  } catch (error) {
    console.error(`fetchData: Error fetching data from ${url}:`, error);
    throw error;
  }
}

function displayError(element, message) {
  console.error(`displayError: ${message}`);
  if (element) {
    element.innerHTML = `<div class="loading-indicator error">${message}</div>`;
  }
}