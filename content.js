// ============================================================
//  GateKeep — Content Script (runs at document_start)
// ============================================================

(function () {
  "use strict";

  const config = window.GATEKEEP_CONFIG;
  if (!config) return;

  // ── Match current site ────────────────────────────────────
  const hostname = location.hostname;
  const siteRule = config.sites.find(s => s.match.test(hostname));
  if (!siteRule) return;

  // ── Check unlock cache ────────────────────────────────────
  const storageKey = `gk_unlock_${hostname}`;
  const stored = localStorage.getItem(storageKey);
  if (stored) {
    const expiry = parseInt(stored, 10);
    if (Date.now() < expiry) return; // still unlocked
    localStorage.removeItem(storageKey);
  }

  // ── Freeze the page ───────────────────────────────────────
  // Block rendering immediately (document_start)
  document.documentElement.style.visibility = "hidden";

  window.addEventListener("DOMContentLoaded", () => {
    document.documentElement.style.visibility = "";
    mount(siteRule);
  });

  // If DOMContentLoaded already fired (shouldn't at document_start but safety net):
  if (document.readyState !== "loading") {
    document.documentElement.style.visibility = "";
    mount(siteRule);
  }

  // ── Mount the gate overlay ────────────────────────────────
  function mount(rule) {
    // Prevent the real page content from being interactable
    const overlay = document.createElement("div");
    overlay.id = "gk-overlay";

    // Header bar
    overlay.innerHTML = `
      <div class="gk-topbar">
        <span class="gk-logo">🔒 GateKeep</span>
        <span class="gk-site-label">→ ${rule.label}</span>
      </div>
      <div class="gk-container" id="gk-container"></div>
    `;

    document.body.appendChild(overlay);
    // Prevent scrolling the real page
    document.body.style.overflow = "hidden";

    // Instantiate the right challenge
    const challengeClassName = config.challenges[rule.challengeType];
    const ChallengeClass = window[challengeClassName];

    if (!ChallengeClass) {
      console.error(`GateKeep: challenge class "${challengeClassName}" not found.`);
      unlock(overlay);
      return;
    }

    const challenge = new ChallengeClass(rule.challengeConfig || {});
    challenge.onSolved = () => unlock(overlay, rule);

    const challengeEl = challenge.render();
    overlay.querySelector("#gk-container").appendChild(challengeEl);
  }

  // ── Unlock ────────────────────────────────────────────────
  function unlock(overlay, rule) {
    // Store unlock expiry
    const duration = (config.unlockDurationMinutes || 120) * 60 * 1000;
    if (duration > 0) {
      localStorage.setItem(storageKey, String(Date.now() + duration));
    }

    overlay.classList.add("gk-unlocking");
    document.body.style.overflow = "";

    setTimeout(() => {
      overlay.remove();
      // Reload so the original page loads normally
      location.reload();
    }, 800);
  }

})();
