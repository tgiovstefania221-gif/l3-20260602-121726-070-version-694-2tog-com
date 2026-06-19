(function () {
  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
    } else {
      callback();
    }
  }

  ready(function () {
    setupMenu();
    setupHero();
    setupFilters();
    setupPlayers();
  });

  function setupMenu() {
    var button = document.querySelector("[data-menu-toggle]");
    var menu = document.querySelector("[data-mobile-menu]");

    if (!button || !menu) {
      return;
    }

    button.addEventListener("click", function () {
      menu.classList.toggle("open");
    });
  }

  function setupHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll("[data-hero-slide]"));
    var dots = Array.prototype.slice.call(document.querySelectorAll("[data-hero-dot]"));

    if (slides.length <= 1) {
      return;
    }

    var index = 0;
    var timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle("active", slideIndex === index);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle("active", dotIndex === index);
      });
    }

    function start() {
      stop();
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    function stop() {
      if (timer) {
        window.clearInterval(timer);
      }
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        show(Number(dot.getAttribute("data-hero-dot")) || 0);
        start();
      });
    });

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      hero.addEventListener("mouseenter", stop);
      hero.addEventListener("mouseleave", start);
    }

    start();
  }

  function setupFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));

    scopes.forEach(function (scope) {
      var input = scope.querySelector("[data-filter-input]");
      var year = scope.querySelector("[data-filter-year]");
      var region = scope.querySelector("[data-filter-region]");
      var list = scope.querySelector("[data-filter-list]");
      var counter = scope.querySelector("[data-filter-count]");

      if (!list) {
        return;
      }

      var items = Array.prototype.slice.call(list.children);

      if (scope.hasAttribute("data-query-from-url") && input) {
        var params = new URLSearchParams(window.location.search);
        var query = params.get("q") || "";
        input.value = query;
      }

      function normalize(value) {
        return String(value || "").trim().toLowerCase();
      }

      function filter() {
        var term = normalize(input && input.value);
        var selectedYear = normalize(year && year.value);
        var selectedRegion = normalize(region && region.value);
        var visible = 0;

        items.forEach(function (item) {
          var haystack = normalize(item.textContent + " " + item.getAttribute("data-title") + " " + item.getAttribute("data-genre") + " " + item.getAttribute("data-type") + " " + item.getAttribute("data-region"));
          var itemYear = normalize(item.getAttribute("data-year"));
          var itemRegion = normalize(item.getAttribute("data-region"));
          var ok = true;

          if (term && haystack.indexOf(term) === -1) {
            ok = false;
          }

          if (selectedYear && itemYear !== selectedYear) {
            ok = false;
          }

          if (selectedRegion && itemRegion !== selectedRegion) {
            ok = false;
          }

          item.classList.toggle("hidden-by-filter", !ok);

          if (ok) {
            visible += 1;
          }
        });

        if (counter) {
          counter.textContent = String(visible);
        }
      }

      [input, year, region].forEach(function (control) {
        if (control) {
          control.addEventListener("input", filter);
          control.addEventListener("change", filter);
        }
      });

      filter();
    });
  }

  function setupPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll("[data-player]"));
    var hlsPromise = null;

    function loadHls(callback) {
      if (window.Hls) {
        callback();
        return;
      }

      if (!hlsPromise) {
        hlsPromise = new Promise(function (resolve) {
          var script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
          script.onload = resolve;
          script.onerror = resolve;
          document.head.appendChild(script);
        });
      }

      hlsPromise.then(callback);
    }

    players.forEach(function (player) {
      var video = player.querySelector("video");
      var button = player.querySelector("[data-play-button]");
      var source = player.getAttribute("data-src");
      var attached = false;

      if (!video || !source) {
        return;
      }

      function attach(callback) {
        if (attached) {
          callback();
          return;
        }

        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = source;
          attached = true;
          callback();
          return;
        }

        loadHls(function () {
          if (window.Hls && window.Hls.isSupported()) {
            var hls = new window.Hls();
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
              callback();
            });
            attached = true;
            return;
          }

          video.src = source;
          attached = true;
          callback();
        });
      }

      function play() {
        attach(function () {
          player.classList.add("playing");
          var promise = video.play();

          if (promise && typeof promise.catch === "function") {
            promise.catch(function () {
              player.classList.remove("playing");
            });
          }
        });
      }

      if (button) {
        button.addEventListener("click", play);
      }

      video.addEventListener("play", function () {
        player.classList.add("playing");
      });

      video.addEventListener("pause", function () {
        if (video.currentTime === 0 || video.ended) {
          player.classList.remove("playing");
        }
      });
    });
  }
})();
