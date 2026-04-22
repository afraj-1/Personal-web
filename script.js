/* Base interactivity:
   - Mobile: touch a card to reveal preview (preview includes an "Open" button to navigate).
   - Desktop: hover shows preview; click on card navigates to the card's data-href.
   - Clicking Close hides preview; tapping outside closes preview.
*/

(function() {
  // set year in footer
  document.getElementById('year') && (document.getElementById('year').textContent = new Date().getFullYear());

  const cards = document.querySelectorAll('.section-card');
  const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0;

  // Helper: remove preview from all cards
  function clearPreviews() {
    cards.forEach(c => c.classList.remove('show-preview'));
  }

  // Add listeners
  cards.forEach(card => {
    const href = card.dataset.href || '#';

    // Desktop click: navigate directly
    card.addEventListener('click', (e) => {
      // If clicked an internal control (close or open-btn), ignore here
      if (e.target.closest('.close-preview') || e.target.closest('.open-btn')) return;

      // on non-touch devices, clicking the card goes to the href
      if (!isTouch) {
        if (href.startsWith('#') || href.endsWith('.pdf') || href.endsWith('.html')) {
          // for anchors and files, respect default navigation
          window.location.href = href;
        } else {
          window.location.href = href;
        }
      }
      // for touch devices: do nothing here (touch shows preview)
    });

    // Close button inside preview
    const closeBtn = card.querySelector('.close-preview');
    if (closeBtn) {
      closeBtn.addEventListener('click', (ev) => {
        ev.stopPropagation();
        card.classList.remove('show-preview');
      });
    }

    // If open-btn clicked, let native link handle navigation (no extra code needed)

    // Touch behavior: show preview on touch
    if (isTouch) {
      card.addEventListener('touchstart', (ev) => {
        // show preview for this card, hide others
        clearPreviews();
        card.classList.add('show-preview');
        // stop event so that iOS doesn't treat this as a click as well
        // (we still allow the user to press the Open button)
      });
    }

    // Keyboard accessibility: Enter opens (desktop)
    card.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        if (!isTouch) {
          // desktop: navigate
          window.location.href = href;
        } else {
          // touch: toggle preview
          card.classList.toggle('show-preview');
        }
      }
    });
  });

  // Clicking/tapping outside closes previews (mobile)
  document.addEventListener(isTouch ? 'touchstart' : 'click', function (ev) {
    // if clicked inside a .section-card, do nothing
    if (ev.target.closest && ev.target.closest('.section-card')) return;
    clearPreviews();
  }, { passive: true });

})();
