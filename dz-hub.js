/* DuelZone — hub rendering, search, filters, nav */
(function () {
  'use strict';

  function badgeHtml(game) {
    if (!game.badge) return '';
    var cls = game.badge === 'soon' ? 'soon' : game.badge;
    var label = game.badge === 'hot' ? 'HOT' : game.badge === 'new' ? 'NEW' : 'SOON';
    return '<span class="dz-badge ' + cls + '">' + label + '</span>';
  }

  function gameCardHtml(game) {
    var soon = game.status === 'soon' || !game.href;
    var tag = soon ? 'div' : 'a';
    var href = soon ? '' : ' href="' + game.href + '" data-dz-game="' + game.id + '"';
    var classes = 'dz-card' + (soon ? ' soon' : '');
    var style = soon ? '' : ' style="text-decoration:none;"';

    return '<' + tag + ' class="' + classes + '"' + href + style + ' data-category="' + game.category + '" data-title="' + game.title.toLowerCase() + '">' +
      badgeHtml(game) +
      '<div class="dz-card-icon">' + game.icon + '</div>' +
      '<div class="dz-card-content">' +
        '<div class="dz-card-name">' + game.title + '</div>' +
        '<div class="dz-card-desc">' + game.desc + '</div>' +
      '</div>' +
      '<div class="dz-card-footer"><span class="dz-card-plays">' + game.plays + '</span></div>' +
    '</' + tag + '>';
  }

  function miniCardHtml(game, rank) {
    return '<a href="' + (game.href || '#') + '" class="dz-card-mini" data-dz-game="' + game.id + '" style="text-decoration:none;color:inherit;">' +
      '<div class="dz-card-mini-rank">#' + rank + '</div>' +
      '<div class="dz-card-mini-icon">' + game.icon + '</div>' +
      '<div class="dz-card-mini-name">' + game.title + '</div>' +
      '<div class="dz-card-mini-plays">' + game.plays + '</div>' +
    '</a>';
  }

  function renderGamesGrid() {
    var grid = document.getElementById('dz-games-grid');
    if (!grid || typeof DZ_GAMES === 'undefined') return;
    grid.innerHTML = DZ_GAMES.map(gameCardHtml).join('');
  }

  function renderTrending() {
    var row = document.getElementById('dz-trending-row');
    if (!row || typeof dzTopRated !== 'function') return;
    var top = dzTopRated().slice(0, 5);
    row.innerHTML = top.map(function (g, i) { return miniCardHtml(g, i + 1); }).join('');
  }

  function filterGames(query, categoryKey) {
    var cards = document.querySelectorAll('#dz-games-grid .dz-card');
    var q = (query || '').trim().toLowerCase();
    var ids = null;
    if (categoryKey && DZ_FILTER_MAP && DZ_FILTER_MAP[categoryKey]) {
      ids = DZ_FILTER_MAP[categoryKey];
    } else if (categoryKey && categoryKey !== 'All') {
      ids = [categoryKey.toLowerCase()];
    }

    cards.forEach(function (card) {
      var title = card.getAttribute('data-title') || '';
      var cat = card.getAttribute('data-category') || '';
      var matchQ = !q || title.indexOf(q) >= 0 || cat.indexOf(q) >= 0;
      var matchCat = !ids || ids.indexOf(cat) >= 0 || ids.indexOf(title) >= 0;
      card.style.display = matchQ && matchCat ? '' : 'none';
    });
  }

  function bindSearch() {
    var input = document.querySelector('.dz-search-input');
    if (!input || input._dzSearchWired) return;
    input._dzSearchWired = true;
    input.addEventListener('input', function () {
      var active = document.querySelector('.dz-filter-pill.active');
      var cat = active ? active.textContent.trim() : 'All';
      filterGames(input.value, cat);
    });
  }

  function bindFilters() {
    document.querySelectorAll('.dz-filter-pill').forEach(function (pill) {
      if (pill._dzFilterWired) return;
      pill._dzFilterWired = true;
      pill.addEventListener('click', function () {
        document.querySelectorAll('.dz-filter-pill').forEach(function (p) { p.classList.remove('active'); });
        pill.classList.add('active');
        var input = document.querySelector('.dz-search-input');
        filterGames(input ? input.value : '', pill.textContent.trim());
      });
    });
  }

  function bindNav() {
    var panels = {
      home: document.getElementById('dz-panel-home'),
      games: document.getElementById('dz-panel-games'),
      profile: document.getElementById('dz-panel-profile'),
      about: document.getElementById('dz-panel-about')
    };

    function renderProfile() {
      if (typeof DZPlayer === 'undefined') return;
      document.getElementById('dz-prof-name').textContent = DZPlayer.data.name || 'Player';
      document.getElementById('dz-prof-level').textContent = DZPlayer.data.level;
      document.getElementById('dz-prof-matches').textContent = DZPlayer.data.matches;
      document.getElementById('dz-prof-xp-current').textContent = Math.floor(DZPlayer.data.xp) + ' XP';
      document.getElementById('dz-prof-xp-next').textContent = DZPlayer.xpForNextLevel() + ' XP';
      
      var fill = document.getElementById('dz-prof-xp-fill');
      if (fill) {
        fill.style.width = '0%';
        setTimeout(function() {
          fill.style.width = DZPlayer.getProgressPercent() + '%';
        }, 50);
      }
      
      var tMusic = document.getElementById('dz-toggle-music');
      var tSfx = document.getElementById('dz-toggle-sfx');
      if (tMusic) tMusic.checked = DZPlayer.data.prefs.music;
      if (tSfx) tSfx.checked = DZPlayer.data.prefs.sfx;
    }

    var editBtn = document.getElementById('dz-prof-edit-name');
    if (editBtn && !editBtn._dzWired) {
      editBtn._dzWired = true;
      editBtn.addEventListener('click', function() {
        var newName = prompt("Enter your username:", DZPlayer.data.name || "Player");
        if (newName !== null) {
          DZPlayer.setName(newName);
          renderProfile();
        }
      });
    }

    document.querySelectorAll('.dz-nav-item[data-nav]').forEach(function (btn) {
      if (btn._dzNavWired) return;
      btn._dzNavWired = true;
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-nav');
        document.querySelectorAll('.dz-nav-item').forEach(function (n) { n.classList.remove('active'); });
        btn.classList.add('active');
        
        // Hide all panels, strip animation class
        Object.keys(panels).forEach(function (k) {
          if (panels[k]) {
            panels[k].classList.add('hidden');
            panels[k].classList.remove('dz-panel--animated');
          }
        });

        // Show active panel with animation
        if (panels[key]) {
          panels[key].classList.remove('hidden');
          // Trigger reflow then add animation
          void panels[key].offsetHeight;
          panels[key].classList.add('dz-panel--animated');
        }
        
        if (key === 'profile') renderProfile();
        if (key === 'games') {
          var el = document.getElementById('dz-games-section');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Wire up settings toggles
    var tMusic = document.getElementById('dz-toggle-music');
    var tSfx = document.getElementById('dz-toggle-sfx');
    if (tMusic) tMusic.addEventListener('change', function(e) {
      if (typeof DZAudio !== 'undefined') DZAudio.toggleMusic(e.target.checked);
    });
    if (tSfx) tSfx.addEventListener('change', function(e) {
      if (typeof DZAudio !== 'undefined') DZAudio.toggleSFX(e.target.checked);
    });
  }

  function heroCycle() {
    var dynEl = document.getElementById('dynamicWord');
    if (!dynEl) return;
    var words = ['Play.', 'Challenge.', 'Compete.', 'Dominate.'];
    var wi = 0;
    setInterval(function () {
      dynEl.style.opacity = '0';
      dynEl.style.transform = 'translateY(-8px)';
      setTimeout(function () {
        wi = (wi + 1) % words.length;
        dynEl.textContent = words[wi];
        dynEl.style.opacity = '1';
        dynEl.style.transform = 'translateY(0)';
      }, 300);
    }, 2000);
  }

  function initParticles() {
    var canvas = document.getElementById('dz-hero-particles');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var w, h;
    var particles = [];
    
    function resize() {
      w = canvas.width = canvas.parentElement.offsetWidth;
      h = canvas.height = canvas.parentElement.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();
    
    for(var i=0; i<30; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5 - 0.2, // slight upward drift
        r: Math.random() * 2 + 1,
        alpha: Math.random() * 0.5 + 0.1
      });
    }
    
    function loop() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = 'rgba(0, 229, 255, 1)';
      
      for(var i=0; i<particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;
        
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderGamesGrid();
    renderTrending();
    bindSearch();
    bindFilters();
    bindNav();
    heroCycle();
    initParticles();
    if (typeof dzBindGameLinks === 'function') dzBindGameLinks();
  });
  
  // Handle Loader removal and First-time Setup
  window.addEventListener('load', function() {
    var loader = document.getElementById('dz-loader');
    if (loader) {
      loader.classList.add('hidden-loader');
      setTimeout(function() { loader.style.display = 'none'; }, 600);
    }

    // First time user name prompt
    if (!localStorage.getItem('dz_player_v1')) {
      setTimeout(function() {
        var name = prompt("Welcome to DuelZone! What is your player name?");
        if (name && name.trim().length > 0) {
          DZPlayer.setName(name);
          renderProfile();
        } else {
          DZPlayer.save(); // save default so they aren't prompted endlessly if they cancel
        }
      }, 700); // Wait for loader animation to finish
    }
  });
})();
