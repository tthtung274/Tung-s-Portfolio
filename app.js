// =========================================
//  PORTFOLIO SCRIPT — Tran Thanh Tung
// =========================================

"use strict";

// =========================================
// STATE
// =========================================
let currentTheme = localStorage.getItem("portfolio-theme") || "light";
let currentLanguage = localStorage.getItem("portfolio-language") || "vi";
let fbRating = 0;
let currentStep = 1;
let todayTempVal = null;

const FEEDBACK_URL =
  "https://script.google.com/macros/s/AKfycbxI-99Ii8EL2mj_2EndFt1Y4RbSfS4bz3foohRJ63oxzF1ydhryY_1P37lOKW8BT77tlA/exec";

// =========================================
// DOM REFS
// =========================================
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const navbar = $("#navbar");
const themeBtn = $("#themeToggle");
const langBtn = $("#langToggle");
const menuBtn = $("#menuToggle");
const mainNav = $("#mainNav");
const backTopBtn = $("#backTop");
const cursorDot = $("#cursorDot");

// =========================================
// THEME
// =========================================
function applyTheme(theme) {
  currentTheme = theme;
  document.documentElement.setAttribute("data-theme", theme);
  const icon = themeBtn.querySelector("i");
  icon.className = theme === "light" ? "fas fa-moon" : "fas fa-sun";
  localStorage.setItem("portfolio-theme", theme);
}

themeBtn.addEventListener("click", () =>
  applyTheme(currentTheme === "light" ? "dark" : "light"),
);

// =========================================
// LANGUAGE
// =========================================
function applyLanguage(lang) {
  currentLanguage = lang;

  $$("[data-lang-vi][data-lang-en]").forEach((el) => {
    if (el.children.length === 0) {
      el.textContent = el.getAttribute("data-lang-" + lang);
    }
  });

  $$("[data-placeholder-vi][data-placeholder-en]").forEach((el) => {
    el.placeholder = el.getAttribute("data-placeholder-" + lang);
  });

  const label = langBtn.querySelector(".lang-label");
  if (label) label.textContent = lang === "vi" ? "EN" : "VI";
  localStorage.setItem("portfolio-language", lang);
}

langBtn.addEventListener("click", () =>
  applyLanguage(currentLanguage === "vi" ? "en" : "vi"),
);

// =========================================
// NAVBAR SCROLL BEHAVIOR
// =========================================
let lastY = 0,
  ticking = false;

function handleNavScroll() {
  const y = window.scrollY;

  if (y > 40) navbar.classList.add("scrolled");
  else navbar.classList.remove("scrolled");

  if (y > 80) {
    if (y > 80) backTopBtn.classList.add("visible");
  } else {
    backTopBtn.classList.remove("visible");
  }

  updateActiveNav();
  lastY = y;
  ticking = false;
}

window.addEventListener(
  "scroll",
  () => {
    if (!ticking) {
      requestAnimationFrame(handleNavScroll);
      ticking = true;
    }
  },
  { passive: true },
);

// =========================================
// ACTIVE NAV LINK
// =========================================
function updateActiveNav() {
  const sections = $$("section[id]");
  const scrollMid = window.scrollY + window.innerHeight * 0.4;

  sections.forEach((sec) => {
    const top = sec.offsetTop;
    const bottom = top + sec.offsetHeight;
    const link = $(`.navbar__link[href="#${sec.id}"]`);
    if (link) {
      if (scrollMid >= top && scrollMid < bottom) link.classList.add("active");
      else link.classList.remove("active");
    }
  });
}

// =========================================
// MOBILE MENU
// =========================================
menuBtn.addEventListener("click", () => {
  const open = mainNav.classList.toggle("open");
  menuBtn.classList.toggle("open", open);
  menuBtn.setAttribute("aria-expanded", open);
  document.body.style.overflow = open ? "hidden" : "";
});

$$(".navbar__link").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuBtn.classList.remove("open");
    menuBtn.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  });
});

// =========================================
// HERO TYPING EFFECT
// =========================================
const roleTyped = $("#roleTyped");
const roles = ["AI Engineer", "Frontend Developer"];
let roleIdx = 0,
  charIdx = 0,
  deleting = false;

function typeRole() {
  const current = roles[roleIdx];

  if (!deleting) {
    roleTyped.textContent = current.substring(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      setTimeout(() => {
        deleting = true;
        typeRole();
      }, 3000);
      return;
    }
  } else {
    roleTyped.textContent = current.substring(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeRole, deleting ? 50 : 90);
}
setTimeout(typeRole, 600);

// =========================================
// SMOOTH SCROLL
// =========================================
$$('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    const target = $(anchor.getAttribute("href"));
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.pageYOffset - 72;
    window.scrollTo({ top, behavior: "smooth" });
  });
});

