(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------------
     Sticky / solid header on scroll
  --------------------------------------------------------------- */
  var header = document.getElementById("siteHeader");
  function updateHeader() {
    if (window.scrollY > 40) {
      header.classList.add("solid");
    } else {
      header.classList.remove("solid");
    }
  }
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ---------------------------------------------------------------
     Mobile navigation
  --------------------------------------------------------------- */
  var menuToggle = document.getElementById("menuToggle");
  var menuClose = document.getElementById("menuClose");
  var mobileNav = document.getElementById("mobileNav");
  var backdrop = document.getElementById("mobileNavBackdrop");
  var mobileLinks = mobileNav.querySelectorAll("a");

  function openMenu() {
    mobileNav.classList.add("open");
    backdrop.classList.add("open");
    mobileNav.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeMenu() {
    mobileNav.classList.remove("open");
    backdrop.classList.remove("open");
    mobileNav.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  menuToggle.addEventListener("click", openMenu);
  menuClose.addEventListener("click", closeMenu);
  backdrop.addEventListener("click", closeMenu);
  mobileLinks.forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------------------------------------------------------------
     Hero parallax (subtle, layered, disabled on reduced motion)
  --------------------------------------------------------------- */
  var heroMedia = document.getElementById("heroMedia");
  var heroContent = document.querySelector(".hero-content");
  var hero = document.querySelector(".hero");
  var ticking = false;
/* ---------------------------------------------------------------
   Tamil Hero Verse
--------------------------------------------------------------- */

var heroHeading = document.getElementById("heroHeading");

if (heroHeading) {

  heroHeading.innerHTML = `
    
    <span
      class="tamil-animated-line"
      style="animation-delay:0.4s;"
    >
      அவர் உங்களை
    </span>


   <span
  class="tamil-long-line tamil-gold"
  style="animation-delay:0.8s;"
>
  <span class="tamil-long-part">விசாரிக்கிறவரான</span>
  <span class="tamil-long-part">படியால்,</span>
</span>


    <span
      class="tamil-reference"
      style="animation-delay:1.2s;"
    >
      1 பேதுரு 5:6
    </span>


    <span
      class="tamil-animated-line"
      style="animation-delay:1.6s;"
    >
      உங்கள் கவலைகளையெல்லாம்
    </span>


    <span
      class="tamil-animated-line tamil-gold"
      style="animation-delay:2.0s;"
    >
      அவர் மேல் வைத்துவிடுங்கள்.
    </span>

  `;

}
  function applyParallax() {
    var y = window.scrollY;
    var heroHeight = hero ? hero.offsetHeight : window.innerHeight;
    if (y > heroHeight * 1.2) { ticking = false; return; }

    var mediaOffset = y * 0.35;
    var contentOffset = y * 0.55;

    heroMedia.style.transform = "translate3d(0," + mediaOffset + "px,0)";
    heroContent.style.transform = "translate3d(0," + contentOffset + "px,0)";
    heroContent.style.opacity = String(Math.max(1 - y / (heroHeight * 0.9), 0));

    ticking = false;
  }

  function onScrollParallax() {
    if (!ticking) {
      window.requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }

  if (!prefersReducedMotion && heroMedia && heroContent) {
    window.addEventListener("scroll", onScrollParallax, { passive: true });
  }

  /* ---------------------------------------------------------------
     Scroll reveal for sections
  --------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------------------------------------------------------
     Form handling — Prayer Request + Contact
     (No backend wired up: demonstrates success/error UI states.
     Replace the fake submit with a real endpoint call.)
  --------------------------------------------------------------- */
  function wireForm(formId, statusId) {
    var form = document.getElementById(formId);
    var status = document.getElementById(statusId);
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity()) {
        status.textContent = "Please fill in all required fields before submitting.";
        status.className = "form-status error";
        form.reportValidity();
        return;
      }

      var submitBtn = form.querySelector("button[type=submit]");
      var originalLabel = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";

      // Simulated submission — swap this block for a real fetch() to your backend.
      setTimeout(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = originalLabel;
        status.textContent = "Thank you — we've received your message.";
        status.className = "form-status success";
        form.reset();
      }, 700);
    });
  }

  wireForm("prayerForm", "prayerStatus");
  wireForm("contactForm", "contactStatus");

  /* ---------------------------------------------------------------
     Video fallback: if the browser can't play the source video,
     fall back gracefully to the poster image already set.
  --------------------------------------------------------------- */
  var heroVideo = document.getElementById("heroVideo");
  if (heroVideo) {
    heroVideo.addEventListener("error", function () {
      heroVideo.style.display = "none";
    });
    if (prefersReducedMotion) {
      heroVideo.removeAttribute("autoplay");
      heroVideo.pause();
    }
  }
	
	  /* ---------------------------------------------------------------
     Donation — UPI Copy Button
  --------------------------------------------------------------- */

  var copyUpiBtn = document.getElementById("copyUpiBtn");
  var upiIdElement = document.getElementById("upiId");

  if (copyUpiBtn && upiIdElement) {

    copyUpiBtn.addEventListener("click", function () {

      var upiId = upiIdElement.textContent.trim();

      function showCopied() {

        var originalText = copyUpiBtn.textContent;

        copyUpiBtn.textContent = "Copied!";
        copyUpiBtn.classList.add("copied");

        setTimeout(function () {

          copyUpiBtn.textContent = originalText;
          copyUpiBtn.classList.remove("copied");

        }, 1800);
      }


      /* Modern Clipboard API */

      if (navigator.clipboard && window.isSecureContext) {

        navigator.clipboard.writeText(upiId)
          .then(function () {

            showCopied();

          })
          .catch(function () {

            fallbackCopy(upiId);

          });

      } else {

        fallbackCopy(upiId);

      }


      /* Fallback copy method */

      function fallbackCopy(text) {

        var textArea = document.createElement("textarea");

        textArea.value = text;

        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";

        document.body.appendChild(textArea);

        textArea.focus();
        textArea.select();

        try {

          var successful = document.execCommand("copy");

          if (successful) {
            showCopied();
          } else {
            copyUpiBtn.textContent = "Copy failed";
          }

        } catch (error) {

          copyUpiBtn.textContent = "Copy failed";

        }

        document.body.removeChild(textArea);

      }

    });

  }
})();
