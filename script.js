document.addEventListener("DOMContentLoaded", () => {
  const currentTheme = localStorage.getItem("site-theme") || "dark";
  if (currentTheme === "light") {
    document.body.classList.add("light-theme");
  }

  const logoEl = document.querySelector(".logo");
  if (logoEl && !document.querySelector(".net-status-dot")) {
    const logoWrap = document.createElement("div");
    logoWrap.className = "logo-container";
    logoEl.parentNode.insertBefore(logoWrap, logoEl);
    logoWrap.appendChild(logoEl);

    const dot = document.createElement("span");
    dot.className = "net-status-dot";
    dot.title = navigator.onLine ? "Canal retea: Activ (Online)" : "Canal retea: Inactiv (Offline)";
    if (!navigator.onLine) dot.classList.add("offline");
    logoWrap.appendChild(dot);

    window.addEventListener("online", () => {
      dot.classList.remove("offline");
      dot.title = "Canal retea: Activ (Online)";
    });
    window.addEventListener("offline", () => {
      dot.classList.add("offline");
      dot.title = "Canal retea: Inactiv (Offline)";
    });
  }

  const navUl = document.querySelector("nav ul");
  if (navUl && !document.querySelector(".theme-toggle-btn")) {
    const themeLi = document.createElement("li");
    themeLi.innerHTML = `
      <button class="theme-toggle-btn" title="Comuta modul Dark/Light">
        <svg viewBox="0 0 24 24">
          <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
        </svg>
      </button>
    `;
    navUl.appendChild(themeLi);

    const themeBtn = themeLi.querySelector(".theme-toggle-btn");
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-theme");
      const isLight = document.body.classList.contains("light-theme");
      localStorage.setItem("site-theme", isLight ? "light" : "dark");
    });
  }

  const style = document.createElement("style");
  style.textContent = `
    .glass-card {
      position: relative;
      overflow: hidden;
    }
    .glass-card::before {
      content: "";
      position: absolute;
      top: var(--mouse-y, -1000px);
      left: var(--mouse-x, -1000px);
      transform: translate(-50%, -50%);
      width: 450px;
      height: 450px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.08), transparent 70%);
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    .glass-card:hover::before {
      opacity: 1;
    }
    .fade-item {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .fade-item.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .img-lightbox {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.9);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.3s ease;
      z-index: 9999;
      user-select: none;
    }
    .img-lightbox.active {
      opacity: 1;
      pointer-events: auto;
    }
    .lightbox-img-wrapper {
      position: relative;
      max-width: 90%;
      max-height: 85vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .lightbox-img-wrapper img {
      max-width: 100%;
      max-height: 85vh;
      border-radius: 4px;
      transform: scale(0.9);
      transition: transform 0.3s ease;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .img-lightbox.active .lightbox-img-wrapper img {
      transform: scale(1);
    }
    .lightbox-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff;
      font-size: 1.8rem;
      width: 50px;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border-radius: 50%;
      transition: 0.3s;
      z-index: 10000;
    }
    .lightbox-btn:hover {
      background: rgba(255, 255, 255, 0.25);
      color: #fff;
    }
    .lightbox-prev {
      left: 20px;
    }
    .lightbox-next {
      right: 20px;
    }
    .lightbox-close {
      position: absolute;
      top: 20px;
      right: 25px;
      background: transparent;
      border: none;
      color: #fff;
      font-size: 2rem;
      cursor: pointer;
      opacity: 0.7;
      transition: opacity 0.3s;
      z-index: 10000;
    }
    .lightbox-close:hover {
      opacity: 1;
    }
    .foto-item img, .hotel-item img {
      cursor: zoom-in;
    }

    .ai-bubble-btn {
      position: fixed;
      bottom: 25px;
      right: 25px;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9990;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
      transition: transform 0.3s ease;
    }
    .ai-bubble-btn:hover {
      transform: scale(1.08);
    }
    .ai-bubble-btn svg {
      width: 24px;
      height: 24px;
      fill: #fff;
    }
    .ai-chat-window {
      position: fixed;
      bottom: 90px;
      right: 25px;
      width: 320px;
      max-height: 460px;
      background: rgba(15, 15, 15, 0.95);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      z-index: 9990;
      opacity: 0;
      pointer-events: none;
      transform: translateY(15px);
      transition: all 0.3s ease;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
    }
    .ai-chat-window.active {
      opacity: 1;
      pointer-events: auto;
      transform: translateY(0);
    }
    .ai-header {
      padding: 14px 18px;
      background: rgba(255, 255, 255, 0.03);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-family: 'Cinzel', serif;
      font-size: 0.85rem;
      letter-spacing: 1px;
      color: #fff;
    }
    .ai-close-btn {
      background: transparent;
      border: none;
      color: #a0a0a0;
      font-size: 1.2rem;
      cursor: pointer;
      line-height: 1;
    }
    .ai-close-btn:hover {
      color: #fff;
    }
    .ai-body {
      padding: 15px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-height: 260px;
      font-size: 0.8rem;
      line-height: 1.5;
    }
    .ai-msg {
      padding: 10px 14px;
      border-radius: 8px;
      max-width: 90%;
      word-wrap: break-word;
    }
    .ai-msg.bot {
      background: rgba(255, 255, 255, 0.05);
      color: #e0e0e0;
      align-self: flex-start;
      border-left: 2px solid #e6683c;
    }
    .ai-msg.bot a {
      color: #fff;
      text-decoration: underline;
    }
    .ai-msg.user {
      background: #fff;
      color: #000;
      align-self: flex-end;
      font-weight: 500;
    }
    .ai-actions {
      padding: 12px 15px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      background: rgba(0, 0, 0, 0.3);
    }
    .ai-chip {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #fff;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.7rem;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Poppins', sans-serif;
    }
    .ai-chip:hover {
      background: #fff;
      color: #000;
      border-color: #fff;
    }

    @media (max-width: 768px) {
      .lightbox-btn {
        width: 40px;
        height: 40px;
        font-size: 1.4rem;
      }
      .lightbox-prev {
        left: 10px;
      }
      .lightbox-next {
        right: 10px;
      }
      .ai-chat-window {
        right: 15px;
        bottom: 80px;
        width: calc(100% - 30px);
        max-width: 320px;
      }
      .ai-bubble-btn {
        bottom: 15px;
        right: 15px;
        width: 46px;
        height: 46px;
      }
    }
  `;
  document.head.appendChild(style);

  document.querySelectorAll(".glass-card").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    });
  });

  const targets = document.querySelectorAll(
    ".foto-item, .hotel-item, .project-section, .timeline-item, .skill-item"
  );
  if (targets.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    targets.forEach((el) => {
      el.classList.add("fade-item");
      observer.observe(el);
    });
  }

  const galleryImgs = Array.from(document.querySelectorAll(".foto-item img, .hotel-item img"));
  if (galleryImgs.length > 0) {
    let currentIndex = 0;

    const lightbox = document.createElement("div");
    lightbox.className = "img-lightbox";
    lightbox.innerHTML = `
      <button class="lightbox-close" title="Inchide">&times;</button>
      <button class="lightbox-btn lightbox-prev" title="Inapoi">&#10094;</button>
      <div class="lightbox-img-wrapper">
        <img src="" alt="Vizualizare">
      </div>
      <button class="lightbox-btn lightbox-next" title="Inainte">&#10095;</button>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector("img");
    const prevBtn = lightbox.querySelector(".lightbox-prev");
    const nextBtn = lightbox.querySelector(".lightbox-next");
    const closeBtn = lightbox.querySelector(".lightbox-close");

    const updateImage = (index) => {
      currentIndex = index;
      if (currentIndex < 0) currentIndex = galleryImgs.length - 1;
      if (currentIndex >= galleryImgs.length) currentIndex = 0;
      lightboxImg.src = galleryImgs[currentIndex].src;
    };

    const openLightbox = (index) => {
      updateImage(index);
      lightbox.classList.add("active");
    };

    const closeLightbox = () => {
      lightbox.classList.remove("active");
    };

    galleryImgs.forEach((img, idx) => {
      img.addEventListener("click", () => openLightbox(idx));
    });

    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      updateImage(currentIndex - 1);
    });

    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      updateImage(currentIndex + 1);
    });

    closeBtn.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("active")) return;
      if (e.key === "ArrowLeft") updateImage(currentIndex - 1);
      if (e.key === "ArrowRight") updateImage(currentIndex + 1);
      if (e.key === "Escape") closeLightbox();
    });
  }

  const chatContainer = document.createElement("div");
  chatContainer.innerHTML = `
    <button class="ai-bubble-btn" title="Asistent Portofoliu">
      <svg viewBox="0 0 24 24">
        <path d="M19 9l1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z"/>
      </svg>
    </button>
    <div class="ai-chat-window">
      <div class="ai-header">
        <span>Asistent Virtual</span>
        <button class="ai-close-btn">&times;</button>
      </div>
      <div class="ai-body" id="aiChatBody">
        <div class="ai-msg bot">Bună! Sunt asistentul virtual al Iuniei. Alege o comandă rapidă:</div>
      </div>
      <div class="ai-actions">
        <button class="ai-chip" data-cmd="despre">Despre Iunia</button>
        <button class="ai-chip" data-cmd="proiecte">Proiecte</button>
        <button class="ai-chip" data-cmd="contact">Contact</button>
        <button class="ai-chip" data-cmd="cv">Descarcă CV</button>
        <button class="ai-chip" data-cmd="diag">Diagnostic Retea</button>
      </div>
    </div>
  `;
  document.body.appendChild(chatContainer);

  const bubbleBtn = chatContainer.querySelector(".ai-bubble-btn");
  const chatWindow = chatContainer.querySelector(".ai-chat-window");
  const closeChatBtn = chatContainer.querySelector(".ai-close-btn");
  const chatBody = chatContainer.querySelector("#aiChatBody");
  const chips = chatContainer.querySelectorAll(".ai-chip");

  bubbleBtn.addEventListener("click", () => {
    chatWindow.classList.toggle("active");
  });

  closeChatBtn.addEventListener("click", () => {
    chatWindow.classList.remove("active");
  });

  const responses = {
    despre: {
      text: "Iunia este studentă la Media Digitală în Brașov, pasionată de Web Design, UI/UX și Fotografie.",
      action: '<a href="about.html">Vezi pagina Despre &rarr;</a>'
    },
    proiecte: {
      text: "Portofoliul include design web, UI/UX, fotografie digitală și activitate practică de marketing.",
      action: '<a href="projects.html">Explorează Portofoliul &rarr;</a>'
    },
    contact: {
      text: "O poți contacta pe WhatsApp la 0755 082 858 sau pe email.",
      action: '<a href="https://wa.me/40755082858" target="_blank">Deschide WhatsApp &rarr;</a>'
    },
    cv: {
      text: "Poți consulta CV-ul complet salvat în format PDF.",
      action: '<a href="CV_Iunia.pdf" target="_blank">Deschide PDF CV &rarr;</a>'
    }
  };

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const cmd = chip.getAttribute("data-cmd");
      const userMsg = document.createElement("div");
      userMsg.className = "ai-msg user";
      userMsg.textContent = chip.textContent;
      chatBody.appendChild(userMsg);

      if (cmd === "diag") {
        const start = performance.now();
        fetch(window.location.href, { method: "HEAD", cache: "no-store" })
          .then(() => {
            const latency = Math.round(performance.now() - start);
            const botMsg = document.createElement("div");
            botMsg.className = "ai-msg bot";
            botMsg.innerHTML = `Stare canal: <strong>Activ</strong><br>Latență RTT: <strong>${latency} ms</strong><br>Protocol: <strong>${window.location.protocol.replace(':', '').toUpperCase()}</strong><br>Host: <strong>${window.location.hostname || 'Localhost'}</strong>`;
            chatBody.appendChild(botMsg);
            chatBody.scrollTop = chatBody.scrollHeight;
          })
          .catch(() => {
            const botMsg = document.createElement("div");
            botMsg.className = "ai-msg bot";
            botMsg.textContent = "Nu am putut măsura conexiunea. Verifică rețeaua.";
            chatBody.appendChild(botMsg);
            chatBody.scrollTop = chatBody.scrollHeight;
          });
      } else {
        setTimeout(() => {
          const botMsg = document.createElement("div");
          botMsg.className = "ai-msg bot";
          const res = responses[cmd];
          botMsg.innerHTML = `${res.text}<br><br>${res.action}`;
          chatBody.appendChild(botMsg);
          chatBody.scrollTop = chatBody.scrollHeight;
        }, 350);
      }

      chatBody.scrollTop = chatBody.scrollHeight;
    });
  });
});