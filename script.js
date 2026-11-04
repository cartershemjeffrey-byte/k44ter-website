(() => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
      nav.classList.toggle("open", open);
    });
    nav.addEventListener("click", event => {
      if (event.target.closest("a")) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation");
        nav.classList.remove("open");
      }
    });
  }
  const file = location.pathname.split("/").pop() || "index.html";
  const active = file === "index.html" ? "home" : file.replace(".html", "");
  document.querySelectorAll(".primary-nav a").forEach(link => {
    if (link.dataset.page === active) link.setAttribute("aria-current", "page");
  });
})();