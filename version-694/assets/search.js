document.addEventListener('DOMContentLoaded', function () {
  var form = document.querySelector('[data-search-form]');
  var input = document.querySelector('[data-search-input]');
  var resultRoot = document.querySelector('[data-search-results]');
  var yearSelect = document.querySelector('[data-search-year]');
  var typeSelect = document.querySelector('[data-search-type]');
  var items = window.SEARCH_INDEX || [];

  function getQueryParam(name) {
    return new URLSearchParams(window.location.search).get(name) || '';
  }

  function render(results) {
    if (!resultRoot) {
      return;
    }

    if (!results.length) {
      resultRoot.innerHTML = '<div class="result-empty">没有匹配结果，请更换关键词或筛选条件。</div>';
      return;
    }

    resultRoot.innerHTML = results.slice(0, 240).map(function (item) {
      return [
        '<a class="movie-card" href="' + item.url + '">',
        '  <span class="cover-frame">',
        '    <img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
        '    <span class="play-badge">播放</span>',
        '    <span class="rating-badge">' + item.rating + '</span>',
        '  </span>',
        '  <span class="card-body">',
        '    <strong>' + escapeHtml(item.title) + '</strong>',
        '    <em>' + item.year + ' · ' + escapeHtml(item.region) + ' · ' + escapeHtml(item.type) + '</em>',
        '    <small>' + escapeHtml(item.oneLine) + '</small>',
        '  </span>',
        '</a>'
      ].join('');
    }).join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function runSearch() {
    var keyword = input ? input.value.trim().toLowerCase() : '';
    var year = yearSelect ? yearSelect.value : '';
    var type = typeSelect ? typeSelect.value : '';
    var results = items.filter(function (item) {
      var haystack = [
        item.title,
        item.year,
        item.region,
        item.type,
        item.genre,
        item.category,
        item.oneLine
      ].join(' ').toLowerCase();

      if (keyword && haystack.indexOf(keyword) === -1) {
        return false;
      }

      if (year && String(item.year) !== year) {
        return false;
      }

      if (type && item.type !== type) {
        return false;
      }

      return true;
    });

    results.sort(function (a, b) {
      return b.year - a.year || Number(b.rating) - Number(a.rating);
    });

    render(results);
  }

  if (input) {
    input.value = getQueryParam('q');
  }

  if (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      runSearch();
    });
  }

  [input, yearSelect, typeSelect].forEach(function (control) {
    if (control) {
      control.addEventListener('input', runSearch);
      control.addEventListener('change', runSearch);
    }
  });

  runSearch();
});
