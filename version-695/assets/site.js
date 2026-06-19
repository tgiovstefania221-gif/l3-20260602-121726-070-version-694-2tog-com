(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
      return;
    }
    document.addEventListener("DOMContentLoaded", fn);
  }

  ready(function () {
    var menuButton = document.querySelector("[data-menu-button]");
    var mobileMenu = document.querySelector("[data-mobile-menu]");
    if (menuButton && mobileMenu) {
      menuButton.addEventListener("click", function () {
        mobileMenu.classList.toggle("open");
      });
    }

    var hero = document.querySelector("[data-hero]");
    if (hero) {
      var slides = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-slide]"));
      var dots = Array.prototype.slice.call(hero.querySelectorAll("[data-hero-dot]"));
      var current = 0;
      function show(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
          slide.classList.toggle("active", i === current);
        });
        dots.forEach(function (dot, i) {
          dot.classList.toggle("active", i === current);
        });
      }
      var next = function () { show(current + 1); };
      var prev = function () { show(current - 1); };
      var nextButton = hero.querySelector("[data-hero-next]");
      var prevButton = hero.querySelector("[data-hero-prev]");
      if (nextButton) nextButton.addEventListener("click", next);
      if (prevButton) prevButton.addEventListener("click", prev);
      dots.forEach(function (dot) {
        dot.addEventListener("click", function () {
          show(Number(dot.getAttribute("data-hero-dot")) || 0);
        });
      });
      setInterval(next, 5000);
    }

    var data = window.searchData || [];
    function bindSearch(input) {
      var box = input.parentElement.querySelector("[data-search-results]");
      input.addEventListener("input", function () {
        var q = input.value.trim().toLowerCase();
        if (!box) return;
        if (!q) {
          box.classList.remove("open");
          box.innerHTML = "";
          return;
        }
        var hits = data.filter(function (item) {
          return item.text.indexOf(q) !== -1;
        }).slice(0, 12);
        box.innerHTML = hits.map(function (item) {
          return '<a class="result-item" href="' + item.url + '"><strong>' + item.title + '</strong><span>' + item.meta + '</span></a>';
        }).join("");
        box.classList.toggle("open", hits.length > 0);
      });
    }
    Array.prototype.forEach.call(document.querySelectorAll("[data-global-search]"), bindSearch);
    document.addEventListener("click", function (event) {
      Array.prototype.forEach.call(document.querySelectorAll("[data-search-results]"), function (box) {
        if (!box.parentElement.contains(event.target)) {
          box.classList.remove("open");
        }
      });
    });

    var localInput = document.querySelector("[data-local-search]");
    var cards = Array.prototype.slice.call(document.querySelectorAll("[data-card-list] [data-card]"));
    var activeFilter = "all";
    function applyLocal() {
      var q = localInput ? localInput.value.trim().toLowerCase() : "";
      cards.forEach(function (card) {
        var text = [
          card.getAttribute("data-title"),
          card.getAttribute("data-category"),
          card.getAttribute("data-region"),
          card.getAttribute("data-year")
        ].join(" ").toLowerCase();
        var okText = !q || text.indexOf(q) !== -1;
        var okFilter = activeFilter === "all" || card.getAttribute("data-category") === activeFilter;
        card.classList.toggle("hidden", !(okText && okFilter));
      });
    }
    if (localInput && cards.length) {
      localInput.addEventListener("input", applyLocal);
    }
    Array.prototype.forEach.call(document.querySelectorAll("[data-local-filter]"), function (button) {
      button.addEventListener("click", function () {
        activeFilter = button.getAttribute("data-local-filter") || "all";
        Array.prototype.forEach.call(document.querySelectorAll("[data-local-filter]"), function (btn) {
          btn.classList.toggle("active", btn === button);
        });
        applyLocal();
      });
    });

    Array.prototype.forEach.call(document.querySelectorAll("[data-sort]"), function (button) {
      button.addEventListener("click", function () {
        var list = document.querySelector("[data-card-list]");
        if (!list) return;
        var key = button.getAttribute("data-sort") || "heat";
        Array.prototype.forEach.call(document.querySelectorAll("[data-sort]"), function (btn) {
          btn.classList.toggle("active", btn === button);
        });
        var sorted = Array.prototype.slice.call(list.querySelectorAll("[data-card]")).sort(function (a, b) {
          return Number(b.getAttribute("data-" + key) || 0) - Number(a.getAttribute("data-" + key) || 0);
        });
        sorted.forEach(function (card) {
          list.appendChild(card);
        });
      });
    });

    var player = document.querySelector("[data-player]");
    if (player) {
      var video = player.querySelector("video");
      var button = player.querySelector("[data-play-button]");
      var src = video ? video.getAttribute("data-src") : "";
      function loadVideo() {
        if (!video || !src) return;
        if (window.Hls && window.Hls.isSupported()) {
          if (!video._hlsReady) {
            var hls = new window.Hls();
            hls.loadSource(src);
            hls.attachMedia(video);
            video._hlsReady = true;
          }
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          if (!video.getAttribute("src")) {
            video.setAttribute("src", src);
          }
        }
      }
      loadVideo();
      function start() {
        loadVideo();
        player.classList.add("playing");
        var attempt = video.play();
        if (attempt && typeof attempt.catch === "function") {
          attempt.catch(function () {});
        }
      }
      if (button) button.addEventListener("click", start);
      if (video) {
        video.addEventListener("play", function () {
          player.classList.add("playing");
        });
      }
    }
  });
})();
