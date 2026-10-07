(() => {
  "use strict";

  const WA_URL = "https://wa.me/6282299582026?text=Halo%2C%20saya%20tertarik%20Paket%20Pelanggan%20Balik%2030%20Hari%20untuk%20outlet%20saya.";

  const localKnowledge = [
    { keys: ["trial", "gratis", "coba", "free"], answer: "Paket pertama berjalan 30 hari. Kami yang pasang, jalankan, kirim promo pertama, dan laporkan hasilnya." },
    { keys: ["harga", "pricing", "biaya", "basic", "pro"], answer: "Paket Pelanggan Balik 30 Hari harga perintis Rp490.000 sekali bayar, harga normal Rp990.000. Lanjut Bulanan opsional Rp499.000/bulan. Multi-outlet bisa dibicarakan." },
    { keys: ["area", "wilayah", "lokasi", "cover", "cakupan", "indonesia", "surabaya", "sidoarjo", "jawa", "luar kota"], answer: "JagaOmzet dapat digunakan untuk bisnis di seluruh Indonesia. Tidak terbatas pada kota atau wilayah tertentu." },
    { keys: ["cocok", "usaha", "bisnis", "restoran", "cafe", "kafe", "salon", "barbershop", "laundry", "bengkel", "klinik"], answer: "JagaOmzet cocok untuk bisnis yang ingin memahami pelanggan dan memantau feedback, terutama bisnis dengan outlet seperti café, restoran, salon, barbershop, laundry, bengkel, dan klinik kecantikan." },
    { keys: ["kasir", "pos", "point of sale"], answer: "Bukan aplikasi kasir. Fokus JagaOmzet adalah feedback pelanggan, database pelanggan, monitoring outlet, laporan, Google Review, dan aktivitas untuk membantu pelanggan kembali." },
    { keys: ["cara kerja", "cara", "bagaimana", "scan", "qr"], answer: "Alurnya sederhana: pelanggan scan QR JagaOmzet → memberi feedback → data masuk dashboard → owner melihat pola dan menentukan tindakan." },
    { keys: ["outlet", "multi outlet", "banyak outlet", "cabang"], answer: "JagaOmzet dirancang untuk owner yang ingin memantau kondisi beberapa outlet dari satu dashboard. Paket awal dimulai dari 1 outlet dan outlet tambahan dapat ditambahkan." },
    { keys: ["database", "pelanggan", "customer"], answer: "Feedback dapat menjadi data pelanggan yang lebih terstruktur sehingga owner punya bahan untuk follow-up, promo, dan aktivitas repeat order." },
    { keys: ["google", "review", "maps"], answer: "JagaOmzet membantu owner membalas ulasan Google positif maupun negatif dengan template yang konsisten." },
    { keys: ["kupon", "promo", "return", "kembali"], answer: "JagaOmzet menyediakan fitur kupon sebagai salah satu cara memberi alasan kepada pelanggan untuk kembali." },
    { keys: ["partner", "flex"], answer: "JagaOmzet sekarang menggunakan dua paket publik: Basic dan Pro." },
    { keys: ["daftar", "mulai", "whatsapp", "wa"], answer: "Untuk mulai, chat WhatsApp JagaOmzet dan konsultasikan outlet Anda. Kami akan menjelaskan Paket Pelanggan Balik 30 Hari." }

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

    return best || "Saya bisa membantu menjelaskan JagaOmzet, Paket 30 Hari, harga, fitur, multi-outlet, database pelanggan, Google Review, kupon, dan cara mulai. Coba tulis pertanyaan yang lebih spesifik.";
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
      ".offer-card",
      ".package-card",
      ".gallery-card",
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

    // Dashboard demo uses fixed mock numbers. Do not animate from zero.
    const ctas = document.querySelectorAll('a[href*="wa.me"]');
    ctas.forEach((cta, index) => {
      const text = normalize(cta.textContent);
      if (text.includes("konsultasi") || text.includes("ambil slot") || text.includes("chat whatsapp")) cta.classList.add("cta-pulse");
      if (text.includes("pilot")) cta.classList.add("pilot-cta");
      if (index === 0) cta.setAttribute("aria-label", "Chat WhatsApp JagaOmzet");
    });
  }

  function initInteractiveDemo() {
    const demo = document.querySelector(".aha-interactive");
    if (!demo) return;

    const choices = demo.querySelectorAll("[data-feedback]");
    const customerIcon = demo.querySelector('[data-role="customer-icon"]');
    const customerText = demo.querySelector('[data-role="customer-text"]');
    const customerSub = demo.querySelector('[data-role="customer-sub"]');
    const captureTitle = demo.querySelector('[data-role="capture-title"]');
    const captureSub = demo.querySelector('[data-role="capture-sub"]');
    const dashboardTitle = demo.querySelector('[data-role="dashboard-title"]');
    const dashboardSub = demo.querySelector('[data-role="dashboard-sub"]');
    const actionIcon = demo.querySelector('[data-role="action-icon"]');
    const actionTitle = demo.querySelector('[data-role="action-title"]');
    const actionSub = demo.querySelector('[data-role="action-sub"]');
    const resultTitle = demo.querySelector('[data-role="result-title"]');
    const resultText = demo.querySelector('[data-role="result-text"]');
    const result = demo.querySelector(".aha-result");

    const states = {
      positive: {
        icon: "😊",
        text: "“Pelayanannya cepat.”",
        sub: "Feedback positif masuk",
        capture: "+1 Feedback baru",
        captureSub: "Data tercatat otomatis",
        dashboard: "Outlet A • 92%",
        dashboardSub: "Kepuasan pelanggan terlihat",
        actionIcon: "↗",
        action: "Balas Review • Follow-up",
        actionSub: "Pengalaman positif bisa dimanfaatkan",
        resultTitle: "Feedback positif terpantau.",
        resultText: "Owner tahu pengalaman pelanggan dan bisa menindaklanjutinya."
      },
      neutral: {
        icon: "😐",
        text: "“Rasanya oke, tapi bisa lebih cepat.”",
        sub: "Feedback netral masuk",
        capture: "+1 Feedback baru",
        captureSub: "Data dan komentar tercatat",
        dashboard: "Outlet A • 78%",
        dashboardSub: "Ada pola yang perlu diperhatikan",
        actionIcon: "▣",
        action: "Kupon • Evaluasi",
        actionSub: "Beri alasan untuk kembali",
        resultTitle: "Ada sinyal yang perlu diperhatikan.",
        resultText: "Owner melihat area yang masih bisa diperbaiki sebelum pelanggan berhenti datang."
      },
      negative: {
        icon: "😞",
        text: "“Pelayanannya terlalu lama.”",
        sub: "Feedback kurang puas masuk",
        capture: "+1 Komplain baru",
        captureSub: "Masuk ke daftar yang perlu ditindak",
        dashboard: "Outlet A • 64%",
        dashboardSub: "Masalah outlet lebih cepat terlihat",
        actionIcon: "!",
        action: "Tindak Lanjut • Selesai",
        actionSub: "Komplain bisa dipantau statusnya",
        resultTitle: "Masalah tidak lagi diam-diam hilang.",
        resultText: "Owner tahu ada komplain dan bisa menindaklanjuti sebelum masalah menjadi pelanggan yang hilang."
      }
    };

    function render(key) {
      const state = states[key] || states.positive;
      choices.forEach(button => button.classList.toggle("is-active", button.dataset.feedback === key));

      customerIcon.textContent = state.icon;
      customerText.textContent = state.text;
      customerSub.textContent = state.sub;
      captureTitle.textContent = state.capture;
      captureSub.textContent = state.captureSub;
      dashboardTitle.textContent = state.dashboard;
      dashboardSub.textContent = state.dashboardSub;
      actionIcon.textContent = state.actionIcon;
      actionTitle.textContent = state.action;
      actionSub.textContent = state.actionSub;
      resultTitle.textContent = state.resultTitle;
      resultText.textContent = state.resultText;

      demo.classList.remove("is-changing");
      void demo.offsetWidth;
      demo.classList.add("is-changing");
      window.setTimeout(() => demo.classList.remove("is-changing"), 320);
    }

    choices.forEach(button => {
      button.addEventListener("click", () => render(button.dataset.feedback));
    });

    render("positive");
  }

  function initStickyCta() {
    const cta = createEl(
      "a",
      { class: "jo-whatsapp-float", href: WA_URL, target: "_blank", rel: "noopener", "aria-label": "Chat WhatsApp JagaOmzet" },
      "<span aria-hidden=\"true\">💬</span>"
    );
    document.body.appendChild(cta);
    window.requestAnimationFrame(() => cta.classList.add("is-visible"));
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
        '<button type="button" data-question="Bagaimana Paket Pelanggan Balik 30 Hari bekerja?">Paket 30 hari</button><button type="button" data-question="JagaOmzet bisa cover area mana?">Area layanan</button>' +
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
      addMessage("bot", "Halo. Saya JagaOmzet Assistant. Saya bisa menjelaskan Paket 30 Hari, cara kerja, harga, dan program multi-outlet.");
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
    initInteractiveDemo();
    initStickyCta();
    initChatbot();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();