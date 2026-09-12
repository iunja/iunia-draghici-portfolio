document.addEventListener("DOMContentLoaded", () => {
  localStorage.removeItem("site-theme");

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
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
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

  const targets = document.querySelectorAll(".foto-item, .hotel-item, .project-section, .timeline-item, .skill-item");
  if (targets.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.1 });

    targets.forEach((el) => {
      el.classList.add("fade-item");
      observer.observe(el);
    });
  }

  const galleryImgs = Array.from(document.querySelectorAll(".foto-item img, .hotel-item img"));
  if (galleryImgs.length) {
    let currentIndex = 0;

    const lightbox = document.createElement("div");
    lightbox.className = "img-lightbox";
    lightbox.innerHTML = `
      <button class="lightbox-close" title="Inchide">&times;</button>
      <button class="lightbox-btn lightbox-prev" title="Inapoi">&#10094;</button>
      <div class="lightbox-img-wrapper"><img src="" alt="Vizualizare"></div>
      <button class="lightbox-btn lightbox-next" title="Inainte">&#10095;</button>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector("img");
    const updateImage = (index) => {
      currentIndex = (index + galleryImgs.length) % galleryImgs.length;
      lightboxImg.src = galleryImgs[currentIndex].src;
    };

    const openLightbox = (index) => {
      updateImage(index);
      lightbox.classList.add("active");
    };

    const closeLightbox = () => lightbox.classList.remove("active");

    galleryImgs.forEach((img, idx) => img.addEventListener("click", () => openLightbox(idx)));

    lightbox.querySelector(".lightbox-prev").addEventListener("click", (e) => {
      e.stopPropagation();
      updateImage(currentIndex - 1);
    });

    lightbox.querySelector(".lightbox-next").addEventListener("click", (e) => {
      e.stopPropagation();
      updateImage(currentIndex + 1);
    });

    lightbox.querySelector(".lightbox-close").addEventListener("click", closeLightbox);

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
});
