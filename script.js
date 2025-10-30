/* dein vorhandener Code bleibt unverändert … */
const order = [
  "index.html",
  "ueber-mich.html",
  "diskografie.html",
  "kontakt.html",
  "aktuell.html",
  "gesehen.html",
  "plattformen.html"
];

function setArrowLinks() {
  const path = window.location.pathname;
  const file = path.split('/').pop() || "index.html";
  const idx = order.indexOf(file);

  const left = document.querySelector('.nav-arrow.left');
  const right = document.querySelector('.nav-arrow.right');

  if (idx === -1) return;

  if (file === "index.html") {
    if (left) left.style.display = "none";
    if (right) right.style.display = "none";
    return;
  }

  const prev = order[(idx - 1 + order.length) % order.length];
  const next = order[(idx + 1) % order.length];

  if (left) left.setAttribute('href', prev);
  if (right) right.setAttribute('href', next);

  window.addEventListener('keydown', (e) => {
    if (e.key === "ArrowLeft") window.location.href = prev;
    if (e.key === "ArrowRight") window.location.href = next;
    if (e.key.toLowerCase() === "h") window.location.href = "index.html";
  });
}

document.addEventListener('DOMContentLoaded', setArrowLinks);


// ===== Retro Panel behavior (adds hover/focus description updates) =====
(function(){
  function setupRetroPanel(){
    var panel = document.querySelector('.retro-panel');
    if(!panel) return;
    var title = panel.querySelector('#rpTitle');
    var desc  = panel.querySelector('#rpDesc');
    var buttons = panel.querySelectorAll('.dial');
    function showDefault(){
      if(title && desc){
        title.textContent = 'über mich';
        desc.textContent  = 'Bio & Einblicke';
      }
    }
    showDefault();
    buttons.forEach(function(btn){
      var t = btn.getAttribute('data-title') || '';
      var d = btn.getAttribute('data-desc') || '';
      function show(){
        if(title) title.textContent = t;
        if(desc)  desc.textContent  = d;
      }
      btn.addEventListener('mouseenter', show);
      btn.addEventListener('focus', show);
      btn.addEventListener('mouseleave', showDefault);
      btn.addEventListener('blur', showDefault);
    });
  }
  if(document.readyState === 'complete' || document.readyState === 'interactive'){
    setupRetroPanel();
  }else{
    document.addEventListener('DOMContentLoaded', setupRetroPanel);
  }
})();


// === Hamburger-Menü ein-/ausblenden (NEU) ===
(() => {
  const btn   = document.querySelector('.hamburger');
  const menu  = document.getElementById('site-menu');
  const shade = document.getElementById('menu-overlay');
  if (!btn || !menu || !shade) return;

  const open = () => {
    document.body.classList.add('menu-open');
    btn.setAttribute('aria-expanded','true');
    menu.setAttribute('aria-hidden','false');
    shade.hidden = false;
  };
  const close = () => {
    document.body.classList.remove('menu-open');
    btn.setAttribute('aria-expanded','false');
    menu.setAttribute('aria-hidden','true');
    shade.hidden = true;
  };

  btn.addEventListener('click', () => {
    document.body.classList.contains('menu-open') ? close() : open();
  });
  shade.addEventListener('click', close);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();
