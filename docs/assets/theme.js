/* Desktab theme switch. Loaded in <head> so the saved choice is applied before first paint.
   Without a saved choice the page follows the system setting. The choice is kept in localStorage only. */
(function () {
  'use strict';
  var KEY = 'desktab-theme';
  var root = document.documentElement;
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function saved() {
    try { var v = localStorage.getItem(KEY); return v === 'dark' || v === 'light' ? v : null; } catch (e) { return null; }
  }
  function current() { return saved() || (mq && mq.matches ? 'dark' : 'light'); }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0b1220' : '#eef1f6');
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      var tr = (root.lang || 'en').slice(0, 2) === 'tr';
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      btn.setAttribute('aria-label', tr
        ? (theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç')
        : (theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'));
    }
  }

  apply(current());

  document.addEventListener('DOMContentLoaded', function () {
    apply(current());
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, next); } catch (e) {}
      apply(next);
    });
  });

  if (mq && mq.addEventListener) {
    mq.addEventListener('change', function () { if (!saved()) apply(current()); });
  }
})();
