// ============================================================
//  GateKeep — Central Configuration
//  Add new sites and challenge types here.
// ============================================================

window.GATEKEEP_CONFIG = {

  // How long (in minutes) access is unlocked after solving a puzzle.
  // Set to 0 to require solving every single visit.
  unlockDurationMinutes: 120,

  // ── Site Rules ────────────────────────────────────────────
  // Each entry maps a hostname pattern to a challenge type.
  // challengeType must match a key in GATEKEEP_CHALLENGES below.
  sites: [
    {
      match: /netflix\.com/,
      label: "Netflix",
      challengeType: "sudoku",
      challengeConfig: { difficulty: "hard" }
    },
    // Uncomment to add more sites:
    // {
    //   match: /youtube\.com/,
    //   label: "YouTube",
    //   challengeType: "sudoku",
    //   challengeConfig: { difficulty: "medium" }
    // },
    // {
    //   match: /reddit\.com/,
    //   label: "Reddit",
    //   challengeType: "math",
    //   challengeConfig: { difficulty: "hard" }
    // },
  ],

  // ── Challenge Registry ────────────────────────────────────
  // Maps challenge type names to their handler class names.
  // Add new challenge types here when you build them.
  challenges: {
    sudoku: "SudokuChallenge",
    math:   "MathChallenge",
    // future: "typing", "memory", "trivia", etc.
  }

};
