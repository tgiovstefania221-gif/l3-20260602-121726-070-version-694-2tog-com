(function () {
  function startPlayer(video, overlay, source) {
    if (!video || !source) return;
    if (overlay) overlay.classList.add('is-hidden');
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      if (video.src !== source) video.src = source;
      video.play().catch(function () {});
      return;
    }
    if (window.Hls && window.Hls.isSupported()) {
      if (!video.__hlsInstance) {
        video.__hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        video.__hlsInstance.loadSource(source);
        video.__hlsInstance.attachMedia(video);
      }
      video.play().catch(function () {});
    }
  }

  window.initMoviePlayer = function (source) {
    var video = document.querySelector('[data-video-player]');
    var overlay = document.querySelector('[data-video-overlay]');
    var button = document.querySelector('[data-play-button]');
    if (!video) return;
    video.addEventListener('click', function () {
      startPlayer(video, overlay, source);
    });
    if (button) {
      button.addEventListener('click', function () {
        startPlayer(video, overlay, source);
      });
    }
  };
})();
