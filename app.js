/* ==========================================================================
   Core Shopping Engine (Cart, Filters, Wishlist, Modal & UI states)
   ========================================================================== */

// App State
const state = {
  cart: [],
  wishlist: [],
  filters: {
    categories: [],
    sizes: [],
    colors: [],
    maxPrice: 350,
    searchQuery: ""
  },
  selectedProduct: null, // Product currently viewed in modal
  selectedColorIndex: 0,
  selectedSize: ""
};

// DOM Elements Cache
let elements = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  initApp();
  renderProducts();
  setupEventListeners();
});

function cacheElements() {
  elements = {
    productGrid: document.getElementById("product-grid"),
    productCount: document.getElementById("product-count"),
    
    // Drawers
    cartDrawer: document.getElementById("cart-drawer"),
    wishlistDrawer: document.getElementById("wishlist-drawer"),
    menuDrawer: document.getElementById("menu-drawer"),
    drawerBackdrop: document.getElementById("drawer-backdrop"),
    
    // Drawer Content containers
    cartContent: document.getElementById("cart-content"),
    cartSubtotal: document.getElementById("cart-subtotal"),
    cartBadge: document.getElementById("cart-badge"),
    wishlistContent: document.getElementById("wishlist-content"),
    wishlistBadge: document.getElementById("wishlist-badge"),
    menuSortedProducts: document.getElementById("menu-sorted-products"),
    menuSortSelect: document.getElementById("menu-sort-select"),
    
    // Filters
    searchBar: document.getElementById("search-bar"),
    searchResultsDropdown: document.getElementById("search-results-dropdown"),
    priceRange: document.getElementById("price-range"),
    priceLabel: document.getElementById("price-label"),
    categoryFilters: document.querySelectorAll("[data-filter-category]"),
    sizeFilters: document.querySelectorAll(".size-chip[data-filter-size]"),
    colorFilters: document.querySelectorAll(".filter-checkbox input[name='color']"),
    
    // Modal
    modal: document.getElementById("product-modal"),
    modalMainImg: document.getElementById("modal-main-img"),
    modalThumbs: document.getElementById("modal-thumbs"),
    modalName: document.getElementById("modal-name"),
    modalCategory: document.getElementById("modal-category"),
    modalPrice: document.getElementById("modal-price"),
    modalRating: document.getElementById("modal-rating"),
    modalDesc: document.getElementById("modal-desc"),
    modalSpecs: document.getElementById("modal-specs"),
    modalColors: document.getElementById("modal-colors"),
    modalSizes: document.getElementById("modal-sizes"),
    modalAddBtn: document.getElementById("modal-add-btn"),
    
    // Toast Container
    toastContainer: document.getElementById("toast-container")
  };
}

function initApp() {
  // Read local storage if pre-existing
  const savedCart = localStorage.getItem("tac_cart");
  const savedWishlist = localStorage.getItem("tac_wishlist");
  
  if (savedCart) {
    state.cart = JSON.parse(savedCart);
    updateCartUI();
  }
  if (savedWishlist) {
    state.wishlist = JSON.parse(savedWishlist);
    updateWishlistUI();
  }
  
  // Set slider max price default
  if (elements.priceRange) {
    elements.priceRange.value = state.filters.maxPrice;
    elements.priceLabel.textContent = `$${state.filters.maxPrice}`;
  }
}

/* ==========================================================================
   Product Rendering & Filtering
   ========================================================================== */
