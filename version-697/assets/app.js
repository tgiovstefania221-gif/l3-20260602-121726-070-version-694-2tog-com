(function () {
  var menuButton = document.querySelector('[data-menu-button]');
  var panel = document.querySelector('[data-mobile-panel]');
  if (menuButton && panel) {
    menuButton.addEventListener('click', function () {
      panel.classList.toggle('is-open');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var activeSlide = 0;
  function setSlide(index) {
    if (!slides.length) return;
    activeSlide = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === activeSlide);
    });
    dots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === activeSlide);
    });
  }
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      setSlide(i);
    });
  });
  if (slides.length > 1) {
    setSlide(0);
    window.setInterval(function () {
      setSlide(activeSlide + 1);
    }, 5200);
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }

  var filterScopes = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));
  filterScopes.forEach(function (scope) {
    var input = scope.querySelector('[data-filter-input]');
    var year = scope.querySelector('[data-filter-year]');
    var region = scope.querySelector('[data-filter-region]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    var empty = scope.querySelector('[data-empty-state]');

    function applyFilter() {
      var q = normalize(input && input.value);
      var y = normalize(year && year.value);
      var r = normalize(region && region.value);
      var shown = 0;
      cards.forEach(function (card) {
        var haystack = normalize([
          card.getAttribute('data-title'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region'),
          card.getAttribute('data-genre')
        ].join(' '));
        var pass = true;
        if (q && haystack.indexOf(q) === -1) pass = false;
        if (y && normalize(card.getAttribute('data-year')) !== y) pass = false;
        if (r && normalize(card.getAttribute('data-region')) !== r) pass = false;
        card.style.display = pass ? '' : 'none';
        if (pass) shown += 1;
      });
      if (empty) empty.classList.toggle('is-visible', shown === 0);
    }

    [input, year, region].forEach(function (control) {
      if (control) control.addEventListener('input', applyFilter);
      if (control) control.addEventListener('change', applyFilter);
    });
    applyFilter();
  });
})();
