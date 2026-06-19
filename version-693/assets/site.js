(function () {
    var toggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-main-nav]');

    if (toggle && nav) {
        toggle.addEventListener('click', function () {
            nav.classList.toggle('is-open');
        });
    }

    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-hero-slide]'));
    var next = document.querySelector('[data-hero-next]');
    var prev = document.querySelector('[data-hero-prev]');
    var current = 0;

    function showSlide(index) {
        if (!slides.length) {
            return;
        }
        current = (index + slides.length) % slides.length;
        slides.forEach(function (slide, i) {
            slide.classList.toggle('is-active', i === current);
        });
    }

    if (slides.length) {
        showSlide(0);
        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
            });
        }
        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
            });
        }
        window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var filterForms = Array.prototype.slice.call(document.querySelectorAll('[data-filter-scope]'));

    filterForms.forEach(function (scope) {
        var search = scope.querySelector('[data-filter-search]');
        var year = scope.querySelector('[data-filter-year]');
        var type = scope.querySelector('[data-filter-type]');
        var sort = scope.querySelector('[data-filter-sort]');
        var cards = Array.prototype.slice.call(scope.querySelectorAll('.movie-card'));
        var empty = scope.querySelector('[data-empty-state]');

        function normalize(value) {
            return String(value || '').toLowerCase().trim();
        }

        function applyFilters() {
            var q = normalize(search && search.value);
            var y = year && year.value;
            var t = type && type.value;
            var shown = 0;

            cards.forEach(function (card) {
                var text = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-genre')
                ].join(' '));
                var matchSearch = !q || text.indexOf(q) !== -1;
                var matchYear = !y || card.getAttribute('data-year') === y;
                var matchType = !t || card.getAttribute('data-type') === t;
                var visible = matchSearch && matchYear && matchType;
                card.style.display = visible ? '' : 'none';
                if (visible) {
                    shown += 1;
                }
            });

            if (sort && sort.value) {
                var grid = scope.querySelector('.movie-grid');
                if (grid) {
                    cards.sort(function (a, b) {
                        if (sort.value === 'year') {
                            return Number(b.getAttribute('data-year')) - Number(a.getAttribute('data-year'));
                        }
                        if (sort.value === 'heat') {
                            return Number(b.getAttribute('data-heat')) - Number(a.getAttribute('data-heat'));
                        }
                        return normalize(a.getAttribute('data-title')).localeCompare(normalize(b.getAttribute('data-title')), 'zh-Hans-CN');
                    }).forEach(function (card) {
                        grid.appendChild(card);
                    });
                }
            }

            if (empty) {
                empty.style.display = shown ? 'none' : 'block';
            }
        }

        [search, year, type, sort].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilters);
                control.addEventListener('change', applyFilters);
            }
        });

        applyFilters();
    });
})();
