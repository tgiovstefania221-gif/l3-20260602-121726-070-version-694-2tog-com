(function () {
  function htmlEscape(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function normalize(value) {
    return String(value || '').toLowerCase().trim();
  }
  var input = document.querySelector('[data-site-search]');
  var year = document.querySelector('[data-search-year]');
  var region = document.querySelector('[data-search-region]');
  var grid = document.querySelector('[data-search-results]');
  var empty = document.querySelector('[data-search-empty]');
  if (!input || !grid || !window.SEARCH_MOVIES) return;

  var params = new URLSearchParams(window.location.search);
  input.value = params.get('q') || '';

  function render() {
    var q = normalize(input.value);
    var y = normalize(year && year.value);
    var r = normalize(region && region.value);
    var found = window.SEARCH_MOVIES.filter(function (item) {
      var haystack = normalize([item.title, item.one, item.year, item.region, item.genre, (item.tags || []).join(' ')].join(' '));
      if (q && haystack.indexOf(q) === -1) return false;
      if (y && normalize(item.year) !== y) return false;
      if (r && normalize(item.region) !== r) return false;
      return true;
    }).slice(0, 120);

    grid.innerHTML = found.map(function (item) {
      var tags = (item.tags || []).slice(0, 3).map(function (tag) {
        return '<span>' + htmlEscape(tag) + '</span>';
      }).join('');
      return '<article class="movie-card">' +
        '<a class="movie-card-link" href="' + htmlEscape(item.href) + '">' +
        '<figure class="poster-frame">' +
        '<img src="' + htmlEscape(item.cover) + '" alt="' + htmlEscape(item.title) + '" loading="lazy">' +
        '<span class="poster-badge">' + htmlEscape(item.year) + '</span>' +
        '<span class="play-chip">▶</span>' +
        '</figure>' +
        '<div class="movie-card-body">' +
        '<h2>' + htmlEscape(item.title) + '</h2>' +
        '<p>' + htmlEscape(item.one) + '</p>' +
        '<div class="card-meta"><span>' + htmlEscape(item.region) + '</span><span>' + htmlEscape(item.genre) + '</span></div>' +
        '<div class="tag-row">' + tags + '</div>' +
        '</div>' +
        '</a>' +
        '</article>';
    }).join('');
    if (empty) empty.classList.toggle('is-visible', found.length === 0);
  }

  [input, year, region].forEach(function (control) {
    if (control) control.addEventListener('input', render);
    if (control) control.addEventListener('change', render);
  });
  render();
})();
