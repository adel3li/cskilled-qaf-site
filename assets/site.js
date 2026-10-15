/*
 * CSkilled site layer — shared by every page.
 * Edit LINKS below to point the WhatsApp / social / login buttons at the real accounts.
 * An empty value keeps the in-site fallback (e.g. /contact); links in HIDE_IF_EMPTY are hidden instead.
 */
(function () {
  var LINKS = {
    whatsapp: '',   // e.g. 'https://wa.me/201000000000'
    telegram: '',   // e.g. 'https://t.me/cskilled'
    discord: '',    // e.g. 'https://discord.gg/xxxx'
    youtube: 'https://www.youtube.com/@cskilled',
    linkedin: '',
    facebook: '',
    scholar: '',
    login: ''       // e.g. 'https://www.cskilled.com/login'
  };
  var HIDE_IF_EMPTY = { linkedin: 1, facebook: 1, scholar: 1 };
  var SUPPORT_EMAIL = 'support@cskilled.com';

  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Reveal animations and counters: start when scrolled into view, then play to the end on a timer
  (function () {
    var els = $$('.cnt, .q-rv-in');
    if (!('IntersectionObserver' in window)) { els.forEach(function (el) { el.classList.add('is-in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    els.forEach(function (el) { io.observe(el); });
  })();

  // 1. External links
  $$('a[data-link]').forEach(function (a) {
    var key = a.getAttribute('data-link'), url = LINKS[key];
    if (url) {
      a.href = url;
      if (/^https?:/.test(url)) { a.target = '_blank'; a.rel = 'noopener'; }
    } else if (HIDE_IF_EMPTY[key]) {
      a.hidden = true; a.style.display = 'none';
    }
  });

  // 2. Mobile menu
  var bar = document.querySelector('.q-nav__in');
  if (bar && !bar.querySelector('.q-burger')) { // pages with their own menu (the home page) keep it
    var btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'q-jsburger';
    btn.setAttribute('aria-label', 'القائمة'); btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span class="cs-icon" aria-hidden="true">menu</span>';
    var drawer = document.createElement('nav');
    drawer.className = 'q-drawer'; drawer.id = 'q-drawer'; drawer.hidden = true;
    drawer.setAttribute('aria-label', 'القائمة');
    btn.setAttribute('aria-controls', 'q-drawer');
    $$('.q-links a', bar).forEach(function (a) {
      if (a.closest('nav')) drawer.appendChild(a.cloneNode(true));
    });
    var sep = document.createElement('div'); sep.className = 'q-drawer__sep'; drawer.appendChild(sep);
    var actions = bar.querySelector(':scope > div:last-of-type');
    if (actions) $$('a', actions).forEach(function (a, i, all) {
      var c = a.cloneNode(true); c.removeAttribute('style'); c.className = i === all.length - 1 ? 'q-drawer__cta' : '';
      drawer.appendChild(c);
    });
    bar.appendChild(btn);
    document.body.appendChild(drawer); // outside the header: its backdrop-filter would trap position:fixed
    var set = function (open) {
      drawer.hidden = !open; btn.setAttribute('aria-expanded', String(open));
      btn.firstChild.textContent = open ? 'close' : 'menu';
      document.body.classList.toggle('q-menu-open', open);
    };
    btn.addEventListener('click', function () { set(drawer.hidden); });
    drawer.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !drawer.hidden) { set(false); btn.focus(); } });
    window.addEventListener('resize', function () { if (window.innerWidth > 1180 && !drawer.hidden) set(false); });
  }

  // Wide comparison tables scroll sideways on phones
  $$('table.q-tbl').forEach(function (t) {
    var w = document.createElement('div'); w.className = 'q-tblwrap';
    t.parentNode.insertBefore(w, t); w.appendChild(t);
  });

  // Home page: header links that open the quiz (#qz) or pick a catalog tab (data-ct)
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#qz"], a[data-ct]');
    if (!a) return;
    var mn = document.getElementById('mn'); if (mn) mn.checked = false;
    if (a.getAttribute('href') === '#qz') {
      var qz = document.getElementById('qz');
      if (qz) { e.preventDefault(); qz.checked = true; qz.dispatchEvent(new Event('change', { bubbles: true })); }
    } else {
      var tab = document.getElementById(a.getAttribute('data-ct'));
      if (tab) { tab.checked = true; tab.dispatchEvent(new Event('change', { bubbles: true })); }
    }
  });

  // Track/diploma pages: any link to #gate also opens the free-lecture form
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href="#gate"], a[href$="#gate"]');
    if (!a) return;
    var href = a.getAttribute('href');
    if (href !== '#gate' && href.split('#')[0] !== location.pathname) return;
    var gb = document.getElementById('g-b');
    if (gb && !document.getElementById('g-c').checked) gb.checked = true;
  });

  if (location.hash === '#gate') { var gb0 = document.getElementById('g-b'); if (gb0) gb0.checked = true; }

  // Home-page quiz: recommend a diploma from the answers and link its free first lecture
  var go = document.querySelector('[data-qz-go]');
  if (go) {
    var NAMES = { 'diploma-python': 'البرمجة بلغة Python', 'diploma-dsa-python': 'هياكل البيانات والخوارزميات بلغة Python',
      'diploma-cpp': 'البرمجة والبرمجة الكائنية بلغة C++', 'diploma-dsa-cpp': 'هياكل البيانات والخوارزميات بلغة C++',
      'diploma-ml': 'تعلّم الآلة', 'diploma-dl': 'التعلّم العميق' };
    var on = function (id) { var el = document.getElementById(id); return !!(el && el.checked); };
    var pick = function () {
      var lvl = on('l-4') ? 4 : on('l-3') ? 3 : on('l-2') ? 2 : 1;
      var comp = on('g-comp');
      var d, why;
      if (on('f-dl') && lvl >= 4) { d = 'diploma-dl'; why = 'لأن مستواك يسمح لك أن تبدأ من التعلّم العميق مباشرة.'; }
      else if ((on('f-ai') || on('f-ml') || on('f-dl')) && lvl >= 3) { d = 'diploma-ml'; why = 'لأن لديك أساسًا برمجيًا يكفي لتبدأ تعلّم الآلة.'; }
      else if (lvl >= 3) { d = comp ? 'diploma-dsa-cpp' : 'diploma-dsa-python'; why = 'لأن الخطوة التالية بعد الأساسيات هي هياكل البيانات والخوارزميات.'; }
      else { d = comp ? 'diploma-cpp' : 'diploma-python'; why = comp ? 'لأن C++ هي لغة المسابقات، وتبدأ فيها من الصفر.' : 'لأنها تبدأ معك من أول سطر، وهي أساس مسار الذكاء الاصطناعي.'; }
      go.href = '/' + d + '#gate';
      $$('.qz__card b').forEach(function (b) { b.textContent = 'المحاضرة الأولى من ' + NAMES[d]; });
      $$('.qz__card b + span').forEach(function (sp) { sp.textContent = why; });
      $$('.qz__s6 .q-note').forEach(function (n) { n.innerHTML = NAMES[d] + ' · المحاضرة <bdi>01</bdi>'; });
    };
    document.addEventListener('change', function (e) { if (e.target.closest && e.target.closest('.qz__opts')) pick(); });
    pick();
  }

  // 3. Contact form (contact page): prefill from ?program=&plan=&currency=, validate, send by e-mail
  var form = document.querySelector('form.q-form');
  var sent = document.getElementById('sent');
  if (form && sent) {
    var q = new URLSearchParams(location.search);
    var email = form.querySelector('input[type="email"]');
    var name = form.querySelector('input[autocomplete="name"]');
    var msg = form.querySelector('textarea');
    var err = form.querySelector('.q-err');
    var topics = $$('input[name="topic"]', form);
    topics.forEach(function (r) { r.value = r.parentNode.textContent.trim(); });
    if (q.get('program')) {
      if (topics[0]) topics[0].checked = true;
      var cur = q.get('currency') === 'USD' ? 'بالدولار' : 'بالجنيه المصري';
      msg.value = 'أرغب في الاشتراك في ' + q.get('program') + (q.get('plan') ? ' — خطة: ' + q.get('plan') : '') + ' (' + cur + ').\nأرجو إرسال تفاصيل الدفع.';
      setTimeout(function () { form.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 300);
    }
    var valid = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v || ''); };
    var showErr = function (on) {
      if (err) err.style.display = on ? 'flex' : 'none';
      email.classList.toggle('is-error', on); email.setAttribute('aria-invalid', String(on));
    };
    showErr(false);
    email.addEventListener('input', function () { if (email.getAttribute('aria-invalid') === 'true') showErr(!valid(email.value)); });
    var go = form.querySelector('.q-go');
    var submit = function (e) {
      e.preventDefault();
      if (!valid(email.value)) { showErr(true); email.focus(); return; }
      showErr(false);
      var topic = (topics.filter(function (r) { return r.checked; })[0] || {}).value || '';
      var body = 'الاسم: ' + (name.value || '-') + '\nالبريد: ' + email.value + '\nالموضوع: ' + topic + '\n\n' + (msg.value || '');
      window.location.href = 'mailto:' + SUPPORT_EMAIL + '?subject=' + encodeURIComponent('رسالة من الموقع: ' + topic) + '&body=' + encodeURIComponent(body);
      sent.checked = true;
    };
    if (go) { go.removeAttribute('for'); go.setAttribute('role', 'button'); go.tabIndex = 0;
      go.addEventListener('click', submit);
      go.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') submit(e); });
    }
    form.removeAttribute('onsubmit');
    form.addEventListener('submit', submit);
  }
})();
