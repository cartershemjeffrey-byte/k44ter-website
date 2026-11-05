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
  document.querySelectorAll("[data-audio-player]").forEach(player => {
    const audio = player.querySelector("audio"), button = player.querySelector(".audio-play"), time = player.querySelector(".player-time"), progress = player.querySelector(".audio-progress"), fill = progress.querySelector("span");
    const fmt = value => { if (!Number.isFinite(value)) return "0:00"; const n = Math.floor(value); return Math.floor(n/60)+":"+String(n%60).padStart(2,"0"); };
    const update = () => { const d = Number.isFinite(audio.duration) ? audio.duration : 0; time.textContent = fmt(audio.currentTime)+" / "+fmt(d); fill.style.width = d ? (audio.currentTime/d*100)+"%" : "0%"; };
    button.addEventListener("click", async () => { if (audio.paused) { document.querySelectorAll("[data-audio-player] audio").forEach(other => { if(other!==audio) other.pause(); }); try { await audio.play(); } catch { button.setAttribute("aria-label","Unable to play audio"); } } else audio.pause(); });
    audio.addEventListener("play",()=>{button.classList.add("is-playing");button.setAttribute("aria-label","Pause audio");}); audio.addEventListener("pause",()=>{button.classList.remove("is-playing");button.setAttribute("aria-label","Play audio");}); audio.addEventListener("ended",()=>{button.classList.remove("is-playing");button.setAttribute("aria-label","Play audio");audio.currentTime=0;update();});
    audio.addEventListener("timeupdate",update); audio.addEventListener("loadedmetadata",update); progress.addEventListener("click",event=>{if(!Number.isFinite(audio.duration))return;const b=progress.getBoundingClientRect();audio.currentTime=Math.max(0,Math.min(1,(event.clientX-b.left)/b.width))*audio.duration;}); update();
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

// Switch product mockups between front and back without enabling checkout.
document.querySelectorAll('[data-merch-product]').forEach(product => {
  const front = product.querySelector('[data-merch-front]');
  const back = product.querySelector('[data-merch-back]');
  const toggle = product.querySelector('[data-merch-toggle]');
  const label = product.querySelector('[data-merch-label]');
  const controls = [...product.querySelectorAll('[data-merch-side]')];
  const name = product.dataset.productName || 'product';
  const setSide = side => {
    const showingBack = side === 'back';
    front.hidden = showingBack;
    back.hidden = !showingBack;
    toggle.setAttribute('aria-label', `Show ${showingBack ? 'front' : 'back'} of ${name}`);
    label.textContent = showingBack ? 'BACK VIEW · CLICK TO SEE FRONT' : 'FRONT VIEW · CLICK TO SEE BACK';
    controls.forEach(control => {
      const active = control.dataset.merchSide === side;
      control.classList.toggle('active', active);
      control.setAttribute('aria-pressed', String(active));
    });
  };
  controls.forEach(control => control.addEventListener('click', () => setSide(control.dataset.merchSide)));
  toggle.addEventListener('click', () => setSide(front.hidden ? 'front' : 'back'));
});
