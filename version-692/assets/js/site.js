(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      mobileNav.classList.toggle('open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var index = 0;
    var timer;

    function show(nextIndex) {
      if (!slides.length) {
        return;
      }

      index = (nextIndex + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === index);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === index);
      });
    }

    function restart() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        show(dotIndex);
        restart();
      });
    });

    show(0);
    restart();
  }

  var filterRoot = document.querySelector('[data-filter-root]');

  if (filterRoot) {
    var cards = Array.prototype.slice.call(filterRoot.querySelectorAll('[data-card]'));
    var query = filterRoot.querySelector('[data-filter-query]');
    var year = filterRoot.querySelector('[data-filter-year]');
    var region = filterRoot.querySelector('[data-filter-region]');

    function normalize(value) {
      return String(value || '').trim().toLowerCase();
    }

    function applyFilters() {
      var q = normalize(query && query.value);
      var y = normalize(year && year.value);
      var r = normalize(region && region.value);

      cards.forEach(function (card) {
        var text = normalize(card.getAttribute('data-title') + ' ' + card.getAttribute('data-tags'));
        var cardYear = normalize(card.getAttribute('data-year'));
        var cardRegion = normalize(card.getAttribute('data-region'));
        var visible = true;

        if (q && text.indexOf(q) === -1) {
          visible = false;
        }

        if (y && cardYear !== y) {
          visible = false;
        }

        if (r && cardRegion.indexOf(r) === -1) {
          visible = false;
        }

        card.classList.toggle('hide', !visible);
      });
    }

    [query, year, region].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  }

  var players = Array.prototype.slice.call(document.querySelectorAll('[data-video-player]'));

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var start = player.querySelector('[data-player-start]');
    var source = player.getAttribute('data-video-player');
    var initialized = false;
    var hlsInstance = null;

    function playVideo() {
      if (!video || !source) {
        return;
      }

      if (!initialized) {
        initialized = true;

        if (window.Hls && window.Hls.isSupported()) {
          hlsInstance = new window.Hls({
            lowLatencyMode: true,
            backBufferLength: 90
          });
          hlsInstance.loadSource(source);
          hlsInstance.attachMedia(video);
          hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(function () {});
          });
        } else {
          video.src = source;
          video.play().catch(function () {});
        }
      } else {
        video.play().catch(function () {});
      }

      if (start) {
        start.classList.add('is-hidden');
      }
    }

    if (start) {
      start.addEventListener('click', playVideo);
    }

    if (video) {
      video.addEventListener('click', function () {
        if (!initialized) {
          playVideo();
        }
      });

      video.addEventListener('play', function () {
        if (start) {
          start.classList.add('is-hidden');
        }
      });
    }
  });
})();