backTopBtn.addEventListener("click", () =>
  window.scrollTo({ top: 0, behavior: "smooth" }),
);

// =========================================
// INTERSECTION OBSERVER — REVEAL ANIMATIONS
// =========================================
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");

      // Trigger skill bars
      if (entry.target.classList.contains("skill-category")) {
        $$(".skill-bar__fill", entry.target).forEach((fill) => {
          const w = fill.getAttribute("data-width");
          fill.style.width = w + "%";
        });
      }
      // Trigger GPA bar
      if (
        entry.target.classList.contains("about-block--edu") ||
        entry.target.classList.contains("reveal-split")
      ) {
        const gpaFill = $("[data-width]", entry.target);
        if (gpaFill && entry.target.querySelector(".gpa-fill")) {
          entry.target.querySelector(".gpa-fill").style.width =
            entry.target.querySelector(".gpa-fill").getAttribute("data-width") +
            "%";
        }
      }

      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.12 },
);

function initReveal() {
  const selectors = [
    ".reveal-up",
    ".reveal-timeline",
    ".reveal-split",
    ".reveal-split--reverse",
    ".reveal-left",
    ".reveal-right",
    ".skill-category",
    ".about-block",
  ];
  $$(selectors.join(",")).forEach((el) => revealObserver.observe(el));
}

// Skill bar observer — runs when skill-category becomes visible
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      $$(".skill-bar__fill", entry.target).forEach((fill) => {
        fill.style.width = fill.getAttribute("data-width") + "%";
      });
      skillObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.25 },
);

// GPA bar observer
const gpaObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const fill = entry.target.querySelector(".gpa-fill");
      if (fill) fill.style.width = fill.getAttribute("data-width") + "%";
      gpaObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.3 },
);

// =========================================
// CUSTOM CURSOR
// =========================================
if (window.matchMedia("(pointer:fine)").matches && cursorDot) {
  document.addEventListener("mousemove", (e) => {
    cursorDot.style.left = e.clientX + "px";
    cursorDot.style.top = e.clientY + "px";
  });
  document.addEventListener(
    "mouseenter",
    () => (cursorDot.style.opacity = "1"),
  );
  document.addEventListener(
    "mouseleave",
    () => (cursorDot.style.opacity = "0"),
  );
}

// =========================================
// EXPERIENCE ZONE 2 — PRODUCT CUSTOMIZER
// =========================================
const custCanvas = $("#custCanvas");
const custBase = $("#custBase");

if (custCanvas && custBase) {
  // Select product
  $$(".cust-product").forEach((img) => {
    img.addEventListener("click", () => {
      custBase.src = img.src;
    });
  });
  // Default
  const firstProduct = $(".cust-product");
  if (firstProduct) custBase.src = firstProduct.src;

  let currentSticker = null;
  let currentText = null;

  // Stickers
  $$(".cust-stickers img").forEach((img) => {
    img.addEventListener("click", () => {
      if (currentSticker) currentSticker.remove();
      const s = document.createElement("img");
      s.src = img.src;
      s.className = "cust-sticker";
      const r = custCanvas.getBoundingClientRect();
      s.style.left = r.width / 2 - 40 + "px";
      s.style.top = r.height / 2 - 40 + "px";
      s.style.transform = "rotate(0deg) scale(1)";
      s.alt = "Sticker decoration";
      custCanvas.appendChild(s);
      currentSticker = s;
      enableDrag(s);
    });
  });

  // Sticker controls
  const stickerRotateEl = $("#stickerRotate");
  const stickerScaleEl = $("#stickerScale");
  function updateStickerTransform() {
    if (!currentSticker) return;
    const r = stickerRotateEl ? stickerRotateEl.value : 0;
    const sc = stickerScaleEl ? stickerScaleEl.value / 100 : 1;
    currentSticker.style.transform = `rotate(${r}deg) scale(${sc})`;
  }
  if (stickerRotateEl)
    stickerRotateEl.addEventListener("input", updateStickerTransform);
  if (stickerScaleEl)
    stickerScaleEl.addEventListener("input", updateStickerTransform);

  // Text
  const addTextBtn = $("#addText");
  const textInput = $("#textInput");
  const textColorEl = $("#textColor");

  if (addTextBtn) {
    addTextBtn.addEventListener("click", () => {
      if (currentText) currentText.remove();
      const t = document.createElement("div");
      t.className = "cust-text-overlay";
      t.textContent = textInput && textInput.value ? textInput.value : "Text";
      t.style.color = textColorEl ? textColorEl.value : "#000";
      t.style.fontSize = "22px";
      const r = custCanvas.getBoundingClientRect();
      t.style.left = r.width / 2 + "px";
      t.style.top = r.height / 2 + "px";
      custCanvas.appendChild(t);
      currentText = t;
      enableDrag(t);
    });
  }
  if (textColorEl)
    textColorEl.addEventListener("input", () => {
      if (currentText) currentText.style.color = textColorEl.value;
    });

  // Drag helper
  function enableDrag(el) {
    let dragging = false,
      ox = 0,
      oy = 0;

    const startDrag = (cx, cy) => {
      dragging = true;
      const r = custCanvas.getBoundingClientRect();
      ox = cx - r.left - parseInt(el.style.left || 0);
      oy = cy - r.top - parseInt(el.style.top || 0);
    };
    const moveDrag = (cx, cy) => {
      if (!dragging) return;
      const r = custCanvas.getBoundingClientRect();
      el.style.left = cx - r.left - ox + "px";
      el.style.top = cy - r.top - oy + "px";
    };
    const endDrag = () => {
      dragging = false;
    };

    el.addEventListener("mousedown", (e) => {
      e.preventDefault();
      startDrag(e.clientX, e.clientY);
    });
    document.addEventListener("mousemove", (e) =>
      moveDrag(e.clientX, e.clientY),
    );
    document.addEventListener("mouseup", endDrag);

    el.addEventListener(
      "touchstart",
      (e) => {
        const t = e.touches[0];
        startDrag(t.clientX, t.clientY);
      },
      { passive: true },
    );
    document.addEventListener(
      "touchmove",
      (e) => {
        const t = e.touches[0];
        moveDrag(t.clientX, t.clientY);
      },
      { passive: true },
    );
    document.addEventListener("touchend", endDrag);
  }
}

