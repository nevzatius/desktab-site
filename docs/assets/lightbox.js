/* Screenshot viewer: opens screenshots in a dialog with a close button. No external requests. */
(function () {
  'use strict';
  var links = document.querySelectorAll('.shot-link');
  if (!links.length || typeof HTMLDialogElement === 'undefined') return;
  var tr = (document.documentElement.lang || '').toLowerCase().indexOf('tr') === 0;
  var d = document.createElement('dialog');
  d.className = 'lb';
  d.setAttribute('aria-label', tr ? 'Ekran görüntüsü' : 'Screenshot');
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'lb-close';
  btn.setAttribute('aria-label', tr ? 'Kapat' : 'Close');
  btn.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18"/></svg>';
  var img = document.createElement('img');
  d.appendChild(btn);
  d.appendChild(img);
  document.body.appendChild(d);
  var opener = null;
  Array.prototype.forEach.call(links, function (a) {
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      var thumb = a.querySelector('img');
      img.src = a.getAttribute('href');
      img.alt = thumb ? thumb.alt : '';
      opener = a;
      d.showModal();
    });
  });
  btn.addEventListener('click', function () { d.close(); });
  d.addEventListener('click', function (e) { if (e.target !== img) d.close(); });
  d.addEventListener('close', function () { img.removeAttribute('src'); if (opener) opener.focus(); });
})();
