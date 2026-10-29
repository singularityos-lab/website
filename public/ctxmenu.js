(function () {
  var menu = null;
  var openLabel = null;

  var ICONS = {
    open: '<svg viewBox="0 0 24 24"><path d="M14 3h7v7h-2V6.4l-8.3 8.3-1.4-1.4L17.6 5H14V3zM5 5h6v2H5v12h12v-6h2v8H3V5z"/></svg>',
    newwin: '<svg viewBox="0 0 24 24"><path d="M3 4h18v16H3V4zm2 4v10h14V8H5zm6 1h2v3h3v2h-3v3h-2v-3H8v-2h3V9z"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 19.2l1-5.8L3.5 9.2l5.9-.9z"/></svg>',
    quit: '<svg viewBox="0 0 24 24"><path d="M16 13v-2H7V8l-5 4 5 4v-3h9zM20 3h-8v2h8v14h-8v2h8a2 2 0 002-2V5a2 2 0 00-2-2z"/></svg>',
    kill: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-3 7h6v6H9V9z"/></svg>',
  };

  var APP_MENUS = {
    File: ['New', 'Open…', 'Save', 'Save As…', '-', 'Close'],
    Edit: ['Undo', 'Redo', '-', 'Cut', 'Copy', 'Paste', '-', 'Select All'],
    View: ['Zoom In', 'Zoom Out', 'Reset Zoom', '-', 'Fullscreen'],
    Window: ['Minimize', '-', 'Close'],
  };

  function close() {
    if (menu) { menu.remove(); menu = null; }
    if (openLabel) { openLabel.classList.remove('open'); openLabel = null; }
  }

  function build(items) {
    var el = document.createElement('div');
    el.className = 'ctx-menu';
    items.forEach(function (it) {
      if (it === '-') {
        var s = document.createElement('div');
        s.className = 'ctx-sep';
        el.appendChild(s);
        return;
      }
      var r = document.createElement('div');
      r.className = 'row' + (it.destructive ? ' destructive' : '');
      if (it.icon) r.innerHTML = it.icon;
      r.appendChild(document.createTextNode(it.label));
      r.addEventListener('mousedown', function (ev) { ev.preventDefault(); });
      r.addEventListener('click', close);
      el.appendChild(r);
    });
    return el;
  }

  function place(x, y) {
    menu.style.visibility = 'hidden';
    document.body.appendChild(menu);
    var w = menu.offsetWidth, h = menu.offsetHeight;
    menu.style.left = Math.min(x, window.innerWidth - w - 8) + 'px';
    menu.style.top = Math.min(y, window.innerHeight - h - 8) + 'px';
    menu.style.visibility = 'visible';
  }

  function dockItems(name, shift) {
    var items = [
      { icon: ICONS.open, label: name ? 'Open ' + name : 'Open' },
      { icon: ICONS.newwin, label: 'New Window' },
      '-',
      { icon: ICONS.star, label: 'Keep in Dock' },
      '-',
      { icon: ICONS.quit, label: 'Quit', destructive: true },
    ];
    if (shift) {
      items.push('-');
      items.push({ icon: ICONS.kill, label: 'Force Kill', destructive: true });
    }
    return items;
  }

  document.addEventListener('contextmenu', function (e) {
    var dock = e.target.closest('.dock');
    if (!dock) return;
    e.preventDefault();
    close();
    var img = e.target.closest('img');
    var name = img ? img.getAttribute('alt') : null;
    menu = build(dockItems(name, e.shiftKey));
    place(e.clientX, e.clientY);
  });

  document.addEventListener('click', function (e) {
    var mi = e.target.closest('.global-menu .mi');
    if (mi) {
      var label = mi.getAttribute('data-menu');
      var wasOpen = openLabel === mi;
      close();
      if (wasOpen || !APP_MENUS[label]) return;
      openLabel = mi;
      mi.classList.add('open');
      menu = build(APP_MENUS[label].map(function (l) { return l === '-' ? '-' : { label: l }; }));
      var r = mi.getBoundingClientRect();
      place(r.left, r.bottom + 4);
      return;
    }
    if (!e.target.closest('.ctx-menu')) close();
  });

  document.addEventListener('scroll', close, true);
  window.addEventListener('resize', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
})();
