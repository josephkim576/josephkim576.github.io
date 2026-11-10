/* ==========================================================
   Joseph Y. Kim — Engineering Portfolio
   Vanilla JS, no dependencies.
   ========================================================== */
(() => {
  'use strict';

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     CONFIG: drop a file at this path to get a real PDF download.
     Without it, the "Download" buttons open a clean print view
     of the resume section (choose "Save as PDF").
     ---------------------------------------------------------- */
  const RESUME_PDF = 'assets/Joseph_Kim_Resume.pdf';

  /* ----------------------------------------------------------
     PROJECT CASE STUDIES (shown in the pop-up)
     Replace the [bracketed] prompts with your real details.
     ---------------------------------------------------------- */
  const PROJECTS = {
    hyrobotics: {
      short: 'HYRobotics internship',
      cat: 'Robotics',
      period: 'Summer 2026',
      title: 'HYRobotics: 3D Design Project',
      facts: [['Role', 'Mechanical Design Intern'], ['Company', 'HYRobotics, St. Louis, MO'], ['Timeframe', 'Summer 2026']],
      problem: 'Design collaborative-robot arm components and end-of-arm gripper tooling that can sort small, molded-in threaded inserts and survive atleast 1,200 repeated cycles without wearing out, while costing less than the existing steel tooling.',
      approach: [
        'Step 1: Produced a design matrix of possible prototypes, covering dimensions, geometry and application.',
        'Step 2: Eliminated redundant or impractical designs based on size, cost, and manufacturing repeatability.',
        'Step 3: Drew basic design on 2D sketch with Onshape, with a 3D design follow on Autodesk. After conducting preliminary FEA on the created models, modified the design by decreasing cross-sectional area as well as adding chamfers and fillets in order to increase yield strength and lower von mises stress on the component.'
      ],
      results: [
        'With a target von mises stress reduction of atleast 10% on the components, was successcully able to achieve that tagrget for 17/22 gripppers designed',
        'Out of the 17 designed components, the 13 that passed the design constraints as the 1,200 cycles were integrated into the collaboration robot toolkit'
      ],
      tools: ['CAD / FEA / Autodesk Fusion / OnShape', 'Microsoft Excel',]
    },
    fsae: {
      short: 'Formula SAE',
      cat: 'Motorsport',
      period: 'Formula SAE Build Team',
      title: 'Formula SAE: [subsystem you worked on]',
      facts: [['Role', 'Build Team Member'], ['Team', 'Formula SAE · [team name]'], ['Timeframe', '[Start year] – Present']],
      problem: '[What did the subsystem have to do, and what constraints (rules, weight, cost, schedule) shaped it?]',
      approach: [
        '[How you designed or selected the part, including any analysis or materials choice]',
        '[How you manufactured or assembled it, and which processes you used]',
        '[How you tested it and what changed afterward]'
      ],
      results: [
        '[Performance gain, weight saved, cost reduced or competition result]',
        '[What you handed off to the next team members]'
      ],
      tools: ['[CAD tool]', '[Manufacturing process]', '[Analysis / testing method]'],
      reflect: '[A design or build decision you would change, and why.]'
    },
    materials: {
      short: 'Materials project',
      cat: 'Materials',
      period: 'Coursework / lab',
      title: '[Materials or polymers project title]',
      facts: [['Role', '[Your role]'], ['Context', '[Course or lab, e.g. MSE 420]'], ['Timeframe', '[Semester, year]']],
      problem: '[What question were you investigating? Frame it as a materials problem: a property, a failure, a processing tradeoff.]',
      approach: [
        '[Materials and samples you used]',
        '[Processing and characterization methods, e.g. DSC, tensile testing, microscopy]',
        '[How you analyzed the data]'
      ],
      results: [
        '[Key finding with a number or a clear conclusion]',
        '[How the finding connects to real manufacturing or design decisions]'
      ],
      tools: ['[Equipment]', '[Software]', '[Method]'],
      reflect: '[A limitation of the experiment and what you would test next.]'
    },
    manufacturing: {
      short: 'Manufacturing project',
      cat: 'Manufacturing',
      period: 'Process / DFM',
      title: '[Manufacturing or process-improvement project]',
      facts: [['Role', '[Your role]'], ['Context', '[Team, class or job]'], ['Timeframe', '[Dates]']],
      problem: '[What was inefficient, inconsistent or hard to manufacture? Include a baseline number if you have one.]',
      approach: [
        '[How you mapped or measured the current process]',
        '[What you changed: design for manufacturing, fixturing, tooling, workflow]',
        '[How you validated the change]'
      ],
      results: [
        '[Before vs. after: time, scrap, cost or quality metric]',
        '[Whether the change was adopted and by whom]'
      ],
      tools: ['[Process]', '[Tool]', '[Metric]'],
      reflect: '[What you learned about working with people on the floor, or what you would measure differently.]'
    }
  };

  /* ---------- helpers ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const toast = (() => {
    const el = $('#toast');
    let t;
    return (msg) => {
      el.textContent = msg;
      el.classList.add('show');
      clearTimeout(t);
      t = setTimeout(() => el.classList.remove('show'), 2200);
    };
  })();

  /* Wrap any [bracketed text] in a highlighted placeholder so nothing slips through unnoticed. */
  function markPlaceholders(scope) {
    const walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode(n) {
        if (!/\[[^\]\n]{1,240}\]/.test(n.nodeValue)) return NodeFilter.FILTER_REJECT;
        const p = n.parentElement;
        if (!p || p.closest('script, style, noscript, textarea, .ph, #palette')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => {
      const frag = document.createDocumentFragment();
      node.nodeValue.split(/(\[[^\]\n]{1,240}\])/).forEach((part) => {
        if (/^\[[^\]\n]{1,240}\]$/.test(part)) {
          const s = document.createElement('span');
          s.className = 'ph';
          s.textContent = part;
          frag.appendChild(s);
        } else if (part) {
          frag.appendChild(document.createTextNode(part));
        }
      });
      node.parentNode.replaceChild(frag, node);
    });
  }

  const go = (hash) => {
    const el = $(hash);
    if (!el) return;
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    try { history.replaceState(null, '', hash); } catch (e) { /* ignore */ }
  };

  /* ---------- theme ---------- */
  function setTheme(t) {
    root.dataset.theme = t;
    try { localStorage.setItem('theme', t); } catch (e) { /* ignore */ }
    const m = $('meta[name="theme-color"]');
    if (m) m.setAttribute('content', t === 'light' ? '#f5f3ec' : '#0a0e14');
    document.dispatchEvent(new Event('themechange'));
  }
  const toggleTheme = () => setTheme(root.dataset.theme === 'light' ? 'dark' : 'light');
  $('#themeToggle').addEventListener('click', toggleTheme);

  /* ---------- platform-aware shortcut label ---------- */
  const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  const kbd = isMac ? '⌘ K' : 'Ctrl K';
  $('#kbdLabel').textContent = kbd;
  $('#kbdFoot').textContent = kbd;
  $('#year').textContent = new Date().getFullYear();

  /* ---------- mobile menu ---------- */
  const burger = $('#burger');
  const menu = $('#menu');
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      menu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---------- scroll progress ---------- */
  const bar = $('#progress');
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const h = root.scrollHeight - innerHeight;
      bar.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + '%';
      ticking = false;
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- scroll-spy ---------- */
  const links = $$('#menu a');
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.removeAttribute('aria-current'));
      const a = links.find((l) => l.getAttribute('href') === '#' + en.target.id);
      if (a) a.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach((s) => spy.observe(s));

  /* ---------- reveal on scroll ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  /* ---------- animated counters ---------- */
  $$('[data-count]').forEach((el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = target + suffix; return; }
    el.textContent = '0' + suffix;
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 1300;
      const tick = (now) => {
        const p = Math.min(1, (now - start) / dur);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
  });

  /* ---------- typing rotator ---------- */
  (() => {
    const el = $('#rotator');
    if (!el || reduceMotion) return;
    const words = ['materials science engineer', 'manufacturing-minded builder', 'robotics & motorsport builder', 'hands-on problem solver'];
    let w = 0, c = words[0].length, deleting = true;
    const step = () => {
      const word = words[w];
      if (deleting) {
        c--;
        el.textContent = word.slice(0, c);
        if (c === 0) { deleting = false; w = (w + 1) % words.length; }
        return setTimeout(step, 28);
      }
      const next = words[w];
      c++;
      el.textContent = next.slice(0, c);
      if (c === next.length) { deleting = true; return setTimeout(step, 1900); }
      return setTimeout(step, 55);
    };
    setTimeout(step, 1900);
  })();

  /* ---------- hero background: drifting "grain structure" network ---------- */
  (() => {
    const canvas = $('#grain');
    const hero = $('.hero');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, pts = [], raf = 0, visible = true;
    const mouse = { x: -9999, y: -9999 };
    let cLine = '#5cd6ff', cGold = '#e4b94a';

    const readColors = () => {
      const cs = getComputedStyle(root);
      cLine = cs.getPropertyValue('--cyan').trim() || cLine;
      cGold = cs.getPropertyValue('--gold').trim() || cGold;
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(90, Math.max(26, (w * h) / 16000)));
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.3 + 0.8
      }));
    };

    const draw = (animate) => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        if (animate) {
          p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > w) p.vx *= -1;
          if (p.y < 0 || p.y > h) p.vy *= -1;
          const dx = p.x - mouse.x, dy = p.y - mouse.y;
          const d = Math.hypot(dx, dy);
          if (d < 130 && d > 0.1) { p.x += (dx / d) * (130 - d) * 0.012; p.y += (dy / d) * (130 - d) * 0.012; }
        }
      }
      ctx.lineWidth = 1;
      ctx.strokeStyle = cLine;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 120) {
            ctx.globalAlpha = (1 - d / 120) * 0.32;
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke();
          }
        }
      }
      ctx.strokeStyle = cGold;
      for (const p of pts) {
        const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
        if (d < 170) {
          ctx.globalAlpha = (1 - d / 170) * 0.75;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
      }
      ctx.fillStyle = cLine;
      ctx.globalAlpha = 0.75;
      for (const p of pts) { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }
      ctx.globalAlpha = 1;
    };

    const loop = () => { draw(true); raf = visible ? requestAnimationFrame(loop) : 0; };

    readColors();
    resize();
    if (reduceMotion) { draw(false); } else { loop(); }

    document.addEventListener('themechange', () => { readColors(); if (reduceMotion) draw(false); });
    let rt;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { resize(); if (reduceMotion) draw(false); }, 150); });
    hero.addEventListener('pointermove', (e) => { const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
    if (!reduceMotion) {
      new IntersectionObserver((en) => {
        visible = en[0].isIntersecting;
        if (visible && !raf) loop();
      }).observe(hero);
    }
  })();

  /* ---------- card spotlight ---------- */
  document.addEventListener('pointermove', (e) => {
    const c = e.target.closest && e.target.closest('.card');
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    c.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* ---------- project filters ---------- */
  const filterBtns = $$('.chip-btn');
  filterBtns.forEach((b) => b.addEventListener('click', () => {
    filterBtns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
    const f = b.dataset.filter;
    $$('.project').forEach((p) => p.classList.toggle('hide', f !== 'all' && p.dataset.cat !== f));
  }));

  /* ---------- project case-study dialog ---------- */
  const dlg = $('#projDialog');
  function openProject(id) {
    const p = PROJECTS[id];
    const card = $(`.project[data-id="${id}"]`);
    if (!p || !card) return;
    const art = $('#pdArt');
    art.replaceChildren(card.querySelector('.thumb').cloneNode(true).firstElementChild);
    const photo = card.querySelector('.photo');
    if (photo) { const img = photo.cloneNode(); img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover'; art.appendChild(img); }
    $('#pdMeta').textContent = p.cat + ' · ' + p.period;
    $('#pdTitle').textContent = p.title;
    $('#pdFacts').innerHTML = p.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
    const list = (arr) => '<ul>' + arr.map((x) => `<li>${esc(x)}</li>`).join('') + '</ul>';
    $('#pdContent').innerHTML =
      `<div class="pd-sec"><h4>The problem</h4><p>${esc(p.problem)}</p></div>` +
      `<div class="pd-sec"><h4>What I did</h4>${list(p.approach)}</div>` +
      `<div class="pd-sec"><h4>The result</h4>${list(p.results)}</div>` +
      `<div class="pd-sec"><h4>Tools &amp; methods</h4><ul class="chips" style="gap:8px">${p.tools.map((t) => `<li class="chip">${esc(t)}</li>`).join('')}</ul></div>` +
      `<div class="pd-sec"><h4>What I'd do differently</h4><p>${esc(p.reflect)}</p></div>` +
      `<div class="pd-sec"><div class="pd-media">[Add CAD renders, photos, test plots or a short demo video here]</div></div>`;
    markPlaceholders(dlg);
    dlg.showModal();
    dlg.scrollTop = 0;
  }
  $$('.project').forEach((card) => card.querySelector('.proj-open').addEventListener('click', () => openProject(card.dataset.id)));
  $('#pdClose').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });

  /* ---------- resume download / print ---------- */
  let pdfReady = false;
  function printResume() {
    document.body.classList.add('print-resume');
    root.classList.add('print-resume');
    $$('#resume .reveal').forEach((el) => el.classList.add('in'));
    const done = () => {
      document.body.classList.remove('print-resume');
      root.classList.remove('print-resume');
      removeEventListener('afterprint', done);
    };
    addEventListener('afterprint', done);
    setTimeout(() => window.print(), 60);
  }
  function downloadResume() {
    if (pdfReady) {
      const a = document.createElement('a');
      a.href = RESUME_PDF; a.download = 'Joseph_Y_Kim_Resume.pdf';
      document.body.appendChild(a); a.click(); a.remove();
    } else {
      printResume();
    }
  }
  $$('[data-resume]').forEach((a) => a.addEventListener('click', (e) => { e.preventDefault(); downloadResume(); }));
  if (location.protocol.startsWith('http')) {
    fetch(RESUME_PDF, { method: 'HEAD' }).then((r) => { pdfReady = r.ok; }).catch(() => { /* no PDF yet: print view is used */ });
  }

  /* ---------- copy email ---------- */
  const getEmail = () => ($('a[href^="mailto:"]').getAttribute('href') || '').replace('mailto:', '');
  async function copyEmail() {
    const email = getEmail();
    try { await navigator.clipboard.writeText(email); toast('Email copied: ' + email); }
    catch (e) { toast(email); }
  }
  $('#copyEmail').addEventListener('click', copyEmail);

  /* ---------- command palette ---------- */
  const pal = $('#palette');
  const palInput = $('#palInput');
  const palList = $('#palList');
  const linkHref = (label) => { const a = $(`.socials a[aria-label="${label}"]`); return a ? a.href : null; };
  const commands = [
    { label: 'About', hint: 'Section', run: () => go('#about') },
    { label: 'Main achievements', hint: 'Section', run: () => go('#achievements') },
    { label: 'Projects', hint: 'Section', run: () => go('#projects') },
    { label: 'Resume', hint: 'Section', run: () => go('#resume') },
    { label: 'Contact', hint: 'Section', run: () => go('#contact') },
    ...Object.keys(PROJECTS).map((id) => ({ label: PROJECTS[id].short, hint: 'Case study', run: () => { go('#projects'); setTimeout(() => openProject(id), 350); } })),
    { label: 'Download resume', hint: 'Action', run: downloadResume },
    { label: 'Copy email address', hint: 'Action', run: copyEmail },
    { label: 'Open LinkedIn', hint: 'Link', run: () => window.open(linkHref('LinkedIn'), '_blank', 'noopener') },
    { label: 'Open GitHub', hint: 'Link', run: () => window.open(linkHref('GitHub'), '_blank', 'noopener') },
    { label: 'Toggle light / dark theme', hint: 'Action', run: toggleTheme }
  ];
  let shown = [], sel = 0;
  function renderPalette() {
    const q = palInput.value.trim().toLowerCase();
    shown = commands.filter((c) => !q || c.label.toLowerCase().includes(q) || c.hint.toLowerCase().includes(q));
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    palList.innerHTML = shown.length
      ? shown.map((c, i) => `<li role="option" data-i="${i}" aria-selected="${i === sel}">${esc(c.label)}<small>${esc(c.hint)}</small></li>`).join('')
      : '<li aria-selected="false">No matches</li>';
  }
  function runCommand(i) {
    const c = shown[i];
    if (!c) return;
    pal.close();
    setTimeout(c.run, 60);
  }
  function openPalette() { palInput.value = ''; sel = 0; renderPalette(); pal.showModal(); palInput.focus(); }
  $('#openPalette').addEventListener('click', openPalette);
  palInput.addEventListener('input', () => { sel = 0; renderPalette(); });
  palInput.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); sel = (sel + 1) % Math.max(1, shown.length); renderPalette(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); sel = (sel - 1 + shown.length) % Math.max(1, shown.length); renderPalette(); }
    else if (e.key === 'Enter') { e.preventDefault(); runCommand(sel); }
    const s = $('[aria-selected="true"]', palList);
    if (s && s.scrollIntoView) s.scrollIntoView({ block: 'nearest' });
  });
  palList.addEventListener('click', (e) => { const li = e.target.closest('li[data-i]'); if (li) runCommand(+li.dataset.i); });
  pal.addEventListener('click', (e) => { if (e.target === pal) pal.close(); });
  document.addEventListener('keydown', (e) => {
    const typing = /INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName);
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); pal.open ? pal.close() : openPalette(); }
    else if (e.key === '/' && !typing && !pal.open && !dlg.open) { e.preventDefault(); openPalette(); }
  });

  /* ---------- final pass: flag unfinished content ---------- */
  markPlaceholders(document.body);
  const left = $$('.ph').length;
  if (left) console.info(`[portfolio] ${left} placeholder(s) still to fill in (look for dashed gold highlights).`);
})();