// =========================================
// EXPERIENCE ZONE 3 — LEAF ANALYSIS
// =========================================
const leafResult = $("#leafResult");

$$(".leaf-btn-new").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".leaf-btn-new").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const key = "data-desc-" + currentLanguage;
    const text = btn.getAttribute(key) || btn.getAttribute("data-desc-vi");

    if (leafResult) {
      leafResult.querySelector("i").className = "fas fa-leaf";
      leafResult.querySelector("p").textContent = text;
    }
  });
});

// =========================================
// EXPERIENCE ZONE 4 — FERMENTATION CHART
// =========================================
const SVG_W = 640,
  SVG_H = 280,
  SVG_PAD = 50;
const FIXED_TEMPS = [22, 26, 27, 21, 21];

function getDays() {
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (5 - i));
    return `${d.getDate()}/${d.getMonth() + 1}`;
  });
}
function getScale(data) {
  const mn = Math.min(...data),
    mx = Math.max(...data);
  const pad = Math.max(2, (mx - mn) * 0.25);
  return { min: mn - pad, max: mx + pad };
}

function drawFermChart() {
  const data =
    todayTempVal === null ? FIXED_TEMPS : [...FIXED_TEMPS, todayTempVal];
  const days = getDays();
  const scale = getScale(data);
  const stepX = (SVG_W - SVG_PAD * 2) / (days.length - 1);
  const stepY = (SVG_H - SVG_PAD * 2) / 4;

  const grid = $("#fGridLines"),
    yax = $("#fYAxis"),
    xax = $("#fXAxis");
  const line = $("#fDataLine"),
    dots = $("#fDataDots");
  if (!grid) return;

  grid.innerHTML = yax.innerHTML = xax.innerHTML = dots.innerHTML = "";

  for (let i = 0; i <= 4; i++) {
    const val = scale.min + (i * (scale.max - scale.min)) / 4;
    const y = SVG_H - SVG_PAD - i * stepY;
    const gl = document.createElementNS("http://www.w3.org/2000/svg", "line");
    gl.setAttribute("x1", SVG_PAD);
    gl.setAttribute("x2", SVG_W - SVG_PAD);
    gl.setAttribute("y1", y);
    gl.setAttribute("y2", y);
    grid.appendChild(gl);

    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("x", 6);
    txt.setAttribute("y", y + 4);
    txt.textContent = Math.round(val) + "°C";
    yax.appendChild(txt);
  }

  days.forEach((d, i) => {
    const x = SVG_PAD + stepX * i;
    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("x", x);
    txt.setAttribute("y", SVG_H - 8);
    txt.setAttribute("text-anchor", "middle");
    txt.textContent = d;
    xax.appendChild(txt);
  });

  let pts = "";
  data.forEach((t, i) => {
    const x = SVG_PAD + stepX * i;
    const y =
      SVG_H -
      SVG_PAD -
      ((t - scale.min) / (scale.max - scale.min)) * (SVG_H - SVG_PAD * 2);
    pts += `${x},${y} `;
    const dot = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );
    dot.setAttribute("cx", x);
    dot.setAttribute("cy", y);
    dot.setAttribute("r", 5);
    dots.appendChild(dot);
  });
  line.setAttribute("points", pts);
}

