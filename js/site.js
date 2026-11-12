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

  /* ---------- Footer year ---------- */

  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (node) {
    node.textContent = String(new Date().getFullYear());
  });

  /* ---------- Graphic design page ---------- */

  function initDesign() {
    var wall = document.getElementById('wall');
    if (!wall) return;

    var filters = document.getElementById('filters');
    var count = document.getElementById('count');
    var viewer = document.getElementById('viewer');
    var projects = collection(wall, 'design').filter(function (p) { return p && p.id && p.images && p.images.length; });
    var byId = {};
    var state = { category: 'All', projectId: null, imageIndex: 0 };

    if (!projects.length) {
      wall.parentNode.insertBefore(
        emptyMessage('No work added yet. Add projects to the design list in js/content.js and they will show up here.'),
        wall
      );
      return;
    }
    projects.forEach(function (p) { byId[p.id] = p; });

    /* Filter buttons, built from the categories you use */
    var categories = ['All'];
    projects.forEach(function (p) {
      if (p.category && categories.indexOf(p.category) === -1) categories.push(p.category);
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
      visibleProjects().forEach(function (p) {
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
      count.textContent = n + (n === 1 ? ' project' : ' projects');
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
      var open = h('button', { type: 'button', 'class': 'frame-open' }, [
        h('span', { 'class': 'frame-label' }, [
          h('span', { 'class': 'frame-title', text: p.title }),
          h('span', { 'class': 'frame-year', text: p.year ? String(p.year) : '' })
        ]),
        artwork(p.images[0], p.ratio, '', true)
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

    function showImage(index) {
      var p = byId[state.projectId];
      var image = p.images[index];
      state.imageIndex = index;
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
      meta.textContent = [p.category, p.year].filter(Boolean).join(', ');
      title.textContent = p.title;
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
      document.documentElement.classList.remove('modal-open');
      if (location.hash.indexOf('#project=') === 0) setHash('#work');
    });

    /* Share links: index.html#project=poster-series opens that project */
    function openFromHash() {
      var match = /^#project=(.+)$/.exec(location.hash);
      if (match) openProject(decodeURIComponent(match[1]));
      else if (viewer.open) viewer.close();
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

    items.forEach(function (p) {
      var figure = h('figure', { 'class': 'frame project-figure' }, [
        h('div', { 'class': 'frame-label' }, [
          h('span', { 'class': 'frame-title', text: p.kind || 'Project' }),
          h('span', { 'class': 'frame-year', text: p.year ? String(p.year) : '' })
        ])
      ]);
      if (p.image) figure.appendChild(artwork(p.image, p.ratio || '16 / 10', undefined, false, 'project-art'));

      var specs = h('dl', { 'class': 'specs' });
      specRow(specs, 'Role', p.role);

      var body = h('div', { 'class': 'project-body' }, [
        h('h2', { 'class': 'project-title', text: p.title }),
        p.summary ? h('p', { 'class': 'project-summary', text: p.summary }) : null,
        specs.children.length ? specs : null
      ]);

      if (p.stack && p.stack.length) {
        body.appendChild(h('ul', { 'class': 'stack', 'aria-label': 'Built with' }, p.stack.map(function (tech) {
          return h('li', { text: tech });
        })));
      }

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

      list.appendChild(h('li', { 'class': 'project' }, [figure, body]));
    });
  }

  initDesign();
  initSoftware();
})();
