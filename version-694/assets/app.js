document.addEventListener('DOMContentLoaded', function () {
  var navToggle = document.querySelector('[data-nav-toggle]');
  var mainNav = document.querySelector('[data-main-nav]');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', function () {
      mainNav.classList.toggle('is-open');
    });
  }

  document.addEventListener('error', function (event) {
    var target = event.target;

    if (target && target.tagName === 'IMG') {
      var frame = target.closest('.cover-frame');

      if (frame) {
        frame.classList.add('is-missing');
      }
    }
  }, true);

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('.hero-dot'));
    var activeIndex = 0;

    function activate(index) {
      activeIndex = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === activeIndex);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === activeIndex);
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        activate(index);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        activate(activeIndex + 1);
      }, 5200);
    }
  }

  var localSearchForm = document.querySelector('[data-local-search-form]');

  if (localSearchForm) {
    localSearchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = localSearchForm.querySelector('input[name="q"]');
      var keyword = input ? input.value.trim() : '';
      var target = 'search.html';

      if (keyword) {
        target += '?q=' + encodeURIComponent(keyword);
      }

      window.location.href = target;
    });
  }

  var filterRoot = document.querySelector('[data-filter-root]');

  if (filterRoot) {
    var keywordInput = filterRoot.querySelector('[data-filter-keyword]');
    var yearSelect = filterRoot.querySelector('[data-filter-year]');
    var typeSelect = filterRoot.querySelector('[data-filter-type]');
    var cards = Array.prototype.slice.call(filterRoot.querySelectorAll('.movie-card'));

    function updateCategoryFilter() {
      var keyword = keywordInput ? keywordInput.value.trim().toLowerCase() : '';
      var year = yearSelect ? yearSelect.value : '';
      var type = typeSelect ? typeSelect.value : '';

      cards.forEach(function (card) {
        var text = [
          card.dataset.title,
          card.dataset.region,
          card.dataset.type,
          card.dataset.genre,
          card.dataset.year
        ].join(' ').toLowerCase();
        var ok = true;

        if (keyword && text.indexOf(keyword) === -1) {
          ok = false;
        }

        if (year && card.dataset.year !== year) {
          ok = false;
        }

        if (type && card.dataset.type !== type) {
          ok = false;
        }

        card.style.display = ok ? '' : 'none';
      });
    }

    [keywordInput, yearSelect, typeSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', updateCategoryFilter);
        control.addEventListener('change', updateCategoryFilter);
      }
    });
  }
});
