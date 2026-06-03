/* ==========================================================================
   Tactical HUD & Anti-Gravity Visual Effects
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initAmbientGlow();
  initCard3DTilt();
  initHeroParallax();
  initSystemTicker();
});

/**
 * Creates a faint glowing cursor tracking light (HUD Laser/Illumination vibe)
 */
function initAmbientGlow() {
  const glow = document.createElement("div");
  glow.className = "glow-spot";
  document.body.appendChild(glow);

  document.addEventListener("mousemove", (e) => {
    // Smooth transition using page coordinate offsets
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });
}

/**
 * 3D Tilt Hover Effect for premium product cards (Anti-Gravity depth)
 */
function initCard3DTilt() {
  // Event delegation to capture dynamic product cards
  document.addEventListener("mousemove", (e) => {
    const card = e.target.closest(".product-card");
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top;  // y position within element

    // Calculate rotation angles based on mouse location relative to center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Limits max tilt to 8 degrees
    const rotateY = ((x - centerX) / centerX) * 8;
    const rotateX = -((y - centerY) / centerY) * 8;

    // Apply transform and subtle inner glow shift
    card.style.transform = `translateY(-8px) perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  document.addEventListener("mouseleave", (e) => {
    const card = e.target.closest(".product-card");
    if (!card) return;
    
    // Smooth reset when mouse leaves
    card.style.transform = "translateY(0) perspective(1000px) rotateX(0) rotateY(0)";
  }, true); // Use capture phase to ensure mouseleave on inner items is handled
}

/**
 * Subtle Parallax for the lifestyle Hero section
 */
function initHeroParallax() {
  const heroBg = document.querySelector(".hero-bg");
  if (!heroBg) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    // Move background upward at 15% of scroll speed to simulate distance
    heroBg.style.transform = `scale(1.15) translateY(${-scrolled * 0.15}px)`;
  });
}

/**
 * Automated System Ticker Simulation for HUD console
 */
function initSystemTicker() {
  const coordinateTickers = document.querySelectorAll(".hud-gps-coords");
  if (coordinateTickers.length === 0) return;

  // Update mock coordinates periodically to make the HUD look alive
  setInterval(() => {
    coordinateTickers.forEach(ticker => {
      const lat = (34.0522 + (Math.random() - 0.5) * 0.01).toFixed(4);
      const lng = (-118.2437 + (Math.random() - 0.5) * 0.01).toFixed(4);
      ticker.textContent = `LAT: ${lat}° N | LNG: ${lng}° W | ALT: ${Math.floor(412 + Math.random() * 5)}m`;
    });
  }, 4000);
}
