(function () {
  if (window.Hls) {
    return;
  }

  var video = document.querySelector("[data-player] video");

  if (!video || video.canPlayType("application/vnd.apple.mpegurl")) {
    return;
  }

  var script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
  script.defer = true;
  document.head.appendChild(script);
})();
