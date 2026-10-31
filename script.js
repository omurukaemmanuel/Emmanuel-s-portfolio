document.addEventListener("DOMContentLoaded", () => {

  const navLinks = document.getElementById("navLinks");

  const navItems = navLinks
    ? [...navLinks.querySelectorAll("a[href]")]
    : [...document.querySelectorAll("nav a[href]")];

  const menuToggle =
    document.getElementById("menuToggle") ||
    document.getElementById("menuBtn") ||
    document.getElementById("menu-button") ||
    document.querySelector(
      ".menu-btn, .menu-toggle, [aria-controls='navLinks']"
    );

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      if (menuToggle.tagName === "BUTTON") {
        menuToggle.textContent = isOpen ? "✕" : "☰";
      }
    });

    navItems.forEach(link => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");

        if (menuToggle.tagName === "BUTTON") {
          menuToggle.textContent = "☰";
        }
      });
    });

    document.addEventListener("click", event => {
      if (
        !navLinks.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");

        if (menuToggle.tagName === "BUTTON") {
          menuToggle.textContent = "☰";
        }
      }
    });
  }

  const currentFile = (
    window.location.pathname.split("/").pop() ||
    "index.html"
  ).toLowerCase();

  function clearActiveLinks() {
    navItems.forEach(link => {
      link.classList.remove("active");
      link.removeAttribute("aria-current");
    });
  }

  function setActiveLink(link, isPage = false) {
    clearActiveLinks();

    if (link) {
      link.classList.add("active");
      link.setAttribute(
        "aria-current",
        isPage ? "page" : "location"
      );
    }
  }

  const currentPageLink = navItems.find(link => {
    const href = link.getAttribute("href");

    if (
      !href ||
      href.startsWith("#") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:")
    ) {
      return false;
    }

    try {
      const targetURL = new URL(href, window.location.href);

      return (
        targetURL.pathname.split("/").pop().toLowerCase() ===
        currentFile
      );
    } catch {
      return false;
    }
  });

  if (currentPageLink) {
    setActiveLink(currentPageLink, true);
  }

  const sectionLinks = navItems.filter(link =>
    (link.getAttribute("href") || "").startsWith("#")
  );

  const sections = sectionLinks
    .map(link =>
      document.getElementById(
        link.getAttribute("href").slice(1)
      )
    )
    .filter(Boolean);

  function updateActiveSection() {
    const currentHash = decodeURIComponent(
      window.location.hash.slice(1)
    );

    const matchingLink = sectionLinks.find(link =>
      link.getAttribute("href").slice(1) === currentHash
    );

    if (matchingLink) {
      setActiveLink(matchingLink);
    } else if (currentPageLink) {
      setActiveLink(currentPageLink, true);
    }
  }

  window.addEventListener("hashchange", updateActiveSection);
  updateActiveSection();

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      entries => {
        const visibleSection = entries
          .filter(entry => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          )[0];

        if (!visibleSection) return;

        const matchingLink = sectionLinks.find(link =>
          link.getAttribute("href") ===
          `#${visibleSection.target.id}`
        );

        if (matchingLink) {
          setActiveLink(matchingLink);
        }
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: [0, 0.1, 0.25, 0.5]
      }
    );

    sections.forEach(section => observer.observe(section));
  }

  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", event => {
      const href = link.getAttribute("href");

      if (!href || href === "#") return;

      const target = document.getElementById(
        decodeURIComponent(href.slice(1))
      );

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      history.replaceState(null, "", href);
      setActiveLink(link);
    });
  });

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");

  if (contactForm) {
    contactForm.addEventListener("submit", event => {
      event.preventDefault();

      const name =
        document.getElementById("name")?.value.trim() || "";

      const email =
        document.getElementById("email")?.value.trim() || "";

      const message =
        document.getElementById("message")?.value.trim() || "";

      if (!name || !email || !message) {
        if (formStatus) {
          formStatus.textContent =
            "Please fill in all fields.";
        }
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailPattern.test(email)) {
        if (formStatus) {
          formStatus.textContent =
            "Please enter a valid email address.";
        }

        document.getElementById("email")?.focus();
        return;
      }

      const subject = encodeURIComponent(
        `Portfolio message from ${name}`
      );

      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
      );

      if (formStatus) {
        formStatus.textContent =
          "Opening your email app. If it does not open, email omurukaemmanuel38@gmail.com directly.";
      }

      window.location.href =
        `mailto:omurukaemmanuel38@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  console.log("Emmanuel Wisdom portfolio JavaScript loaded.");
});