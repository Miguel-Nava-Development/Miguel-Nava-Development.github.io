/*
  Site behaviour. You should not need to edit this file to add work:
  projects come from js/content.js.
*/
(function () {
  'use strict';

  var data = window.PORTFOLIO || {};

  /* A page picks its list with data-collection="name" (default: design / software). */
  function collection(node, fallback) {
    var list = data[node.getAttribute('data-collection') || fallback];
    return Array.isArray(list) ? list : [];
  }

  /* ---------- Small helpers ---------- */

  function h(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (key) {
        var value = attrs[key];
        if (value === null || value === undefined || value === false) return;
        if (key === 'text') node.textContent = value;
        else if (key === 'class') node.className = value;
        else node.setAttribute(key, value === true ? '' : value);
      });
    }
    (children || []).forEach(function (child) {
      if (child) node.appendChild(child);
    });
    return node;
  }

  function handles() {
    return h('span', { 'class': 'handles', 'aria-hidden': 'true' }, [h('i'), h('i'), h('i'), h('i')]);
  }

  function artwork(image, ratio, alt, withHandles, className) {
    var box = h('span', { 'class': className || 'frame-art' });
    box.style.aspectRatio = ratio || '4 / 5';
    var img = h('img', {
      src: image.src,
      alt: alt === undefined ? (image.alt || '') : alt,
      loading: 'lazy',
      decoding: 'async'
    });
    img.addEventListener('error', function () {
      box.classList.add('is-missing');
      box.setAttribute('data-missing', image.src);
    });
    box.appendChild(img);
    if (withHandles) box.appendChild(handles());
    return box;
  }

  function emptyMessage(text) {
    return h('p', { 'class': 'empty', text: text });
  }

  function setHash(value) {
    try { history.replaceState(null, '', value); } catch (e) { /* some browsers block this on local files */ }
  }

  function specRow(list, label, value) {
    if (!value) return;
    list.appendChild(h('dt', { text: label }));
    list.appendChild(h('dd', { text: value }));
  }

  /* ---------- Footer year and live counts ---------- */

  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  /* <span data-count="tmeSocial">43</span> shows how many items are in that list. */
  Array.prototype.forEach.call(document.querySelectorAll('[data-count]'), function (node) {
    var list = data[node.getAttribute('data-count')];
    if (Array.isArray(list) && list.length) node.textContent = String(list.length);
  });

  /* ---------- Masonry helper (used by the flyers grid) ---------- */

  function ratioOf(text) {
    var m = /([\d.]+)\s*\/\s*([\d.]+)/.exec(text || '4 / 5');
    return m ? parseFloat(m[1]) / parseFloat(m[2]) : 0.8;
  }

  /* Put each node in whichever column is currently shortest. entries: [{ node, ratio }] */
  function balance(wall, entries) {
    var gap = parseFloat(getComputedStyle(wall).columnGap) || 32;
    var n = Math.max(1, Math.min(3, Math.floor((wall.clientWidth + gap) / (300 + gap))));
    var cols = [];
    var heights = [];
    wall.style.setProperty('--cols', n);
    wall.replaceChildren();
    for (var i = 0; i < n; i++) {
      var col = h('ul', { 'class': 'wall-col' });
      cols.push(col);
      heights.push(0);
      wall.appendChild(col);
    }
    entries.forEach(function (entry) {
      var k = heights.indexOf(Math.min.apply(null, heights));
      cols[k].appendChild(entry.node);
      heights[k] += 1 / entry.ratio + 0.2;
    });
    return n;
  }

  /* ---------- Gallery pages (graphic design samples and social posts) ---------- */

  function initDesign() {
    var wall = document.getElementById('wall');
    if (!wall) return;

    var filters = document.getElementById('filters');
    var count = document.getElementById('count');
    var viewer = document.getElementById('viewer');
    var noun = wall.getAttribute('data-noun') || 'project';
    var labelMode = wall.getAttribute('data-label');          /* "date": cards show the date, not the title */
    var limit = parseInt(wall.getAttribute('data-initial'), 10) || Infinity;
    var more = document.getElementById('more');
    var section = wall.closest('section');
    var projects = collection(wall, 'design').filter(function (p) { return p && p.id && p.images && p.images.length; });
    var byId = {};
    var state = { category: 'All', projectId: null, imageIndex: 0 };

    if (!projects.length) {
      wall.parentNode.insertBefore(
        emptyMessage('No work added yet. Add items to js/content.js and they will show up here.'),
        wall
      );
      return;
    }
    projects.forEach(function (p) { byId[p.id] = p; });

    /* Filter buttons, built from the categories you use. data-category-order="A|B|C" sets their order. */
    var categories = ['All'];
    projects.forEach(function (p) {
      if (p.category && categories.indexOf(p.category) === -1) categories.push(p.category);
    });
    var preferred = (wall.getAttribute('data-category-order') || '').split('|');
    categories.sort(function (a, b) {
      if (a === 'All') return -1;
      if (b === 'All') return 1;
      var ia = preferred.indexOf(a);
      var ib = preferred.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

    function matches(p) { return state.category === 'All' || p.category === state.category; }
    function visibleProjects() { return projects.filter(matches); }

    var frames = {};
    var lastColumns = 0;

    function ratioValue(text) {
      var m = /([\d.]+)\s*\/\s*([\d.]+)/.exec(text || '4 / 5');
      return m ? parseFloat(m[1]) / parseFloat(m[2]) : 0.8;
    }

    function columnCount() {
      var gap = parseFloat(getComputedStyle(wall).columnGap) || 32;
      return Math.max(1, Math.min(3, Math.floor((wall.clientWidth + gap) / (300 + gap))));
    }

    /* Put each project in whichever column is currently shortest. Heights come from
       each project's ratio, so this works before any image has loaded. */
    function layout() {
      var n = columnCount();
      var cols = [];
      var heights = [];
      lastColumns = n;
      wall.style.setProperty('--cols', n);
      wall.replaceChildren();
      for (var i = 0; i < n; i++) {
        var col = h('ul', { 'class': 'wall-col' });
        cols.push(col);
        heights.push(0);
        wall.appendChild(col);
      }
      visibleProjects().slice(0, limit).forEach(function (p) {
        var k = heights.indexOf(Math.min.apply(null, heights));
        cols[k].appendChild(frames[p.id]);
        heights[k] += 1 / ratioValue(p.ratio) + 0.15;
      });
    }

    function applyFilter(category) {
      state.category = category;
      Array.prototype.forEach.call(filters.children, function (button) {
        button.setAttribute('aria-pressed', String(button.getAttribute('data-category') === category));
      });
      layout();
      var n = visibleProjects().length;
      var shown = Math.min(n, limit);
      var plural = n === 1 ? noun : noun + 's';
      if (count) count.textContent = shown < n ? 'Showing ' + shown + ' of ' + n + ' ' + plural : n + ' ' + plural;
      if (more) {
        more.hidden = shown >= n;
        more.textContent = 'Show all ' + n + ' ' + plural;
      }
    }

    if (more) {
      more.addEventListener('click', function () {
        limit = Infinity;
        applyFilter(state.category);
      });
    }

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (columnCount() !== lastColumns) layout();
      }, 120);
    });

    if (categories.length > 2) {
      categories.forEach(function (category) {
        var button = h('button', { type: 'button', 'class': 'chip', 'data-category': category, text: category });
        button.addEventListener('click', function () { applyFilter(category); });
        filters.appendChild(button);
      });
    } else {
      filters.hidden = true;
    }

    /* The wall of work */
    projects.forEach(function (p) {
      var stamp = p.year ? String(p.year) : '';
      var cover = artwork(p.images[0], p.ratio, '', true);
      if (p.video) cover.classList.add('has-video');
      var open = h('button', {
        type: 'button',
        'class': 'frame-open',
        'aria-label': p.title + (p.video ? ', video' : '') + (stamp ? ', ' + stamp : '')
      }, [
        h('span', { 'class': 'frame-label' }, [
          h('span', { 'class': 'frame-title', text: labelMode === 'date' ? stamp : p.title }),
          h('span', { 'class': 'frame-year', text: labelMode === 'date' ? '' : stamp })
        ]),
        cover
      ]);
      open.addEventListener('click', function () { openProject(p.id); });
      frames[p.id] = h('li', { 'class': 'frame', 'data-id': p.id }, [open]);
    });
    applyFilter('All');

    /* Viewer */
    var art = document.getElementById('viewer-art');
    var thumbs = document.getElementById('viewer-thumbs');
    var meta = document.getElementById('viewer-meta');
    var title = document.getElementById('viewer-title');
    var summary = document.getElementById('viewer-summary');
    var specs = document.getElementById('viewer-specs');
    var posted = document.getElementById('viewer-posted');
    var link = document.getElementById('viewer-link');
    var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    /* "2026-04-15" becomes "April 15, 2026" */
    function longDate(iso) {
      var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || '');
      return m ? MONTH_NAMES[parseInt(m[2], 10) - 1] + ' ' + parseInt(m[3], 10) + ', ' + m[1] : '';
    }

    function stopVideo() {
      var playing = art.querySelector('video');
      if (playing) playing.pause();
    }

    function showImage(index) {
      var p = byId[state.projectId];
      var image = p.images[index];
      state.imageIndex = index;
      stopVideo();
      if (p.video && index === 0) {
        var clip = h('video', {
          controls: true,
          playsinline: true,
          preload: 'metadata',
          poster: image.src,
          src: p.video,
          'aria-label': image.alt || p.title
        });
        /* Landscape clips fill the width, tall ones fill the height */
        clip.className = ratioOf(p.ratio) >= 1 ? 'is-landscape' : 'is-portrait';
        clip.style.aspectRatio = p.ratio;
        clip.addEventListener('error', function () {
          art.replaceChildren(emptyMessage('Video not found: ' + p.video));
        });
        art.replaceChildren(clip);
        return;
      }
      var img = h('img', { src: image.src, alt: image.alt || p.title });
      img.addEventListener('error', function () {
        art.replaceChildren(emptyMessage('Image not found: ' + image.src));
      });
      art.replaceChildren(img);
      Array.prototype.forEach.call(thumbs.children, function (li, i) {
        li.firstChild.setAttribute('aria-current', String(i === index));
      });
    }

    function fillViewer(p) {
      var when = longDate(p.date);
      /* The sentence below repeats the date, so the small line above the title drops it. */
      meta.textContent = [p.category, p.purpose && when ? '' : p.year].filter(Boolean).join(', ');
      title.textContent = p.title;
      if (p.purpose && when) {
        posted.textContent = 'I posted this ' + (p.approx ? 'around ' : 'on ') + when + ' with the purpose of ' + p.purpose + '.';
        posted.hidden = false;
      } else {
        posted.hidden = true;
      }
      if (p.link) {
        link.href = p.link;
        link.textContent = 'See the original on ' + (p.linkLabel || 'the web');
        link.hidden = false;
      } else {
        link.hidden = true;
      }
      summary.textContent = p.summary || '';
      summary.hidden = !p.summary;

      specs.replaceChildren();
      specRow(specs, 'Client', p.client);
      specRow(specs, 'Role', p.role);
      specRow(specs, 'Tools', (p.tools || []).join(', '));
      specs.hidden = !specs.children.length;

      thumbs.replaceChildren();
      if (p.images.length > 1) {
        p.images.forEach(function (image, i) {
          var b = h('button', { type: 'button', 'aria-label': 'Show image ' + (i + 1) + ' of ' + p.images.length }, [
            h('img', { src: image.src, alt: '' })
          ]);
          b.addEventListener('click', function () { showImage(i); });
          thumbs.appendChild(h('li', null, [b]));
        });
        thumbs.hidden = false;
      } else {
        thumbs.hidden = true;
      }
      showImage(0);
    }

    function openProject(id) {
      var p = byId[id];
      if (!p) return;
      state.projectId = id;
      fillViewer(p);
      if (!viewer.open) {
        viewer.showModal();
        document.documentElement.classList.add('modal-open');
      }
      viewer.scrollTop = 0;
      setHash('#project=' + encodeURIComponent(id));
    }

    function step(delta) {
      var list = visibleProjects();
      var at = list.findIndex(function (p) { return p.id === state.projectId; });
      if (!list.length) return;
      openProject(list[(at + delta + list.length) % list.length].id);
    }

    document.getElementById('viewer-close').addEventListener('click', function () { viewer.close(); });
    document.getElementById('viewer-prev').addEventListener('click', function () { step(-1); });
    document.getElementById('viewer-next').addEventListener('click', function () { step(1); });

    viewer.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowLeft') { event.preventDefault(); step(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); step(1); }
    });

    /* Click on the dark backdrop closes the viewer */
    viewer.addEventListener('click', function (event) {
      var r = viewer.getBoundingClientRect();
      var outside = event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
      if (outside) viewer.close();
    });

    viewer.addEventListener('close', function () {
      stopVideo();
      document.documentElement.classList.remove('modal-open');
      if (location.hash.indexOf('#project=') === 0) setHash(section && section.id ? '#' + section.id : location.pathname.split('/').pop() || '');
    });

    /* Share links: tim-mcdowell.html#project=social-20260730-1 opens that item */
    function openFromHash() {
      var match = /^#project=(.+)$/.exec(location.hash);
      if (match) openProject(decodeURIComponent(match[1]));
      else if (viewer.open) viewer.close();
    }
    window.addEventListener('hashchange', openFromHash);
    openFromHash();
  }

  /* ---------- Flyers, banners and ads: cards plus a flip-through reader ---------- */

  function initBooklets() {
    var wall = document.getElementById('booklets-wall');
    var reader = document.getElementById('reader');
    if (!wall || !reader) return;

    var items = collection(wall, 'tmeBooklets').filter(function (b) { return b && b.id && b.pages && b.pages.length; });
    var section = wall.closest('section');
    if (!items.length) {
      wall.parentNode.insertBefore(
        emptyMessage('No flyers added yet. Add them to the tmeBooklets list in js/content.js and they will show up here.'),
        wall
      );
      return;
    }
    var byId = {};
    items.forEach(function (b) { byId[b.id] = b; });

    /* Cards */
    var entries = items.map(function (b) {
      var pages = b.pages.length;
      var cover = artwork(b.cover, b.ratio, '', true);
      if (pages > 1) cover.appendChild(h('span', { 'class': 'page-badge', text: pages + ' pages' }));
      var open = h('button', {
        type: 'button',
        'class': 'frame-open',
        'aria-label': b.title + ', ' + b.event + ' ' + b.year + (pages > 1 ? ', ' + pages + ' pages. Open to flip through.' : '. Open to view.')
      }, [
        h('span', { 'class': 'frame-label' }, [
          h('span', { 'class': 'frame-title', text: b.title }),
          h('span', { 'class': 'frame-year', text: String(b.year) })
        ]),
        cover,
        h('span', { 'class': 'frame-caption', text: b.event })
      ]);
      open.addEventListener('click', function () { openBooklet(b.id); });
      return { node: h('li', { 'class': 'frame', 'data-id': b.id }, [open]), ratio: ratioOf(b.ratio) };
    });

    var lastColumns = 0;
    function layout() { lastColumns = balance(wall, entries); }
    layout();

    var gridTimer;
    window.addEventListener('resize', function () {
      clearTimeout(gridTimer);
      gridTimer = setTimeout(function () {
        var gap = parseFloat(getComputedStyle(wall).columnGap) || 32;
        var n = Math.max(1, Math.min(3, Math.floor((wall.clientWidth + gap) / (300 + gap))));
        if (n !== lastColumns) layout();
      }, 120);
    });

    /* Reader */
    var area = document.getElementById('reader-area');
    var title = document.getElementById('reader-title');
    var meta = document.getElementById('reader-meta');
    var summary = document.getElementById('reader-summary');
    var status = document.getElementById('reader-status');
    var range = document.getElementById('reader-range');
    var rangeBox = document.getElementById('reader-range-box');
    var prevBtn = document.getElementById('reader-prev');
    var nextBtn = document.getElementById('reader-next');
    var sidePrev = document.getElementById('reader-side-prev');
    var sideNext = document.getElementById('reader-side-next');
    var fullLink = document.getElementById('reader-full');

    var cur = null;       /* booklet on show */
    var mode = 'spread';  /* "spread" (flip book) or "single" (one page at a time) */
    var pos = 0;          /* spread: leaves already turned. single: page index */
    var book = null;
    var parts = [];       /* spread: leaves. single: sheets */
    var zTimer;
    var swiped = false;

    function pageCount() { return cur.pages.length; }
    function leafCount() { return Math.ceil(pageCount() / 2); }

    function pageRatio(p) { return p.w / p.h; }

    /* Booklets whose pages are all the same shape, and large enough on screen, open as a book. */
    function chooseMode(aw, ah) {
      if (cur.mode === 'single' || pageCount() < 3) return 'single';
      var r = pageRatio(cur.pages[0]);
      for (var i = 1; i < cur.pages.length; i++) {
        if (Math.abs(pageRatio(cur.pages[i]) / r - 1) > 0.03) return 'single';
      }
      var spreadH = Math.min(ah, aw / (2 * r));
      var singleH = Math.min(ah, aw / r);
      return spreadH >= 0.8 * singleH ? 'spread' : 'single';
    }

    function fit(ratio, boxW, boxH) {
      var w = Math.min(boxW, boxH * ratio);
      return { w: Math.floor(w), h: Math.floor(w / ratio) };
    }

    function pageImg(index) {
      var page = cur.pages[index];
      var img = h('img', { alt: cur.title + ', page ' + (index + 1) + ' of ' + pageCount(), decoding: 'async', draggable: 'false' });
      img.setAttribute('data-src', page.src);
      return img;
    }

    function load(img) {
      if (img && !img.getAttribute('src')) img.src = img.getAttribute('data-src');
    }

    function pageIndexNow() {
      if (mode === 'single') return pos;
      if (pos === 0) return 0;
      return 2 * pos < pageCount() ? 2 * pos : 2 * pos - 1;
    }

    /* ----- Flip book ----- */
    function buildSpread(aw, ah) {
      var r = pageRatio(cur.pages[0]);
      var size = fit(r, aw / 2, ah);
      book = h('div', { 'class': 'book book--spread' });
      book.style.setProperty('--pw', size.w + 'px');
      book.style.setProperty('--ph', size.h + 'px');
      parts = [];
      for (var i = 0; i < leafCount(); i++) {
        var front = h('div', { 'class': 'face face--front' }, [pageImg(2 * i)]);
        var back = h('div', { 'class': 'face face--back' }, 2 * i + 1 < pageCount() ? [pageImg(2 * i + 1)] : []);
        var leaf = h('div', { 'class': 'leaf' }, [front, back]);
        parts.push(leaf);
        book.appendChild(leaf);
      }
      book.addEventListener('click', function (event) {
        if (swiped) { swiped = false; return; }
        var box = book.getBoundingClientRect();
        step(event.clientX < box.left + box.width / 2 ? -1 : 1);
      });
    }

    function setZ() {
      var n = parts.length;
      parts.forEach(function (leaf, i) { leaf.style.zIndex = String(i < pos ? i : n - i); });
    }

    function showSpread(next, animate) {
      var n = parts.length;
      var old = pos;
      pos = Math.max(0, Math.min(n, next));
      var state = pos === 0 ? 'start' : (pos === n ? 'end' : 'middle');
      book.setAttribute('data-state', state);

      var turning = animate && Math.abs(pos - old) === 1 ? parts[Math.min(pos, old)] : null;
      if (!turning) book.classList.add('no-anim');
      parts.forEach(function (leaf, i) { leaf.classList.toggle('is-flipped', i < pos); });
      if (turning) {
        turning.style.zIndex = String(n + 2);
        clearTimeout(zTimer);
        zTimer = setTimeout(setZ, 760);
      } else {
        setZ();
        void book.offsetWidth;            /* apply without animating, then switch animation back on */
        book.classList.remove('no-anim');
      }

      /* Load the pages nearby */
      for (var i = Math.max(0, pos - 2); i < Math.min(n, pos + 3); i++) {
        Array.prototype.forEach.call(parts[i].querySelectorAll('img'), load);
      }
    }

    /* ----- One page at a time ----- */
    function buildSingle(aw, ah) {
      book = h('div', { 'class': 'book book--single' });
      parts = cur.pages.map(function (page, i) {
        var size = fit(pageRatio(page), aw, ah);
        var sheet = h('div', { 'class': 'sheet' }, [pageImg(i)]);
        sheet.style.width = size.w + 'px';
        sheet.style.height = size.h + 'px';
        book.appendChild(sheet);
        return sheet;
      });
    }

    function showSingle(next) {
      pos = Math.max(0, Math.min(parts.length - 1, next));
      parts.forEach(function (sheet, i) {
        sheet.classList.toggle('is-current', i === pos);
        sheet.classList.toggle('is-before', i < pos);
        sheet.classList.toggle('is-after', i > pos);
        sheet.setAttribute('aria-hidden', String(i !== pos));
        if (Math.abs(i - pos) <= 2) load(sheet.querySelector('img'));
      });
    }

    /* ----- Shared controls ----- */
    function last() { return mode === 'spread' ? parts.length : parts.length - 1; }

    function describe() {
      var n = pageCount();
      if (mode === 'single') return n === 1 ? '' : 'Page ' + (pos + 1) + ' of ' + n;
      var left = pos > 0 && 2 * pos - 1 < n ? 2 * pos : 0;
      var right = pos < parts.length && 2 * pos < n ? 2 * pos + 1 : 0;
      if (left && right) return 'Pages ' + left + ' and ' + right + ' of ' + n;
      return 'Page ' + (left || right) + ' of ' + n;
    }

    function refresh() {
      var text = describe();
      var multiple = last() > 0;
      status.textContent = text;
      range.max = String(last());
      range.value = String(pos);
      range.setAttribute('aria-valuetext', text);
      rangeBox.hidden = !multiple;
      [prevBtn, nextBtn, sidePrev, sideNext].forEach(function (b) { b.hidden = !multiple; });
      prevBtn.disabled = sidePrev.disabled = pos <= 0;
      nextBtn.disabled = sideNext.disabled = pos >= last();
      /* A disabled button cannot keep focus, so hand it to something that still works */
      var active = document.activeElement;
      if (active && active.disabled && reader.contains(active)) {
        var forward = active === nextBtn || active === sideNext;
        var alt = forward ? (prevBtn.disabled ? null : prevBtn) : (nextBtn.disabled ? null : nextBtn);
        (alt || document.getElementById('reader-close')).focus();
      }
      if (mode === 'single') {
        fullLink.href = cur.pages[pos].src;
        fullLink.hidden = false;
      } else {
        fullLink.hidden = true;
      }
    }

    function go(next, animate) {
      if (!cur) return;
      if (mode === 'spread') showSpread(next, animate); else showSingle(next);
      refresh();
    }

    function step(delta) { go(pos + delta, true); }

    function build(startPage) {
      var aw = Math.max(120, area.clientWidth - 16);
      var ah = Math.max(120, area.clientHeight - 40);     /* room for the page shadow */
      mode = chooseMode(aw, ah);
      if (mode === 'spread') buildSpread(aw, ah); else buildSingle(aw, ah);
      area.replaceChildren(book);
      var p = startPage || 0;
      go(mode === 'spread' ? Math.ceil(p / 2) : p, false);
    }

    function openBooklet(id) {
      var b = byId[id];
      if (!b) return;
      cur = b;
      title.textContent = b.title;
      meta.textContent = [b.event, b.year, b.pages.length > 1 ? b.pages.length + ' pages' : ''].filter(Boolean).join(', ');
      summary.textContent = b.summary || '';
      summary.hidden = !b.summary;
      if (!reader.open) {
        reader.showModal();
        document.documentElement.classList.add('modal-open');
      }
      build(0);
      setHash('#booklet=' + encodeURIComponent(id));
    }

    prevBtn.addEventListener('click', function () { step(-1); });
    nextBtn.addEventListener('click', function () { step(1); });
    sidePrev.addEventListener('click', function () { step(-1); });
    sideNext.addEventListener('click', function () { step(1); });
    range.addEventListener('input', function () { go(parseInt(range.value, 10) || 0, false); });
    document.getElementById('reader-close').addEventListener('click', function () { reader.close(); });

    document.addEventListener('keydown', function (event) {
      if (!reader.open || !cur) return;
      if (event.target === range) return;                 /* let the slider use its own arrow keys */
      if (event.key === 'ArrowLeft' || event.key === 'PageUp') { event.preventDefault(); step(-1); }
      else if (event.key === 'ArrowRight' || event.key === 'PageDown') { event.preventDefault(); step(1); }
      else if (event.key === 'Home') { event.preventDefault(); go(0, false); }
      else if (event.key === 'End') { event.preventDefault(); go(last(), false); }
    });

    /* Swipe to turn */
    var swipe = null;
    area.addEventListener('pointerdown', function (event) {
      swiped = false;
      swipe = { x: event.clientX, y: event.clientY };
    });
    area.addEventListener('pointerup', function (event) {
      if (!swipe) return;
      var dx = event.clientX - swipe.x;
      var dy = event.clientY - swipe.y;
      swipe = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > 1.5 * Math.abs(dy)) {
        swiped = true;                                    /* the click that follows should not turn a second page */
        step(dx < 0 ? 1 : -1);
      }
    });
    area.addEventListener('pointercancel', function () { swipe = null; });

    /* Click on the dark backdrop closes the reader */
    reader.addEventListener('click', function (event) {
      var r = reader.getBoundingClientRect();
      var outside = event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
      if (outside) reader.close();
    });

    reader.addEventListener('close', function () {
      document.documentElement.classList.remove('modal-open');
      cur = null;
      area.replaceChildren();
      if (location.hash.indexOf('#booklet=') === 0) setHash(section && section.id ? '#' + section.id : location.pathname.split('/').pop() || '');
    });

    /* Rebuild when the window changes shape, keeping the same page on show */
    var readerTimer;
    window.addEventListener('resize', function () {
      if (!cur || !reader.open) return;
      clearTimeout(readerTimer);
      /* Rebuild every time: page sizes depend on the space available */
      readerTimer = setTimeout(function () { build(pageIndexNow()); }, 150);
    });

    /* Share links: tim-mcdowell.html#booklet=cim-flyer-2026 opens that flyer */
    function openFromHash() {
      var match = /^#booklet=(.+)$/.exec(location.hash);
      if (match) openBooklet(decodeURIComponent(match[1]));
      else if (reader.open) reader.close();
    }
    window.addEventListener('hashchange', openFromHash);
    openFromHash();
  }

  /* ---------- Software page ---------- */

  function initSoftware() {
    var list = document.getElementById('projects');
    if (!list) return;

    var items = collection(list, 'software').filter(function (p) { return p && p.title; });
    if (!items.length) {
      list.parentNode.insertBefore(
        emptyMessage('No projects added yet. Add them to the software list in js/content.js and they will show up here.'),
        list
      );
      return;
    }

    var logos = (window.PORTFOLIO && window.PORTFOLIO.logos) || {};

    items.forEach(function (p) {
      var body = h('div', { 'class': 'project-body' }, [
        h('h2', { 'class': 'project-title', text: p.title })
      ]);

      if (p.stack && p.stack.length) {
        body.appendChild(h('ul', { 'class': 'stack', 'aria-label': 'Built with' }, p.stack.map(function (tech) {
          var logo = logos[tech];
          return h('li', { 'class': logo ? 'stack-item' : 'stack-item stack-item--text' }, [
            logo ? h('img', { src: logo, alt: '', width: 44, height: 44 }) : null,
            h('span', { text: tech })
          ]);
        })));
      }

      if (p.summary) body.appendChild(h('p', { 'class': 'project-summary', text: p.summary }));

      if (p.links && p.links.length) {
        body.appendChild(h('p', { 'class': 'project-links' }, p.links.map(function (link, i) {
          var external = /^https?:/.test(link.url || '');
          return h('a', {
            'class': i === 0 ? 'btn' : 'btn btn--quiet',
            href: link.url || '#',
            target: external ? '_blank' : null,
            rel: external ? 'noopener' : null,
            'aria-label': link.label + ' for ' + p.title,
            text: link.label
          });
        })));
      }

      list.appendChild(h('li', { 'class': 'project' }, [body]));
    });
  }

  /* ---------- YouTube posted videos (Tim McDowell page) ---------- */

  function initVideos() {
    var list = document.getElementById('videos');
    if (!list) return;

    var items = collection(list, 'youtube').filter(function (v) { return v && v.id && v.title; });
    if (!items.length) {
      list.parentNode.insertBefore(
        emptyMessage('No videos added yet. Add them to the youtube list in js/content.js and they will show up here.'),
        list
      );
      return;
    }

    function label(n) {
      n = Number(n);
      return n.toLocaleString('en-CA') + (n === 1 ? ' view' : ' views');
    }

    var counters = {};
    items.forEach(function (v) {
      var views = h('span', { 'class': 'video-views', text: v.views !== undefined ? label(v.views) : '' });
      counters[v.id] = views;
      list.appendChild(h('li', { 'class': 'video' }, [
        h('a', {
          'class': 'video-link',
          href: 'https://www.youtube.com/watch?v=' + v.id,
          target: '_blank',
          rel: 'noopener'
        }, [
          document.createTextNode(v.title),
          h('span', { 'class': 'visually-hidden', text: ' (opens on YouTube)' })
        ]),
        views
      ]));
    });

    var note = document.getElementById('videos-note');
    var asOf = data.youtubeViewsAsOf ? new Date(data.youtubeViewsAsOf + 'T12:00:00') : null;
    if (note && asOf && !isNaN(asOf)) {
      note.textContent = 'View counts as of ' +
        asOf.toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' }) + '.';
    }

    /* With a YouTube Data API key in js/content.js the counts refresh from YouTube on every visit. */
    var key = data.youtubeApiKey;
    if (!key || !window.fetch) return;
    var url = 'https://www.googleapis.com/youtube/v3/videos?part=statistics&id=' +
      items.map(function (v) { return v.id; }).join(',') + '&key=' + encodeURIComponent(key);
    fetch(url)
      .then(function (response) {
        if (!response.ok) throw new Error('YouTube did not answer');
        return response.json();
      })
      .then(function (result) {
        var updated = 0;
        (result.items || []).forEach(function (item) {
          var count = item.statistics && item.statistics.viewCount;
          if (count !== undefined && counters[item.id]) {
            counters[item.id].textContent = label(count);
            updated += 1;
          }
        });
        if (updated && note) note.textContent = 'View counts update automatically from YouTube.';
      })
      .catch(function () { /* keep the saved counts */ });
  }

  /* ---------- Contact page ---------- */

  function initContact() {
    var form = document.getElementById('contact-form');
    if (!form) return;
    var status = document.getElementById('form-status');
    var button = form.querySelector('button[type="submit"]');

    function say(text, state) {
      status.textContent = text;
      status.setAttribute('data-state', state || '');
    }

    form.addEventListener('submit', function (event) {
      var key = form.elements.access_key.value;
      if (!key || key.indexOf('YOUR_ACCESS_KEY') === 0) {
        event.preventDefault();
        say('This form is not switched on yet. Add the Web3Forms access key in contact.html.', 'error');
        return;
      }
      if (!window.fetch) return; /* old browser: let the form post normally */

      event.preventDefault();
      button.disabled = true;
      say('Sending...', '');

      var body = {};
      new FormData(form).forEach(function (value, name) { body[name] = value; });

      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(body)
      })
        .then(function (response) { return response.json(); })
        .then(function (result) {
          if (!result || !result.success) throw new Error('rejected');
          form.reset();
          say('Thanks, your message was sent. I will reply by email.', 'success');
        })
        .catch(function () {
          say('Your message was not sent. Check your connection and try again.', 'error');
        })
        .then(function () { button.disabled = false; });
    });
  }

  initDesign();
  initBooklets();
  initSoftware();
  initVideos();
  initContact();
})();