function renderProducts() {
  const filtered = window.PRODUCTS.filter(product => {
    // 1. Category Filter
    if (state.filters.categories.length > 0 && !state.filters.categories.includes(product.category)) {
      return false;
    }
    // 2. Size Filter
    if (state.filters.sizes.length > 0) {
      const hasSize = product.sizes.some(s => state.filters.sizes.includes(s));
      if (!hasSize) return false;
    }
    // 3. Color Filter
    if (state.filters.colors.length > 0) {
      const hasColor = product.colors.some(c => state.filters.colors.includes(c.name));
      if (!hasColor) return false;
    }
    // 4. Price Filter
    if (product.price > state.filters.maxPrice) {
      return false;
    }
    // 5. Search Filter
    if (state.filters.searchQuery) {
      const query = state.filters.searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(query);
      const matchSpecs = product.specs.some(s => s.toLowerCase().includes(query));
      if (!matchName && !matchSpecs) return false;
    }
    return true;
  });

  // Render list
  elements.productGrid.innerHTML = "";
  elements.productCount.textContent = `[${filtered.length} Items Found]`;

  if (filtered.length === 0) {
    elements.productGrid.innerHTML = `
      <div class="glass-panel hud-corner hud-corner-tl hud-corner-tr hud-corner-bl hud-corner-br" style="grid-column: 1 / -1; padding: 4rem; text-align: center;">
        <span class="hud-title" style="color: var(--hud-glow-amber); display: block; margin-bottom: 1rem;">// NO TARGETS MATCH FILTER CRITERIA</span>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">Reset filters or adjust price range parameters.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(product => {
    const isWishlisted = state.wishlist.includes(product.id);
    const badgeHTML = product.badge ? `<div class="product-badge">${product.badge}</div>` : "";
    const originalPriceHTML = product.originalPrice ? `<span class="original">$${product.originalPrice.toFixed(2)}</span>` : "";
    
    // Generate color swatches HTML
    let swatchesHTML = "";
    product.colors.forEach((color, index) => {
      swatchesHTML += `
        <div class="swatch-item ${index === 0 ? 'active' : ''}" 
             style="background-color: ${color.hex};" 
             title="${color.name}"
             data-product-id="${product.id}"
             data-color-index="${index}">
        </div>
      `;
    });

    const card = document.createElement("div");
    card.className = "product-card glass-panel hud-corner hud-corner-tl hud-corner-tr hud-corner-bl hud-corner-br";
    card.dataset.id = product.id;
    
    // Check if item has a generated photo, otherwise fall back to SVG wireframe
    let imageAreaHTML = "";
    if (product.id === "j-01" || product.id === "f-01") {
      imageAreaHTML = `<img src="${product.image}" alt="${product.name}" class="product-img-real">`;
    } else {
      imageAreaHTML = `
        <div class="product-visual">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="width:100%; height:100%; opacity: 0.85;">
            ${getProductSVGPaths(product.category)}
          </svg>
        </div>
      `;
    }

    card.innerHTML = `
      <div class="product-img-wrapper">
        ${badgeHTML}
        <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" data-wishlist-id="${product.id}">
          <svg width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
            <path d="M240,94c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,220.66,16,164,16,94A62,62,0,0,1,121.72,52.33l6.28,6.28,6.28-6.28A62,62,0,0,1,240,94Z"></path>
          </svg>
        </button>
        
        ${imageAreaHTML}

        <div class="quick-add-overlay">
          <button class="btn-tactical btn-quick-add" data-quick-add="${product.id}">QUICK ADD TO CART</button>
        </div>
      </div>
      
      <div class="product-info">
        <span class="product-category">${product.category}</span>
        <h3 class="product-name">${product.name}</h3>
        
        <div class="product-rating">
          ${getStarsHTML(product.rating)}
          <span>(${product.reviewsCount})</span>
        </div>
        
        <div class="product-footer">
          <span class="product-price">$${product.price.toFixed(2)} ${originalPriceHTML}</span>
          <div class="swatch-container">
            ${swatchesHTML}
          </div>
        </div>
      </div>
    `;

    elements.productGrid.appendChild(card);
  });
}

function getStarsHTML(rating) {
  let html = "";
  const rounded = Math.floor(rating);
  for (let i = 1; i <= 5; i++) {
    if (i <= rounded) {
      html += `<svg width="12" height="12" fill="currentColor" viewBox="0 0 256 256"><path d="M239.2,97.29a16,16,0,0,0-13.81-11L162,77.58,135.87,18.84a16,16,0,0,0-29.74,0L80,77.58,16.61,86.28a16,16,0,0,0-8.87,27.3l45.89,44.73L42.74,222a16,16,0,0,0,23.23,16.89L128,205.51l62,33.35A16,16,0,0,0,213.26,222l-10.88-63.66,45.89-44.73A16,16,0,0,0,239.2,97.29Z"></path></svg>`;
    } else {
      html += `<svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="16" viewBox="0 0 256 256"><path d="M239.2,97.29a16,16,0,0,0-13.81-11L162,77.58,135.87,18.84a16,16,0,0,0-29.74,0L80,77.58,16.61,86.28a16,16,0,0,0-8.87,27.3l45.89,44.73L42.74,222a16,16,0,0,0,23.23,16.89L128,205.51l62,33.35A16,16,0,0,0,213.26,222l-10.88-63.66,45.89-44.73A16,16,0,0,0,239.2,97.29Z"></path></svg>`;
    }
  }
  return html;
}

// Custom SVGs representing tactical gear vector outlines for premium HUD feeling
function getProductSVGPaths(category) {
  switch (category) {
    case "Jackets":
      return `
        <!-- Outer Jacket Drawing -->
        <path d="M30 20 L50 15 L70 20 L75 55 L70 57 L68 85 L32 85 L30 57 L25 55 Z" stroke-width="1.5" />
        <path d="M50 15 L50 85" stroke-dasharray="2,2" />
        <path d="M30 20 L40 38 L50 34 L60 38 L70 20" />
        <rect x="36" y="45" width="8" height="12" rx="1" />
        <rect x="56" y="45" width="8" height="12" rx="1" />
      `;
    case "Pants":
      return `
        <!-- Combat Cargo Pants -->
        <path d="M32 15 L68 15 L72 85 L52 85 L50 45 L48 85 L28 85 Z" stroke-width="1.5" />
        <line x1="32" y1="22" x2="68" y2="22" />
        <rect x="25" y="38" width="8" height="14" rx="1" />
        <rect x="67" y="38" width="8" height="14" rx="1" />
        <line x1="38" y1="55" x2="38" y2="70" stroke-dasharray="2,2" />
        <line x1="62" y1="55" x2="62" y2="70" stroke-dasharray="2,2" />
      `;
    case "Tactical Shirts":
      return `
        <!-- Assault Shirt -->
        <path d="M32 20 L50 16 L68 20 L74 48 L65 50 L65 80 L35 80 L35 50 L26 50 Z" stroke-width="1.5" />
        <path d="M35 30 L65 30" />
        <path d="M50 16 L50 30" />
        <rect x="28" y="32" width="6" height="10" />
        <rect x="66" y="32" width="6" height="10" />
      `;
    case "Footwear":
      return `
        <!-- SpecOps Boots -->
        <path d="M30 75 L35 40 L50 35 L52 50 L75 68 L75 75 L70 78 L28 78 Z" stroke-width="1.5" />
        <path d="M35 40 L45 68" />
        <line x1="45" y1="46" x2="51" y2="44" />
        <line x1="43" y1="52" x2="49" y2="50" />
        <line x1="41" y1="58" x2="47" y2="56" />
        <path d="M28 78 C28 79.5, 75 79.5, 75 78" />
      `;
    case "Accessories":
      return `
        <!-- Tactical pack or gear piece -->
        <rect x="32" y="25" width="36" height="50" rx="4" stroke-width="1.5" />
        <rect x="38" y="32" width="24" height="6" rx="1" />
        <rect x="38" y="44" width="24" height="6" rx="1" />
        <rect x="38" y="56" width="24" height="6" rx="1" />
        <path d="M42 25 L42 20 C42 18, 58 18, 58 20 L58 25" />
      `;
    default:
      return `
        <rect x="25" y="25" width="50" height="50" stroke-width="1.5" />
        <circle cx="50" cy="50" r="15" />
      `;
  }
}

/* ==========================================================================
   Shopping Cart Engine
   ========================================================================== */
function addToCart(productId, colorName, size) {
  const product = window.PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  // Locate if duplicate exists (matching both size and color)
  const existing = state.cart.find(item => 
    item.id === productId && 
    item.color === colorName && 
    item.size === size
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
      color: colorName,
      size: size,
      quantity: 1
    });
  }

  localStorage.setItem("tac_cart", JSON.stringify(state.cart));
  updateCartUI();
  showToast(`ADDED TO MISSION MANIFEST: ${product.name} (${size})`);
}

function updateCartUI() {
  const count = state.cart.reduce((total, item) => total + item.quantity, 0);
  elements.cartBadge.textContent = count;
  elements.cartBadge.style.display = count > 0 ? "flex" : "none";

  elements.cartContent.innerHTML = "";
  if (state.cart.length === 0) {
    elements.cartContent.innerHTML = `
      <div class="drawer-empty-state">
        <svg class="drawer-empty-icon" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"></path>
        </svg>
        <span class="hud-title" style="font-size: 0.85rem; letter-spacing: 0.1em;">MANIFEST EMPTY</span>
        <span style="font-size: 0.75rem; text-align: center;">No tactical equipment added.</span>
      </div>
    `;
    elements.cartSubtotal.textContent = "$0.00";
    return;
  }

  let subtotal = 0;
  state.cart.forEach((item, index) => {
    subtotal += item.price * item.quantity;
    
    const row = document.createElement("div");
    row.className = "drawer-item";
    row.innerHTML = `
      <div class="drawer-item-img">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1" style="width:36px; height:36px;">
          ${getProductSVGPaths(item.category)}
        </svg>
      </div>
      <div class="drawer-item-details">
        <h4 class="drawer-item-name">${item.name}</h4>
        <div class="drawer-item-meta">SZ: ${item.size} | CLR: ${item.color}</div>
        <div class="drawer-item-qty">
          <button class="qty-btn" data-cart-idx="${index}" data-qty-change="-1">-</button>
          <span class="qty-val">${item.quantity}</span>
          <button class="qty-btn" data-cart-idx="${index}" data-qty-change="1">+</button>
        </div>
      </div>
      <div class="drawer-item-right">
        <span class="drawer-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        <button class="drawer-item-remove" data-cart-remove-idx="${index}">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
            <path d="M216,48H180V36A28,28,0,0,0,152,8H104A28,28,0,0,0,76,36V48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM92,36a12,12,0,0,1,12-12h48a12,12,0,0,1,12,12V48H92Zm100,172H64V64H192Z"></path>
          </svg>
        </button>
      </div>
    `;
    elements.cartContent.appendChild(row);
  });

  elements.cartSubtotal.textContent = `$${subtotal.toFixed(2)}`;
}

function handleCartQuantity(index, change) {
  state.cart[index].quantity += change;
  if (state.cart[index].quantity <= 0) {
    state.cart.splice(index, 1);
  }
  localStorage.setItem("tac_cart", JSON.stringify(state.cart));
  updateCartUI();
}

function removeCartItem(index) {
  state.cart.splice(index, 1);
  localStorage.setItem("tac_cart", JSON.stringify(state.cart));
  updateCartUI();
  showToast("EQUIPMENT REMOVED FROM MANIFEST");
}

/* ==========================================================================
   Wishlist Engine
   ========================================================================== */
function toggleWishlist(productId) {
  const index = state.wishlist.indexOf(productId);
  const product = window.PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  if (index > -1) {
    state.wishlist.splice(index, 1);
    showToast(`REMOVED FROM MONITOR: ${product.name}`);
  } else {
    state.wishlist.push(productId);
    showToast(`ADDED TO ACTIVE WATCHLIST: ${product.name}`);
  }

  localStorage.setItem("tac_wishlist", JSON.stringify(state.wishlist));
  updateWishlistUI();
  renderProducts(); // Re-render main list to update stars/wishlist color status
}

function updateWishlistUI() {
  const count = state.wishlist.length;
  elements.wishlistBadge.textContent = count;
  elements.wishlistBadge.style.display = count > 0 ? "flex" : "none";

  elements.wishlistContent.innerHTML = "";
  if (state.wishlist.length === 0) {
    elements.wishlistContent.innerHTML = `
      <div class="drawer-empty-state">
        <svg class="drawer-empty-icon" fill="currentColor" viewBox="0 0 256 256">
          <path d="M240,94c0,70-103.79,126.66-108.21,129a8,8,0,0,1-7.58,0C119.79,220.66,16,164,16,94A62,62,0,0,1,121.72,52.33l6.28,6.28,6.28-6.28A62,62,0,0,1,240,94Z"></path>
        </svg>
        <span class="hud-title" style="font-size: 0.85rem; letter-spacing: 0.1em;">WATCHLIST EMPTY</span>
        <span style="font-size: 0.75rem; text-align: center;">No items tracked for replenishment.</span>
      </div>
    `;
    return;
  }

  state.wishlist.forEach(id => {
    const product = window.PRODUCTS.find(p => p.id === id);
    if (!product) return;

    const row = document.createElement("div");
    row.className = "drawer-item";
    row.innerHTML = `
      <div class="drawer-item-img">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1" style="width:36px; height:36px;">
          ${getProductSVGPaths(product.category)}
        </svg>
      </div>
      <div class="drawer-item-details">
        <h4 class="drawer-item-name">${product.name}</h4>
        <div class="drawer-item-meta">${product.category}</div>
        <span class="drawer-item-price">$${product.price.toFixed(2)}</span>
      </div>
      <div class="drawer-item-right">
        <button class="btn-tactical" style="padding: 0.4rem 0.8rem; font-size: 0.65rem;" data-wishlist-to-cart="${product.id}">ADD</button>
        <button class="drawer-item-remove" data-wishlist-remove-id="${product.id}">
          <svg width="14" height="14" fill="currentColor" viewBox="0 0 256 256">
            <path d="M216,48H180V36A28,28,0,0,0,152,8H104A28,28,0,0,0,76,36V48H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM92,36a12,12,0,0,1,12-12h48a12,12,0,0,1,12,12V48H92Zm100,172H64V64H192Z"></path>
          </svg>
        </button>
      </div>
    `;
    elements.wishlistContent.appendChild(row);
  });
}

/* ==========================================================================
   Product Detail Modal (Quick View)
   ========================================================================== */
function openQuickView(productId) {
  const product = window.PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  state.selectedProduct = product;
  state.selectedColorIndex = 0;
  state.selectedSize = product.sizes[0];

  // Configure text fields
  elements.modalName.textContent = product.name;
  elements.modalCategory.textContent = product.category;
  elements.modalPrice.innerHTML = `$${product.price.toFixed(2)} ${product.originalPrice ? `<span class="original" style="font-size:0.95rem; text-decoration:line-through; color:var(--text-secondary); margin-left:0.5rem;">$${product.originalPrice.toFixed(2)}</span>` : ""}`;
  elements.modalRating.innerHTML = `${getStarsHTML(product.rating)} <span style="color:var(--text-secondary); margin-left:0.5rem;">(${product.reviewsCount} verified reviews)</span>`;
  elements.modalDesc.textContent = product.description;

  // Build specifications list
  elements.modalSpecs.innerHTML = "";
  product.specs.forEach(spec => {
    const li = document.createElement("li");
    li.textContent = spec;
    elements.modalSpecs.appendChild(li);
  });

  // Build color selectors
  elements.modalColors.innerHTML = "";
  product.colors.forEach((color, idx) => {
    const chip = document.createElement("div");
    chip.className = `modal-color-chip ${idx === 0 ? "active" : ""}`;
    chip.dataset.idx = idx;
    chip.innerHTML = `<span class="modal-color-dot" style="background-color: ${color.hex};"></span>${color.name}`;
    elements.modalColors.appendChild(chip);
  });

  // Build size chips
  elements.modalSizes.innerHTML = "";
  product.sizes.forEach((size, idx) => {
    const chip = document.createElement("div");
    chip.className = `size-chip ${idx === 0 ? "active" : ""}`;
    chip.dataset.size = size;
    chip.textContent = size;
    elements.modalSizes.appendChild(chip);
  });

  // Setup dynamic image / vector representations
  if (product.id === "j-01" || product.id === "f-01") {
    elements.modalMainImg.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-img-real" style="max-height: 100%; object-fit: contain;">
    `;
    
    elements.modalThumbs.innerHTML = `
      <div class="modal-thumb active" data-angle="front">
        <img src="${product.image}" alt="${product.name}" class="product-img-real" style="width: 100%; height: 100%; object-fit: cover;">
      </div>
      <div class="modal-thumb" data-angle="tactical">
        <!-- Tactical blueprint styling with crosshairs -->
        <svg viewBox="0 0 100 100" fill="none" stroke="var(--hud-glow-green)" stroke-dasharray="1,1" stroke-width="1" style="width:36px; height:36px;">
          ${getProductSVGPaths(product.category)}
          <circle cx="50" cy="50" r="45" stroke="var(--hud-glow-green)" stroke-width="0.5" />
        </svg>
      </div>
    `;
  } else {
    elements.modalMainImg.innerHTML = `
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2" style="width:75%; height:75%;">
        ${getProductSVGPaths(product.category)}
      </svg>
    `;

    elements.modalThumbs.innerHTML = `
      <div class="modal-thumb active" data-angle="front">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1" style="width:36px; height:36px;">
          ${getProductSVGPaths(product.category)}
        </svg>
      </div>
      <div class="modal-thumb" data-angle="tactical">
        <!-- Tactical blueprint styling with crosshairs -->
        <svg viewBox="0 0 100 100" fill="none" stroke="var(--hud-glow-green)" stroke-dasharray="1,1" stroke-width="1" style="width:36px; height:36px;">
          ${getProductSVGPaths(product.category)}
          <circle cx="50" cy="50" r="45" stroke="var(--hud-glow-green)" stroke-width="0.5" />
        </svg>
      </div>
    `;
  }

  // Display Modal
  elements.modal.classList.add("open");
}

