import { H as Hls } from './video-vendor-dru42stk.js';

document.addEventListener('DOMContentLoaded', function () {
  var player = document.querySelector('[data-hls-player]');

  if (!player) {
    return;
  }

  var video = player.querySelector('video');
  var overlay = player.querySelector('[data-player-overlay]');
  var button = player.querySelector('[data-play-button]');
  var message = player.querySelector('[data-player-message]');
  var source = video ? video.dataset.src : '';
  var hlsInstance = null;

  function setMessage(text) {
    if (message) {
      message.textContent = text;
    }
  }

  function attachSource() {
    if (!video || !source) {
      setMessage('当前页面未检测到可用播放源。');
      return Promise.resolve(false);
    }

    if (video.dataset.ready === '1') {
      return Promise.resolve(true);
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = source;
      video.dataset.ready = '1';
      setMessage('播放源已绑定，可使用播放器控制按钮观看。');
      return Promise.resolve(true);
    }

    if (Hls && Hls.isSupported()) {
      hlsInstance = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 90
      });

      hlsInstance.loadSource(source);
      hlsInstance.attachMedia(video);
      video.dataset.ready = '1';
      setMessage('HLS 播放器已初始化，可点击播放。');
      return Promise.resolve(true);
    }

    setMessage('当前浏览器暂不支持该 HLS 播放方式。');
    return Promise.resolve(false);
  }

  function startPlayback() {
    attachSource().then(function (ready) {
      if (!ready || !video) {
        return;
      }

      video.play().then(function () {
        if (overlay) {
          overlay.classList.add('is-hidden');
        }
      }).catch(function () {
        setMessage('浏览器阻止了自动播放，请再次点击播放器控制按钮。');
      });
    });
  }

  if (button) {
    button.addEventListener('click', startPlayback);
  }

  if (video) {
    video.addEventListener('play', function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    });

    video.addEventListener('error', function () {
      setMessage('播放源加载失败，请检查网络或 m3u8 源是否可访问。');
    });
  }

  attachSource();
});
