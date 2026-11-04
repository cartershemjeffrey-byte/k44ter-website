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
  document.querySelectorAll("[data-filter-group]").forEach(group => {
    const kind = group.dataset.filterGroup;
    const buttons = [...group.querySelectorAll("[data-filter]")];
    const items = [...document.querySelectorAll(`[data-filter-items="${kind}"] [data-category]`)];
    const sections = [...document.querySelectorAll(`[data-filter-content="${kind}"]`)];
    const empty = document.querySelector(`[data-filter-empty="${kind}"]`);
    buttons.forEach(button => button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      buttons.forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
      });
      if (items.length) {
        let visibleCount = 0;
        items.forEach(item => {
          const visible = filter === "all" || item.dataset.category.split(/\s+/).includes(filter);
          item.hidden = !visible;
          if (visible) visibleCount += 1;
        });
        if (empty) {
          empty.hidden = visibleCount > 0;
          empty.textContent = visibleCount ? "" : `No ${button.textContent.trim().toLowerCase()} listed yet.`;
        }
      }
      if (sections.length) {
        sections.forEach(section => { section.hidden = filter !== "all"; });
        if (empty) {
          empty.hidden = filter === "all";
          empty.textContent = filter === "all" ? "" : `No ${button.textContent.trim().toLowerCase()} listed yet.`;
        }
      }
    }));
  });
  const countdown = document.querySelector("[data-countdown]");
  if (countdown) {
    const target = Date.parse(countdown.dataset.target);
    const fields = {
      days: countdown.querySelector("[data-days]"),
      hours: countdown.querySelector("[data-hours]"),
      minutes: countdown.querySelector("[data-minutes]"),
      seconds: countdown.querySelector("[data-seconds]")
    };
    const updateCountdown = () => {
      const remaining = Math.max(0, target - Date.now());
      const totalSeconds = Math.floor(remaining / 1000);
      fields.days.textContent = String(Math.floor(totalSeconds / 86400));
      fields.hours.textContent = String(Math.floor((totalSeconds % 86400) / 3600)).padStart(2, "0");
      fields.minutes.textContent = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
      fields.seconds.textContent = String(totalSeconds % 60).padStart(2, "0");
    };
    updateCountdown();
    window.setInterval(updateCountdown, 1000);
  }
  const file = location.pathname.split("/").pop() || "index.html";
  const active = file === "index.html" ? "home" : file.replace(".html", "");
  document.querySelectorAll(".primary-nav a").forEach(link => {
    if (link.dataset.page === active) link.setAttribute("aria-current", "page");
  });
})();