function closeQuickView() {
  elements.modal.classList.remove("open");
  state.selectedProduct = null;
}

/* ==========================================================================
   UI Event Bindings
   ========================================================================== */
function setupEventListeners() {
  // 1. Sidebar Category Filters
  elements.categoryFilters.forEach(tab => {
    tab.addEventListener("click", (e) => {
      e.preventDefault();
      const category = tab.dataset.filterCategory;
      
      elements.categoryFilters.forEach(btn => btn.classList.remove("active"));
      tab.classList.add("active");

      if (category === "All") {
        state.filters.categories = [];
      } else {
        state.filters.categories = [category];
      }
      renderProducts();
    });
  });

  // 2. Size Filters
  elements.sizeFilters.forEach(chip => {
    chip.addEventListener("click", () => {
      const size = chip.dataset.filterSize;
      const idx = state.filters.sizes.indexOf(size);
      
      if (idx > -1) {
        state.filters.sizes.splice(idx, 1);
        chip.classList.remove("active");
      } else {
        state.filters.sizes.push(size);
        chip.classList.add("active");
      }
      renderProducts();
    });
  });

  // 3. Color Filters
  elements.colorFilters.forEach(checkbox => {
    checkbox.addEventListener("change", () => {
      const color = checkbox.value;
      if (checkbox.checked) {
        state.filters.colors.push(color);
      } else {
        const idx = state.filters.colors.indexOf(color);
        if (idx > -1) state.filters.colors.splice(idx, 1);
      }
      renderProducts();
    });
  });

  // 4. Price Slider
  if (elements.priceRange) {
    elements.priceRange.addEventListener("input", (e) => {
      const val = parseInt(e.target.value);
      state.filters.maxPrice = val;
      elements.priceLabel.textContent = `$${val}`;
      renderProducts();
    });
  }

  // 5. Search Bar Input & Live Dropdown Results (Separated result listing)
  if (elements.searchBar) {
    elements.searchBar.addEventListener("input", (e) => {
      const val = e.target.value;
      state.filters.searchQuery = val;
      renderProducts();
      
      const query = val.toLowerCase().trim();
      if (elements.searchResultsDropdown) {
        if (query.length === 0) {
          elements.searchResultsDropdown.style.display = "none";
          return;
        }
        
        // Find matching targets
        const matches = window.PRODUCTS.filter(p => 
          p.name.toLowerCase().includes(query) || 
          p.category.toLowerCase().includes(query) || 
          p.specs.some(s => s.toLowerCase().includes(query))
        );
        renderSearchDropdown(matches, elements.searchResultsDropdown);
      }
    });
  }

  // Hide Search suggestions dropdown if clicking outside search container
  document.addEventListener("click", (e) => {
    const searchContainer = document.querySelector(".hud-search-container");
    if (elements.searchResultsDropdown && searchContainer && !searchContainer.contains(e.target)) {
      elements.searchResultsDropdown.style.display = "none";
    }
  });

  // 6. Navigation Toggle Drawers
  document.getElementById("nav-menu-btn").addEventListener("click", () => toggleDrawer("menu"));
  document.getElementById("nav-cart-btn").addEventListener("click", () => toggleDrawer("cart"));
  document.getElementById("nav-wishlist-btn").addEventListener("click", () => toggleDrawer("wishlist"));
  
  document.getElementById("close-menu").addEventListener("click", () => toggleDrawer("menu"));
  document.getElementById("close-cart").addEventListener("click", () => toggleDrawer("cart"));
  document.getElementById("close-wishlist").addEventListener("click", () => toggleDrawer("wishlist"));
  elements.drawerBackdrop.addEventListener("click", closeAllDrawers);

  if (elements.menuSortSelect) {
    elements.menuSortSelect.addEventListener("change", renderMenuProducts);
  }

  // 7. Click events inside drawers & product items (using Delegation)
  document.addEventListener("click", (e) => {
    // Quick Add on card
    if (e.target.dataset.quickAdd) {
      e.stopPropagation();
      const id = e.target.dataset.quickAdd;
      const product = window.PRODUCTS.find(p => p.id === id);
      addToCart(id, product.colors[0].name, product.sizes[0]);
      return;
    }

    // Toggle Wishlist on card
    const wishlistBtn = e.target.closest("[data-wishlist-id]");
    if (wishlistBtn) {
      e.stopPropagation();
      toggleWishlist(wishlistBtn.dataset.wishlistId);
      return;
    }

    // Swatches selection on card
    if (e.target.classList.contains("swatch-item")) {
      e.stopPropagation();
      const pId = e.target.dataset.productId;
      const cIdx = parseInt(e.target.dataset.colorIndex);
      
      const parent = e.target.closest(".swatch-container");
      parent.querySelectorAll(".swatch-item").forEach(s => s.classList.remove("active"));
      e.target.classList.add("active");
      
      // We could change thumbnail color if we had different color renders.
      return;
    }

    // Open detail modal when clicking anywhere on a product card except buttons
    const productCard = e.target.closest(".product-card");
    if (productCard) {
      openQuickView(productCard.dataset.id);
      return;
    }

    // Quantity updates in Cart Drawer
    if (e.target.dataset.cartIdx) {
      const idx = parseInt(e.target.dataset.cartIdx);
      const val = parseInt(e.target.dataset.qtyChange);
      handleCartQuantity(idx, val);
      return;
    }

    // Remove from cart drawer
    if (e.target.closest("[data-cart-remove-idx]")) {
      const btn = e.target.closest("[data-cart-remove-idx]");
      removeCartItem(parseInt(btn.dataset.cartRemoveIdx));
      return;
    }

    // Remove from wishlist drawer
    if (e.target.closest("[data-wishlist-remove-id]")) {
      const btn = e.target.closest("[data-wishlist-remove-id]");
      toggleWishlist(btn.dataset.wishlistRemoveId);
      return;
    }

    // Move item from wishlist to cart
    if (e.target.dataset.wishlistToCart) {
      const id = e.target.dataset.wishlistToCart;
      const product = window.PRODUCTS.find(p => p.id === id);
      addToCart(id, product.colors[0].name, product.sizes[0]);
      toggleWishlist(id); // Clean up from watchlist
      return;
    }

    // Modal color selector triggers
    const colorChip = e.target.closest(".modal-color-chip");
    if (colorChip) {
      elements.modalColors.querySelectorAll(".modal-color-chip").forEach(c => c.classList.remove("active"));
      colorChip.classList.add("active");
      state.selectedColorIndex = parseInt(colorChip.dataset.idx);
      return;
    }

    // Modal size selector triggers
    const sizeChip = e.target.closest(".modal-sizes-grid .size-chip");
    if (sizeChip) {
      elements.modalSizes.querySelectorAll(".size-chip").forEach(c => c.classList.remove("active"));
      sizeChip.classList.add("active");
      state.selectedSize = sizeChip.dataset.size;
      return;
    }

    // Modal thumbnail variation preview trigger
    const mThumb = e.target.closest(".modal-thumb");
    if (mThumb) {
      elements.modalThumbs.querySelectorAll(".modal-thumb").forEach(t => t.classList.remove("active"));
      mThumb.classList.add("active");
      
      const angle = mThumb.dataset.angle;
      const product = state.selectedProduct;
      
      if (product.id === "j-01" || product.id === "f-01") {
        // Toggle between Image and HUD SVG Blueprint
        if (angle === "tactical") {
          elements.modalMainImg.innerHTML = `
            <svg viewBox="0 0 100 100" fill="none" stroke="var(--hud-glow-green)" stroke-width="1.2" style="width:75%; height:75%; filter: drop-shadow(0 0 10px rgba(0, 255, 102, 0.4));">
              ${getProductSVGPaths(product.category)}
            </svg>
          `;
        } else {
          elements.modalMainImg.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img-real" style="max-height: 100%; object-fit: contain;">
          `;
        }
      } else {
        // Just modify styling on the SVG
        const svg = elements.modalMainImg.querySelector("svg");
        if (svg) {
          if (angle === "tactical") {
            svg.style.stroke = "var(--hud-glow-green)";
            svg.style.filter = "drop-shadow(0 0 10px rgba(0, 255, 102, 0.4))";
          } else {
            svg.style.stroke = "currentColor";
            svg.style.filter = "none";
          }
        }
      }
      return;
    }
  });

  // Modal checkout alerts
  document.getElementById("checkout-btn").addEventListener("click", () => {
    if (state.cart.length === 0) return;
    showToast("// INITIATING ENCRYPTED ORDER GATEWAY...");
    setTimeout(() => {
      alert(`MISSION MANIFEST CONFIRMED!\n\nOrder Subtotal: ${elements.cartSubtotal.textContent}\nTracking coordinates dispatched to client profile.`);
      state.cart = [];
      localStorage.removeItem("tac_cart");
      updateCartUI();
      closeAllDrawers();
    }, 1200);
  });

  // Modal Add to Cart
  elements.modalAddBtn.addEventListener("click", () => {
    if (!state.selectedProduct) return;
    const clr = state.selectedProduct.colors[state.selectedColorIndex].name;
    addToCart(state.selectedProduct.id, clr, state.selectedSize);
    closeQuickView();
  });

  // Modal close trigger bindings
  document.getElementById("close-modal").addEventListener("click", closeQuickView);
  window.addEventListener("click", (e) => {
    if (e.target === elements.modal || e.target.classList.contains("modal-backdrop")) {
      closeQuickView();
    }
  });

  // Carousel Next/Prev Controls
  const carousel = document.getElementById("carousel-viewport");
  if (carousel) {
    document.getElementById("carousel-next").addEventListener("click", () => {
      carousel.scrollBy({ left: 320, behavior: 'smooth' });
    });
    document.getElementById("carousel-prev").addEventListener("click", () => {
      carousel.scrollBy({ left: -320, behavior: 'smooth' });
    });
  }
  
  // Newsletter submit
  document.getElementById("newsletter-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const input = e.target.querySelector("input");
    if (!input.value) return;
    showToast(`SECURE NETWORK SUBSCRIPTION REGISTERED FOR: ${input.value.toUpperCase()}`);
    input.value = "";
  });

  // System Camouflage Theme Overrides
  const themeSelector = document.getElementById("theme-selector");
  if (themeSelector) {
    themeSelector.addEventListener("change", (e) => {
      const selectedTheme = e.target.value;
      
      // Clear existing classes
      document.body.classList.remove("theme-multicam", "theme-woodland", "theme-desert", "theme-light");
      
      // Inject current layout scheme
      if (selectedTheme !== "multicam") {
        document.body.classList.add(`theme-${selectedTheme}`);
      }
      
      showToast(`SYSTEM CAMOUFLAGE OVERRIDE: ${selectedTheme.toUpperCase()}`);
    });
  }
}

function toggleDrawer(type) {
  if (type === "cart") {
    elements.cartDrawer.classList.toggle("open");
    elements.wishlistDrawer.classList.remove("open");
    elements.menuDrawer.classList.remove("open");
  } else if (type === "wishlist") {
    elements.wishlistDrawer.classList.toggle("open");
    elements.cartDrawer.classList.remove("open");
    elements.menuDrawer.classList.remove("open");
  } else if (type === "menu") {
    elements.menuDrawer.classList.toggle("open");
    elements.cartDrawer.classList.remove("open");
    elements.wishlistDrawer.classList.remove("open");
    if (elements.menuDrawer.classList.contains("open")) {
      renderMenuProducts();
    }
  }
  
  const isAnyOpen = elements.cartDrawer.classList.contains("open") || 
                    elements.wishlistDrawer.classList.contains("open") || 
                    elements.menuDrawer.classList.contains("open");
  if (isAnyOpen) {
    elements.drawerBackdrop.classList.add("open");
  } else {
    elements.drawerBackdrop.classList.remove("open");
  }
}

function closeAllDrawers() {
  elements.cartDrawer.classList.remove("open");
  elements.wishlistDrawer.classList.remove("open");
  elements.menuDrawer.classList.remove("open");
  elements.drawerBackdrop.classList.remove("open");
}

/* ==========================================================================
   Toast Alerts
   ========================================================================== */
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast glass-panel hud-corner hud-corner-tl hud-corner-tr hud-corner-bl hud-corner-br";
  toast.innerHTML = `
    <span style="color:var(--hud-glow-green); font-family:var(--font-display);">[HUD ALERT]</span>
    <span>${message}</span>
  `;
  elements.toastContainer.appendChild(toast);

  // Auto clean up after 3.5 seconds
  setTimeout(() => {
    toast.style.animation = "slide-up-in 0.3s reverse forwards";
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3500);
}

/**
 * Renders the separate scan matches lists (suggestions dropdown) dynamically
 */
function renderSearchDropdown(matches, container) {
  container.innerHTML = "";
  if (matches.length === 0) {
    container.innerHTML = `
      <div style="padding: 1rem; font-family: var(--font-display); font-size: 0.7rem; color: var(--hud-glow-amber); text-align: center; letter-spacing:0.05em;">
        // 0 SENSOR TARGETS ACQUIRED
      </div>
    `;
    container.style.display = "block";
    return;
  }
  
  const header = document.createElement("div");
  header.style.cssText = "padding: 0.45rem 0.75rem; font-family: var(--font-display); font-size: 0.6rem; color: var(--hud-glow-green); border-bottom: 1px solid var(--border-color); text-transform: uppercase; font-weight:600; letter-spacing:0.05em;";
  header.textContent = `// ACTIVE SCAN: ${matches.length} MATCHES DETECTED`;
  container.appendChild(header);
  
  matches.forEach(product => {
    const item = document.createElement("div");
    item.style.cssText = "padding: 0.55rem 0.75rem; border-bottom: 1px solid rgba(255,255,255,0.03); display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: background 0.15s ease;";
    item.innerHTML = `
      <div style="display: flex; flex-direction: column; text-align: left;">
        <span style="font-size: 0.6rem; font-family: var(--font-display); color: var(--color-coyote); text-transform: uppercase;">${product.category}</span>
        <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-primary); margin-top: 1px;">${product.name}</span>
      </div>
      <span style="font-family: var(--font-display); font-size: 0.8rem; font-weight: 700; color: var(--hud-glow-green);">$${product.price.toFixed(2)}</span>
    `;
    
    // Hover highlight
    item.addEventListener("mouseenter", () => {
      item.style.backgroundColor = "rgba(0, 255, 102, 0.05)";
    });
    item.addEventListener("mouseleave", () => {
      item.style.backgroundColor = "transparent";
    });
    
    // Click opens the quick-view modal details
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      openQuickView(product.id);
      container.style.display = "none";
    });
    
    container.appendChild(item);
  });
  
  container.style.display = "block";
}

/**
 * Renders the sorted products inside the Left System Menu drawer
 */
function renderMenuProducts() {
  if (!elements.menuSortedProducts || !elements.menuSortSelect) return;
  
  const sortKey = elements.menuSortSelect.value;
  const sorted = [...window.PRODUCTS];
  
  if (sortKey === "price-asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortKey === "price-desc") {
    sorted.sort((a, b) => b.price - a.price);
  } else if (sortKey === "rating") {
    sorted.sort((a, b) => b.rating - a.rating);
  } else if (sortKey === "name-asc") {
    sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  elements.menuSortedProducts.innerHTML = "";
  
  sorted.forEach(product => {
    const item = document.createElement("div");
    item.className = "menu-product-item";
    item.dataset.menuProductId = product.id;
    
    // Check thumbnail type
    let thumbHTML = "";
    if (product.id === "j-01" || product.id === "f-01") {
      thumbHTML = `<img src="${product.image}" alt="${product.name}">`;
    } else {
      thumbHTML = `
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
          ${getProductSVGPaths(product.category)}
        </svg>
      `;
    }
    
    item.innerHTML = `
      <div class="menu-product-thumb">
        ${thumbHTML}
      </div>
      <div class="menu-product-details">
        <span class="menu-product-category">${product.category}</span>
        <span class="menu-product-name">${product.name}</span>
        <div class="menu-product-rating">
          ${getStarsHTML(product.rating)}
          <span>(${product.rating.toFixed(1)})</span>
        </div>
      </div>
      <div class="menu-product-price">
        $${product.price.toFixed(2)}
      </div>
    `;
    
    // Click opens quick-view and closes all drawers
    item.addEventListener("click", () => {
      openQuickView(product.id);
      closeAllDrawers();
    });
    
    elements.menuSortedProducts.appendChild(item);
  });
}