function applyTemperature() {
  const val = parseFloat($("#todayTemp").value);
  if (isNaN(val)) return;
  todayTempVal = val;

  let days;
  if (val <= 20) days = 28;
  else if (val <= 25) days = 22;
  else if (val <= 30) days = 16;
  else days = 12;

  const el = $("#zone4FinishText");
  if (el) {
    const vi = `Hoàn thành sau ${days} ngày`;
    const en = `Complete in ${days} days`;
    el.setAttribute("data-lang-vi", vi);
    el.setAttribute("data-lang-en", en);
    el.textContent = currentLanguage === "en" ? en : vi;
  }
  drawFermChart();
}

// expose globally for inline onclick
window.applyTemperature = applyTemperature;

// =========================================
// FEEDBACK SYSTEM
// =========================================
function initFeedback() {
  const stars = $$(".fb-star");
  const fbNext = $("#fbNext");
  const fbSkip = $("#fbSkip");
  const fbSub = $("#fbSubmit");
  const step1 = $("#fbStep1");
  const step2 = $("#fbStep2");
  const step3 = $("#fbStep3");
  const fbRatingInput = $("#fbRating");

  if (!step1) return;

  stars.forEach((s) => {
    s.addEventListener("click", () => {
      fbRating = parseInt(s.getAttribute("data-rating"));
      if (fbRatingInput) fbRatingInput.value = fbRating;
      stars.forEach((st, idx) => {
        const i = st.querySelector("i");
        if (idx < fbRating) {
          i.className = "fas fa-star";
          st.classList.add("active");
        } else {
          i.className = "far fa-star";
          st.classList.remove("active");
        }
      });
      if (fbNext) fbNext.disabled = false;
    });

    s.addEventListener("mouseenter", () => {
      const h = parseInt(s.getAttribute("data-rating"));
      stars.forEach((st, idx) => {
        st.querySelector("i").className =
          idx < h ? "fas fa-star" : "far fa-star";
      });
    });
    s.addEventListener("mouseleave", () => {
      stars.forEach((st, idx) => {
        st.querySelector("i").className =
          idx < fbRating ? "fas fa-star" : "far fa-star";
      });
    });
  });

  if (fbNext)
    fbNext.addEventListener("click", () => {
      if (fbRating === 0) return;
      step1.classList.remove("active");
      step2.classList.add("active");
      currentStep = 2;
    });

  async function doSubmit() {
    const comment = ($("#fbComment") || {}).value || "";
    const submitBtn = $("#fbSubmit");
    if (submitBtn) {
      const txt = submitBtn.querySelector(".fb-submit-text");
      const ldr = submitBtn.querySelector(".fb-loader");
      submitBtn.disabled = true;
      if (txt) txt.style.display = "none";
      if (ldr) ldr.style.display = "inline-block";
    }

    const now = new Date();
    const ts = now.toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

    try {
      await fetch(FEEDBACK_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: ts,
          rating: fbRating,
          comment: comment || "No comment",
        }),
      });
    } catch (e) {
      /* still show success */
    }

    step2.classList.remove("active");
    step3.classList.add("active");
    currentStep = 3;

    if (submitBtn) submitBtn.disabled = false;
  }

  if (fbSkip) fbSkip.addEventListener("click", doSubmit);
  if (fbSub) fbSub.addEventListener("click", doSubmit);
}

// =========================================
// ABOUT BLOCK ANIMATION SETUP
// =========================================
function initAboutObserver() {
  const blocks = $$(".about-block");
  blocks.forEach((b) => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const fill = entry.target.querySelector(".gpa-fill");
          if (fill) fill.style.width = fill.getAttribute("data-width") + "%";
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.3 },
    );
    io.observe(b);
  });
}

// =========================================
// NAVBAR LOGO CLICK
// =========================================
const navLogoLink = $(".navbar__logo");
if (navLogoLink) {
  navLogoLink.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// =========================================
// INIT
// =========================================
function init() {
  applyTheme(currentTheme);
  applyLanguage(currentLanguage);
  initReveal();
  initFeedback();
  initAboutObserver();
  drawFermChart();
  handleNavScroll();

  // Observe skill categories independently
  $$(".skill-category").forEach((el) => skillObserver.observe(el));
}

document.addEventListener("DOMContentLoaded", init);
