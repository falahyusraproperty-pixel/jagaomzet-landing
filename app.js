(() => {
  "use strict";

  const WA_URL = "https://wa.me/6282299582026?text=Halo%2C%20saya%20tertarik%20mencoba%20JagaOmzet%20Gratis%2014%20Hari.";

  const localKnowledge = [
    { keys: ["trial", "gratis", "coba", "free"], answer: "JagaOmzet bisa dicoba gratis selama 14 hari. Tidak perlu kartu kredit. Setelah itu Anda bisa memilih paket yang sesuai kebutuhan." },
    { keys: ["harga", "pricing", "biaya", "care", "bestie", "sultan"], answer: "Untuk Partner: Care Rp99.000/bulan dan Bestie Rp199.000/bulan. Sultan menggunakan harga negotiable sesuai kebutuhan. Ada juga Flex tanpa biaya aktivasi: Care Rp399.000/bulan, Bestie Rp599.000/bulan, dan Sultan negotiable." },
    { keys: ["area", "wilayah", "lokasi", "cover", "cakupan", "indonesia", "surabaya", "sidoarjo", "jawa", "luar kota"], answer: "JagaOmzet dapat digunakan untuk bisnis di seluruh Indonesia. Tidak terbatas pada kota atau wilayah tertentu." },
    { keys: ["cocok", "usaha", "bisnis", "restoran", "cafe", "kafe", "salon", "barbershop", "laundry", "bengkel", "klinik"], answer: "JagaOmzet cocok untuk bisnis yang ingin memahami pelanggan dan memantau feedback, terutama bisnis dengan outlet seperti café, restoran, salon, barbershop, laundry, bengkel, dan klinik kecantikan." },
    { keys: ["kasir", "pos", "point of sale"], answer: "Bukan aplikasi kasir. Fokus JagaOmzet adalah feedback pelanggan, database pelanggan, monitoring outlet, laporan, Google Review, dan aktivitas untuk membantu pelanggan kembali." },
    { keys: ["cara kerja", "cara", "bagaimana", "scan", "qr"], answer: "Alurnya sederhana: pelanggan scan QR JagaOmzet → memberi feedback → data masuk dashboard → owner melihat pola dan menentukan tindakan." },
    { keys: ["outlet", "multi outlet", "banyak outlet", "cabang"], answer: "JagaOmzet dirancang untuk owner yang ingin memantau kondisi beberapa outlet dari satu dashboard. Paket awal dimulai dari 1 outlet dan outlet tambahan dapat ditambahkan." },
    { keys: ["database", "pelanggan", "customer"], answer: "Feedback dapat menjadi data pelanggan yang lebih terstruktur sehingga owner punya bahan untuk follow-up, promo, dan aktivitas repeat order." },
    { keys: ["google", "review", "maps"], answer: "Feedback positif punya jalur untuk diarahkan ke Google Maps, dan JagaOmzet menyediakan template balasan agar prosesnya lebih praktis." },
    { keys: ["kupon", "promo", "return", "kembali"], answer: "JagaOmzet menyediakan fitur kupon sebagai salah satu cara memberi alasan kepada pelanggan untuk kembali." },
    { keys: ["partner", "flex"], answer: "Partner memiliki biaya aktivasi sekali bayar dan harga bulanan khusus. Flex tidak memiliki biaya aktivasi, tetapi harga bulanannya lebih tinggi." },
    { keys: ["daftar", "mulai", "whatsapp", "wa"], answer: "Untuk mulai trial 14 hari, Anda bisa menghubungi tim JagaOmzet melalui WhatsApp di 0822 9958 2026." }
  ];

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function localReply(message) {
    const text = normalize(message);
    if (!text) return "Tulis pertanyaan Anda tentang JagaOmzet. Misalnya: harga, trial, multi-outlet, fitur, atau cara kerja.";

    let best = null;
    let score = 0;

    for (const item of localKnowledge) {
      let current = 0;
      for (const key of item.keys) {
        if (text.includes(key)) current += key.length > 5 ? 2 : 1;
      }
      if (current > score) {
        score = current;
        best = item.answer;
      }
    }

    return best || "Saya bisa membantu menjelaskan JagaOmzet, trial 14 hari, harga, fitur, multi-outlet, database pelanggan, Google Review, kupon, dan cara mulai. Coba tulis pertanyaan yang lebih spesifik.";
  }

  async function remoteReply(message, history) {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message, history: history.slice(0, -1).slice(-8) })
      });

      if (!response.ok) throw new Error("chat endpoint unavailable");

      const data = await response.json();
      if (data && typeof data.reply === "string" && data.reply.trim()) {
        return { text: data.reply.trim(), remote: true };
      }
    } catch (_) {
      // GitHub Pages is static. Fall back to the built-in knowledge base.
    }

    return { text: localReply(message), remote: false };
  }

  function createEl(tag, attrs, html) {
    const el = document.createElement(tag);
    const safeAttrs = attrs || {};
    Object.entries(safeAttrs).forEach(([key, value]) => {
      if (key === "class") el.className = value;
      else if (key === "text") el.textContent = value;
      else el.setAttribute(key, value);
    });
    if (html) el.innerHTML = html;
    return el;
  }

  function initReveal() {
    const selectors = [
      ".flow-step",
      ".feature-card",
      ".split > div",
      ".trial-banner",
      ".price-card",
      ".flex-card",
      ".economy-note",
      ".faq-list details",
      ".cta-panel"
    ];

    const targets = document.querySelectorAll(selectors.join(","));
    if (!targets.length) return;

    targets.forEach((el, index) => {
      el.classList.add("scroll-reveal");
      if (index % 4 === 1) el.dataset.delay = "1";
      if (index % 4 === 2) el.dataset.delay = "2";
      if (index % 4 === 3) el.dataset.delay = "3";
    });

    if (!("IntersectionObserver" in window)) {
      targets.forEach(el => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -40px 0px" });

    targets.forEach(el => observer.observe(el));
  }

  function initHeroMotion() {
    const chart = document.querySelector(".chart");
    if (chart) {
      chart.classList.add("chart-live");
      requestAnimationFrame(() => requestAnimationFrame(() => chart.classList.add("is-live")));
    }

    const values = document.querySelectorAll(".metric-card strong");
    const targets = [428, 1284, 91];

    values.forEach((el, index) => {
      const target = targets[index];
      if (typeof target !== "number") return;

      const suffix = index === 2 ? "%" : "";
      const duration = 1100;
      const start = performance.now();

      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toLocaleString("id-ID") + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };

      el.textContent = "0" + suffix;
      window.setTimeout(() => requestAnimationFrame(tick), 350 + index * 110);
    });

    const ctas = document.querySelectorAll('a[href*="wa.me"]');
    ctas.forEach((cta, index) => {
      const text = normalize(cta.textContent);
      if (text.includes("coba gratis")) cta.classList.add("cta-pulse");
      if (index === 0) cta.setAttribute("aria-label", "Coba JagaOmzet gratis 14 hari");
    });
  }

  function initStickyCta() {
    const hero = document.querySelector(".hero");
    if (!hero) return;

    const cta = createEl(
      "a",
      { class: "jo-sticky-cta", href: WA_URL, "aria-label": "Coba JagaOmzet gratis 14 hari" },
      "<strong>Coba 14 Hari Gratis</strong><span>→</span>"
    );

    document.body.appendChild(cta);

    const update = () => {
      const threshold = hero.offsetTop + hero.offsetHeight * 0.72;
      cta.classList.toggle("is-visible", window.scrollY > threshold);
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  function initChatbot() {
    const launcher = createEl(
      "button",
      {
        class: "jo-chat-launcher",
        type: "button",
        "aria-label": "Buka JagaOmzet Assistant",
        "aria-expanded": "false"
      },
      '<span class="jo-chat-bubble-icon">✦</span><span class="jo-chat-dot" aria-hidden="true"></span>'
    );

    const panel = createEl(
      "section",
      {
        class: "jo-chat-panel",
        role: "dialog",
        "aria-label": "JagaOmzet Assistant",
        "aria-hidden": "true"
      },
      '<div class="jo-chat-head">' +
        '<div class="jo-chat-avatar">✦</div>' +
        '<div class="jo-chat-title"><strong>JagaOmzet Assistant</strong><span>Tanya apa saja tentang JagaOmzet</span></div>' +
        '<button class="jo-chat-close" type="button" aria-label="Tutup chatbot">×</button>' +
      '</div>' +
      '<div class="jo-chat-messages" aria-live="polite"></div>' +
      '<div class="jo-chat-quick">' +
        '<button type="button" data-question="JagaOmzet itu apa?">JagaOmzet itu apa?</button>' +
        '<button type="button" data-question="Berapa harganya?">Harga</button>' +
        '<button type="button" data-question="Bisa untuk banyak outlet?">Multi-outlet</button>' +
        '<button type="button" data-question="Bagaimana trialnya?">Trial 14 hari</button><button type="button" data-question="JagaOmzet bisa cover area mana?">Area layanan</button>' +
      '</div>' +
      '<form class="jo-chat-form">' +
        '<input class="jo-chat-input" type="text" maxlength="500" autocomplete="off" placeholder="Tulis pertanyaan..." aria-label="Pertanyaan tentang JagaOmzet" />' +
        '<button class="jo-chat-send" type="submit" aria-label="Kirim">↑</button>' +
      '</form>' +
      '<div class="jo-chat-status">Jawaban berdasarkan informasi JagaOmzet.</div><a class="jo-chat-wa" href="https://wa.me/6282299582026?text=Halo%2C%20saya%20tertarik%20mencoba%20JagaOmzet%20Gratis%2014%20Hari." target="_blank" rel="noopener">💬 Lanjut ke WhatsApp</a>'
    );

    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    const messagesEl = panel.querySelector(".jo-chat-messages");
    const form = panel.querySelector(".jo-chat-form");
    const input = panel.querySelector(".jo-chat-input");
    const close = panel.querySelector(".jo-chat-close");
    const quickButtons = panel.querySelectorAll("[data-question]");
    const sendButton = panel.querySelector(".jo-chat-send");

    const history = [];
    let opened = false;

    function openChat() {
      opened = true;
      panel.classList.add("is-open");
      panel.setAttribute("aria-hidden", "false");
      launcher.setAttribute("aria-expanded", "true");
      const dot = launcher.querySelector(".jo-chat-dot");
      if (dot) dot.style.display = "none";
      window.setTimeout(() => input.focus(), 80);
    }

    function closeChat() {
      opened = false;
      panel.classList.remove("is-open");
      panel.setAttribute("aria-hidden", "true");
      launcher.setAttribute("aria-expanded", "false");
    }

    function addMessage(role, text) {
      const bubble = createEl("div", { class: "jo-msg " + role });
      bubble.textContent = text;
      messagesEl.appendChild(bubble);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return bubble;
    }

    function addTyping() {
      const bubble = createEl("div", { class: "jo-msg bot" }, '<span class="jo-typing"><i></i><i></i><i></i></span>');
      messagesEl.appendChild(bubble);
      messagesEl.scrollTop = messagesEl.scrollHeight;
      return bubble;
    }

    function addWelcome() {
      if (messagesEl.children.length) return;
      addMessage("bot", "Halo. Saya JagaOmzet Assistant. Saya bisa menjelaskan fitur, harga, trial 14 hari, dan cara kerja JagaOmzet.");
    }

    async function ask(question) {
      const clean = String(question || "").trim();
      if (!clean || sendButton.disabled) return;

      addMessage("user", clean);
      history.push({ role: "user", content: clean });
      input.value = "";
      sendButton.disabled = true;

      const typing = addTyping();
      const result = await remoteReply(clean, history);
      typing.remove();

      addMessage("bot", result.text);
      history.push({ role: "assistant", content: result.text });

      sendButton.disabled = false;
      input.focus();

      if (result.remote) {
        const status = panel.querySelector(".jo-chat-status");
        status.textContent = "AI aktif • Informasi JagaOmzet";
      }
    }

    launcher.addEventListener("click", () => {
      if (opened) closeChat();
      else {
        openChat();
        addWelcome();
      }
    });

    close.addEventListener("click", closeChat);

    form.addEventListener("submit", event => {
      event.preventDefault();
      ask(input.value);
    });

    quickButtons.forEach(button => {
      button.addEventListener("click", () => {
        openChat();
        ask(button.dataset.question);
      });
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && opened) closeChat();
    });
  }

  function init() {
    initReveal();
    initHeroMotion();
    initStickyCta();
    initChatbot();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();