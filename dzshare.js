/* DuelZone — canvas share cards. Load last before </body>. */
(function (global) {
  'use strict';

  function _safe(text) {
    if (!text) return '';
    // Strip HTML tags and control characters but keep emoji/unicode
    return String(text).replace(/<[^>]*>/g, '').replace(/[\x00-\x1F\x7F]/g, '');
  }

  function _hex2rgba(hex, alpha) {
    var h = hex.replace('#', '');
    if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
    var r = parseInt(h.slice(0, 2), 16);
    var g = parseInt(h.slice(2, 4), 16);
    var b = parseInt(h.slice(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + alpha + ')';
  }

  function createShareCard(options) {
    var opts = options || {};
    var w = opts.width || 600;
    var h = opts.height || 400;
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');

    var grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#000000');
    grad.addColorStop(1, _hex2rgba('#00e5ff', 0.15));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.fillStyle = '#00e5ff';
    ctx.font = 'bold 28px Plus Jakarta Sans, sans-serif';
    ctx.fillText(_safe('DuelZone'), 32, 52);

    if (typeof window !== 'undefined' && window.DZPlayer) {
      var pName = window.DZPlayer.name || 'Player';
      var pLevel = 'Lv.' + (window.DZPlayer.level || 1);
      
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px Plus Jakarta Sans, sans-serif';
      ctx.fillText(_safe(pName), w - 32, 42);
      
      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 14px Plus Jakarta Sans, sans-serif';
      ctx.fillText(_safe(pLevel), w - 32, 62);
      ctx.textAlign = 'left';
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Plus Jakarta Sans, sans-serif';
    ctx.fillText(_safe(opts.title || 'Victory!'), 32, 110);

    ctx.fillStyle = '#888888';
    ctx.font = '18px Plus Jakarta Sans, sans-serif';
    var subtitle = _safe(opts.subtitle || 'Play free at duelzone.online');
    ctx.fillText(subtitle, 32, 150);

    if (opts.stats) {
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(32, 180, w - 64, 80);
      ctx.strokeStyle = '#2a2a2a';
      ctx.strokeRect(32, 180, w - 64, 80);
      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 22px Plus Jakarta Sans, sans-serif';
      ctx.fillText(_safe(opts.stats), 48, 228);
    }

    ctx.fillStyle = '#9d4edd';
    ctx.font = '16px Plus Jakarta Sans, sans-serif';
    ctx.fillText(_safe('duelzone.online'), 32, h - 36);

    return canvas;
  }

  function shareWin(options) {
    var canvas = createShareCard(options);
    var dataUrl = canvas.toDataURL('image/png');
    if (navigator.share && options.tryNativeShare) {
      canvas.toBlob(function (blob) {
        if (!blob) return downloadDataUrl(dataUrl, 'duelzone-win.png');
        var file = new File([blob], 'duelzone-win.png', { type: 'image/png' });
        navigator.share({ files: [file], title: _safe(options.title || 'DuelZone Win') })
          .catch(function () { downloadDataUrl(dataUrl, 'duelzone-win.png'); });
      });
    } else {
      downloadDataUrl(dataUrl, 'duelzone-win.png');
    }
  }

  function downloadDataUrl(dataUrl, filename) {
    var a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  }

  global.dzShareSafe = _safe;
  global.dzShareHex2Rgba = _hex2rgba;
  global.dzCreateShareCard = createShareCard;
  global.dzShareWin = shareWin;
})(typeof window !== 'undefined' ? window : this);
