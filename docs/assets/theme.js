/* Desktab theme switch & UI navigation. Loaded in <head> so the saved choice is applied before first paint.
   Defaults to the dark product theme unless the visitor chooses light mode. Choice is kept in localStorage only. */
(function () {
  'use strict';
  var KEY = 'desktab-theme';
  var root = document.documentElement;

  function saved() {
    try { var v = localStorage.getItem(KEY); return v === 'dark' || v === 'light' ? v : null; } catch (e) { return null; }
  }
  function current() { return saved() || 'dark'; }

  function apply(theme) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'dark' ? '#0B0D12' : '#F6F8FB');
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      var tr = (root.lang || 'en').slice(0, 2) === 'tr';
      btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
      btn.setAttribute('aria-label', tr
        ? (theme === 'dark' ? 'Açık temaya geç' : 'Koyu temaya geç')
        : (theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'));
      btn.setAttribute('title', btn.getAttribute('aria-label'));
    }
  }

  apply(current());

  document.addEventListener('DOMContentLoaded', function () {
    apply(current());

    /* Theme toggle */
    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        try { localStorage.setItem(KEY, next); } catch (e) {}
        apply(next);
      });
    }

    /* Mobile navigation menu */
    var navToggle = document.getElementById('nav-toggle');
    var header = document.querySelector('.site-header');
    var nav = document.getElementById('site-nav');
    if (navToggle && header && nav) {
      var tr = (root.lang || 'en').slice(0, 2) === 'tr';
      var closeNav = function () {
        header.removeAttribute('data-nav-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', tr ? 'Menüyü aç' : 'Open menu');
      };
      var openNav = function () {
        header.setAttribute('data-nav-open', 'true');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', tr ? 'Menüyü kapat' : 'Close menu');
      };
      navToggle.addEventListener('click', function () {
        if (header.hasAttribute('data-nav-open')) closeNav();
        else openNav();
      });
      nav.addEventListener('click', function (e) {
        if (e.target.closest('a')) closeNav();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && header.hasAttribute('data-nav-open')) {
          closeNav();
          navToggle.focus();
        }
      });
      document.addEventListener('pointerdown', function (e) {
        if (header.hasAttribute('data-nav-open') && !header.contains(e.target)) {
          closeNav();
        }
      });
    }

    /* Product Showcase interactive tabs */
    var tablist = document.querySelector('[data-showcase-tabs]');
    if (tablist) {
      var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
      var panels = Array.prototype.slice.call(document.querySelectorAll('[data-showcase-panel]'));
      var activateTab = function (tab, focusTab) {
        var target = tab.getAttribute('data-showcase-tab');
        tabs.forEach(function (t) {
          var active = t === tab;
          t.setAttribute('aria-selected', active ? 'true' : 'false');
          t.setAttribute('tabindex', active ? '0' : '-1');
          t.classList.toggle('is-active', active);
        });
        panels.forEach(function (p) {
          var match = p.getAttribute('data-showcase-panel') === target;
          p.hidden = !match;
          p.classList.toggle('is-active', match);
        });
        if (focusTab) tab.focus();
      };
      tabs.forEach(function (tab, idx) {
        tab.addEventListener('click', function () { activateTab(tab, false); });
        tab.addEventListener('keydown', function (e) {
          var nextIdx = -1;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextIdx = (idx + 1) % tabs.length;
          else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nextIdx = (idx - 1 + tabs.length) % tabs.length;
          else if (e.key === 'Home') nextIdx = 0;
          else if (e.key === 'End') nextIdx = tabs.length - 1;
          if (nextIdx >= 0) {
            e.preventDefault();
            activateTab(tabs[nextIdx], true);
          }
        });
      });
    }
  });
})();
