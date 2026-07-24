// SCARCE — shared JS helpers across every page.
// Link this after shared.css and before page-specific scripts.

/**
 * Animates a number counting up/down to its target value inside
 * the given element. Call this instead of setting textContent
 * directly whenever a calculated number changes — makes the site
 * feel responsive instead of numbers just snapping into place.
 *
 * @param {HTMLElement} el - element to animate the number inside
 * @param {number} newValue - the target number
 * @param {function} formatFn - formats the number for display, e.g. n => "AED " + Math.round(n).toLocaleString()
 * @param {number} duration - ms, defaults to 450
 */
function animateNumber(el, newValue, formatFn, duration) {
  duration = duration || 450;
  var startValue = parseFloat(el.dataset.rawValue || "0");
  if (isNaN(startValue)) startValue = 0;
  var startTime = null;

  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    var progress = Math.min((timestamp - startTime) / duration, 1);
    var eased = easeOutCubic(progress);
    var current = startValue + (newValue - startValue) * eased;
    el.textContent = formatFn(current);
    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.dataset.rawValue = newValue;
    }
  }
  requestAnimationFrame(step);
}

/**
 * Wires up a collapsible section. Pass the header element (the
 * clickable row) and the body element (the content that shows/hides).
 * Call once per section on page load.
 */
function makeCollapsible(headEl, bodyEl, startCollapsed) {
  if (startCollapsed) {
    headEl.classList.add("collapsed");
    bodyEl.classList.add("collapsed");
  }
  headEl.addEventListener("click", function () {
    headEl.classList.toggle("collapsed");
    bodyEl.classList.toggle("collapsed");
  });
}

/**
 * Injects the shared abstract skyline background into the page.
 * Call once, near the top of <body>. The shapes are simple
 * rectangles (towers) and rect+triangle silhouettes (villas) in a
 * single muted shade — not a real skyline, not a photo, purely
 * decorative texture matching the page's own color family.
 */
function injectSkylineBackground(shade) {
  shade = shade || "rgba(20,24,28,0.05)"; // subtle navy tint on cream, default
  var container = document.createElement("div");
  container.className = "skyline-bg";
  container.innerHTML =
    '<svg viewBox="0 0 1200 220" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
      '<rect x="0" y="140" width="70" height="80" fill="' + shade + '"/>' +
      '<rect x="80" y="100" width="45" height="120" fill="' + shade + '"/>' +
      '<rect x="135" y="160" width="90" height="60" fill="' + shade + '"/>' +
      '<polygon points="245,160 280,120 315,160" fill="' + shade + '"/>' +
      '<rect x="245" y="160" width="70" height="60" fill="' + shade + '"/>' +
      '<rect x="330" y="70" width="38" height="150" fill="' + shade + '"/>' +
      '<rect x="380" y="130" width="55" height="90" fill="' + shade + '"/>' +
      '<polygon points="450,170 480,135 510,170" fill="' + shade + '"/>' +
      '<rect x="450" y="170" width="60" height="50" fill="' + shade + '"/>' +
      '<rect x="525" y="50" width="42" height="170" fill="' + shade + '"/>' +
      '<rect x="580" y="110" width="50" height="110" fill="' + shade + '"/>' +
      '<rect x="645" y="150" width="80" height="70" fill="' + shade + '"/>' +
      '<polygon points="740,165 770,130 800,165" fill="' + shade + '"/>' +
      '<rect x="740" y="165" width="60" height="55" fill="' + shade + '"/>' +
      '<rect x="815" y="90" width="40" height="130" fill="' + shade + '"/>' +
      '<rect x="865" y="140" width="65" height="80" fill="' + shade + '"/>' +
      '<rect x="945" y="60" width="36" height="160" fill="' + shade + '"/>' +
      '<polygon points="1000,170 1030,138 1060,170" fill="' + shade + '"/>' +
      '<rect x="1000" y="170" width="60" height="50" fill="' + shade + '"/>' +
      '<rect x="1075" y="120" width="48" height="100" fill="' + shade + '"/>' +
      '<rect x="1135" y="155" width="65" height="65" fill="' + shade + '"/>' +
    '</svg>';
  document.body.insertBefore(container, document.body.firstChild);
}
