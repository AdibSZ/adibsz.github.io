/* ============================================
   اسکریپت اصلی وبسایت
   تمام تعاملات و رندر محتوا در این فایل
   ============================================ */

(function () {
  'use strict';

  const data = PORTFOLIO_DATA;

  /* ============================================
     ۱) رندر محتوا از داده‌ها
     ============================================ */
  function renderContent() {
    // اطلاعات پروفایل
    setText('[data-profile-name]', data.profile.name);
    setText('[data-profile-initial]', data.profile.initial);
    setText('[data-profile-title]', data.profile.title);
    setText('[data-profile-tagline]', data.profile.tagline);

    // درباره من
    const aboutText = document.getElementById('aboutText');
    if (aboutText) {
      aboutText.innerHTML = data.about.paragraphs.map(p => `<p>${p}</p>`).join('');
    }

    // آمار
    const aboutStats = document.getElementById('aboutStats');
    if (aboutStats) {
      aboutStats.innerHTML = data.stats.map((s, i) => `
        <div class="stat" data-reveal style="transition-delay: ${i * 0.1}s">
          <div class="stat__value">
            <span class="stat__number" data-target="${s.value}">0</span><span>${s.suffix}</span>
          </div>
          <div class="stat__label">${s.label}</div>
        </div>
      `).join('');
    }

    // تجربیات
    const timeline = document.getElementById('timeline');
    if (timeline) {
      timeline.innerHTML = data.experiences.map((exp, i) => `
        <div class="timeline__item" data-reveal style="transition-delay: ${i * 0.08}s">
          <span class="timeline__year">${exp.year}</span>
          <h3 class="timeline__title">${exp.title}</h3>
          <p class="timeline__org">${exp.org}</p>
          <p class="timeline__desc">${exp.description}</p>
          <div class="timeline__tags">
            ${exp.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        </div>
      `).join('');
    }

    // مهارت‌ها
    const skillsGrid = document.getElementById('skillsGrid');
    if (skillsGrid) {
      skillsGrid.innerHTML = data.skills.map((cat, i) => `
        <div class="skill-cat" data-reveal style="transition-delay: ${i * 0.1}s">
          <div class="skill-cat__head">
            <div class="skill-cat__icon">${ICONS[cat.icon] || ICONS.code}</div>
            <h3 class="skill-cat__title">${cat.category}</h3>
          </div>
          <div class="skill-cat__items">
            ${cat.items.map(item => `
              <div class="skill-item">
                <div class="skill-item__head">
                  <span class="skill-item__name">${item.name}</span>
                  <span class="skill-item__level">${item.level}٪</span>
                </div>
                <div class="skill-bar">
                  <div class="skill-bar__fill" data-level="${item.level}"></div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('');
    }

    // فیلتر پروژه‌ها
    const projectsFilters = document.getElementById('projectsFilters');
    if (projectsFilters) {
      const categories = ['همه', ...new Set(data.projects.map(p => p.category))];
      projectsFilters.innerHTML = categories.map((c, i) => `
        <button class="filter-btn ${i === 0 ? 'is-active' : ''}" data-filter="${c}">${c}</button>
      `).join('');
    }

    // پروژه‌ها
    renderProjects('همه');

    // مارکی
    const marqueeTrack = document.getElementById('marqueeTrack');
    if (marqueeTrack) {
      const items = [...data.keywords, ...data.keywords]; // دو بار برای تکرار
      marqueeTrack.innerHTML = items.map(k => `<span>${k}</span>`).join('');
    }

    // شبکه‌های اجتماعی هیرو
    const heroSocials = document.getElementById('heroSocials');
    if (heroSocials) {
      heroSocials.innerHTML = data.socials.slice(0, 4).map(s => `
        <a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name}" title="${s.name}">
          ${ICONS[s.icon] || ''}
        </a>
      `).join('');
    }

    // شبکه‌های اجتماعی فوتر
    const footerSocials = document.getElementById('footerSocials');
    if (footerSocials) {
      footerSocials.innerHTML = data.socials.map(s => `
        <a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name}" title="${s.name}">
          ${ICONS[s.icon] || ''}
        </a>
      `).join('');
    }

    // اطلاعات تماس
    const contactInfo = document.getElementById('contactInfo');
    if (contactInfo) {
      contactInfo.innerHTML = `
        <a class="contact__item" href="mailto:${data.contact.email}">
          <div class="contact__item-icon">${ICONS.email}</div>
          <div>
            <div class="contact__item-label">ایمیل</div>
            <div class="contact__item-value">${data.contact.email}</div>
          </div>
        </a>
        <a class="contact__item" href="tel:${data.contact.phone.replace(/\s/g, '')}">
          <div class="contact__item-icon">${ICONS.phone}</div>
          <div>
            <div class="contact__item-label">تلفن</div>
            <div class="contact__item-value">${data.contact.phone}</div>
          </div>
        </a>
        <div class="contact__item contact__item--rtl">
          <div class="contact__item-icon">${ICONS.location}</div>
          <div>
            <div class="contact__item-label">موقعیت</div>
            <div class="contact__item-value">${data.contact.location}</div>
          </div>
        </div>
        <div class="contact__socials">
          ${data.socials.map(s => `
            <a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.name}" title="${s.name}">
              ${ICONS[s.icon] || ''}
            </a>
          `).join('')}
        </div>
      `;
    }

    // زیرعنوان تماس
    setText('#contactSubtitle', data.contact.subtitle);

    // سال کپی‌رایت
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // عنوان صفحه
    document.title = `${data.profile.name} | وبسایت شخصی`;
  }

  /* ============================================
     ۲) رندر پروژه‌ها با فیلتر
     ============================================ */
  function renderProjects(filter) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;

    const filtered = filter === 'همه'
      ? data.projects
      : data.projects.filter(p => p.category === filter);

    grid.innerHTML = filtered.map((p, i) => `
      <article class="project" data-reveal style="transition-delay: ${i * 0.06}s">
        <div class="project__image">
          <img src="${p.image}" alt="${p.title}" loading="lazy">
          <div class="project__overlay">
            <a href="${p.link}" target="_blank" rel="noopener" class="project__overlay-arrow" aria-label="مشاهده پروژه">
              ${ICONS.arrow}
            </a>
          </div>
          <span class="project__year">${p.year}</span>
        </div>
        <div class="project__body">
          <span class="project__category">${p.category}</span>
          <h3 class="project__title">${p.title}</h3>
          <p class="project__desc">${p.description}</p>
          <div class="project__tags">
            ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        </div>
      </article>
    `).join('');

    // reveal پروژه‌های جدید
    requestAnimationFrame(() => {
      grid.querySelectorAll('[data-reveal]').forEach(el => {
        observer.observe(el);
      });
    });
  }

  /* ============================================
     ۳) تایپ‌رایتر
     ============================================ */
  function initTypewriter() {
    const el = document.getElementById('typedText');
    if (!el) return;

    const roles = data.roles;
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
      const current = roles[roleIndex];

      if (isDeleting) {
        charIndex--;
        el.textContent = current.substring(0, charIndex);
        if (charIndex === 0) {
          isDeleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          setTimeout(type, 500);
          return;
        }
        setTimeout(type, 40);
      } else {
        charIndex++;
        el.textContent = current.substring(0, charIndex);
        if (charIndex === current.length) {
          isDeleting = true;
          setTimeout(type, 2200);
          return;
        }
        setTimeout(type, 90);
      }
    }
    type();
  }

  /* ============================================
     ۴) کانواس هیرو - ذرات تعاملی
     ============================================ */
  function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height, dpr;
    let particles = [];
    const mouse = { x: -1000, y: -1000 };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      createParticles();
    }

    function createParticles() {
      const count = Math.min(Math.floor((width * height) / 18000), 70);
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          r: Math.random() * 1.4 + 0.5,
        });
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      // ارتباط بین ذرات
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // حرکت
        p.x += p.vx;
        p.y += p.vy;

        // برخورد با مرز
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // واکنش به موس
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const force = (140 - dist) / 140;
          p.x -= dx * force * 0.03;
          p.y -= dy * force * 0.03;
        }

        // رسم ذره
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 230, 118, 0.55)';
        ctx.fill();

        // خطوط بین ذرات نزدیک
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const ddx = p.x - p2.x;
          const ddy = p.y - p2.y;
          const ddist = Math.sqrt(ddx * ddx + ddy * ddy);
          if (ddist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(0, 230, 118, ${0.18 * (1 - ddist / 110)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animate);
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    }
    function onMouseLeave() {
      mouse.x = -1000;
      mouse.y = -1000;
    }

    resize();
    if (!reducedMotion) {
      animate();
      window.addEventListener('resize', resize);
      window.addEventListener('mousemove', onMouseMove);
      canvas.addEventListener('mouseleave', onMouseLeave);
    } else {
      // در حالت کاهش حرکت، فقط یک فریم ثابت
      animate();
    }
  }

  /* ============================================
     ۵) کرسر سفارشی
     ============================================ */
  function initCustomCursor() {
    const cursor = document.querySelector('.cursor');
    const dot = document.querySelector('.cursor-dot');
    if (!cursor || !dot) return;

    // فقط روی دستگاه‌های دارای ماوس
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - 3}px, ${mouseY - 3}px)`;
    });

    function animate() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.transform = `translate(${cursorX - 18}px, ${cursorY - 18}px)`;
      requestAnimationFrame(animate);
    }
    animate();

    // حالت hover روی عناصر تعاملی
    const hoverables = 'a, button, .project, .stat, .skill-cat, .timeline__item, input, textarea';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverables)) cursor.classList.add('is-hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverables)) cursor.classList.remove('is-hover');
    });
  }

  /* ============================================
     ۶) ناوبری و منوی موبایل
     ============================================ */
  function initNavigation() {
    const header = document.getElementById('header');
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const navLinks = document.querySelectorAll('.nav__link');

    // هاamburger
    toggle?.addEventListener('click', () => {
      const open = nav.classList.toggle('is-open');
      toggle.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open);
      document.body.classList.toggle('no-scroll', open);
    });

    // بستن منو با کلیک روی لینک
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        toggle?.classList.remove('is-open');
        toggle?.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('no-scroll');
      });
    });

    // تغییر استایل هدر هنگام اسکرول
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 30);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // فعال‌سازی لینک ناوبری بر اساس بخش در حال نمایش
    const sections = document.querySelectorAll('main section[id]');
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            link.classList.toggle('is-active', link.dataset.section === id);
          });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => sectionObserver.observe(s));
  }

  /* ============================================
     ۷) انیمیشن reveal با IntersectionObserver
     ============================================ */
  let observer;
  function initScrollAnimations() {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');

          // فعال‌سازی نوار مهارت
          const skillFill = entry.target.querySelector?.('.skill-bar__fill');
          if (skillFill) {
            const level = skillFill.dataset.level;
            setTimeout(() => {
              skillFill.style.width = level + '%';
            }, 200);
          }

          // فعال‌سازی شمارنده
          const numbers = entry.target.querySelectorAll?.('.stat__number');
          if (numbers && numbers.length) {
            numbers.forEach(n => animateCounter(n));
          }

          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el));
  }

  /* ============================================
     ۸) شمارنده آمار
     ============================================ */
  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = 1800;
    const start = performance.now();
    const startVal = 0;

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easing
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(startVal + (target - startVal) * eased);
      el.textContent = toPersianDigits(current);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = toPersianDigits(target);
    }
    requestAnimationFrame(step);
  }

  function toPersianDigits(num) {
    const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    return String(num).replace(/\d/g, d => persian[d]);
  }

  /* ============================================
     ۹) فیلتر پروژه‌ها
     ============================================ */
  function initProjectFilters() {
    const filterContainer = document.getElementById('projectsFilters');
    if (!filterContainer) return;

    filterContainer.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;

      filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      renderProjects(btn.dataset.filter);
    });
  }

  /* ============================================
     ۱۰) نوار پیشرفت اسکرول و دکمه بازگشت
     ============================================ */
  function initScrollUI() {
    const progress = document.querySelector('.scroll-progress span');
    const backToTop = document.getElementById('backToTop');

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      if (progress) progress.style.width = percent + '%';

      if (backToTop) {
        backToTop.classList.toggle('is-visible', scrollTop > 600);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    backToTop?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================
     ۱۱) فرم تماس
     ============================================ */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const note = document.getElementById('formNote');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      // اعتبارسنجی ساده
      const name = formData.get('name');
      const email = formData.get('email');
      const message = formData.get('message');

      if (!name || !email || !message) {
        note.textContent = 'لطفاً همه‌ی فیلدها را پر کنید.';
        note.className = 'form__note is-error';
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>در حال ارسال...</span>';

      try {
        // ارسال به FormSubmit.co (بدون نیاز به بک‌اند)
        const response = await fetch(data.contact.formAction, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            name: name,
            email: email,
            subject: formData.get('subject') || 'بدون موضوع',
            message: message,
          }),
        });

        if (response.ok) {
          note.textContent = 'پیام شما با موفقیت ارسال شد. به‌زودی پاسخ می‌دهم.';
          note.className = 'form__note is-success';
          form.reset();
        } else {
          throw new Error('خطا در ارسال');
        }
      } catch (err) {
        // در صورت خطا، باز کردن mailto به‌عنوان fallback
        const subject = formData.get('subject') || 'تماس از وبسایت';
        const body = `نام: ${name}\nایمیل: ${email}\n\n${message}`;
        window.location.href = `mailto:${data.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        note.textContent = 'برای ارسال پیام، لطفاً ایمیل خود را بررسی کنید.';
        note.className = 'form__note';
      }

      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    });
  }

  /* ============================================
     ۱۲) پارالاکس خفیف هیرو
     ============================================ */
  function initParallax() {
    const visual = document.querySelector('.hero__visual');
    if (!visual) return;
    if (window.matchMedia('(hover: none), (pointer: coarse)').matches) return;

    const hero = document.querySelector('.hero');
    hero?.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      visual.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    });
  }

  /* ============================================
     توابع کمکی
     ============================================ */
  function setText(selector, text) {
    document.querySelectorAll(selector).forEach(el => {
      el.textContent = text;
    });
  }

  /* ============================================
     راه‌اندازی اولیه
     ============================================ */
  document.addEventListener('DOMContentLoaded', () => {
    renderContent();
    initTypewriter();
    initHeroCanvas();
    initCustomCursor();
    initNavigation();
    initScrollAnimations();
    initProjectFilters();
    initScrollUI();
    initContactForm();
    initParallax();
  });

})();