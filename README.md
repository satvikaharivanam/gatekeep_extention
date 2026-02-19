# 🔒 GateKeep — Puzzle-Gated Website Access

A cross-browser extension (Chrome + Safari) that requires you to solve a challenge before accessing distracting websites.

---

## 📦 Installation

### Chrome / Edge / Brave (Manifest V3)

1. Open Chrome and navigate to `chrome://extensions`
2. Enable **Developer Mode** (toggle top-right)
3. Click **"Load unpacked"**
4. Select the `gatekeep-extension/` folder
5. Done! Visit Netflix and you'll be greeted with a Sudoku puzzle.

### Safari (macOS 14+ / iOS 17+)

Safari requires converting the extension using Xcode:

**Prerequisites:** Xcode 14+ installed (free from the Mac App Store)

```bash
# In Terminal, run:
xcrun safari-web-extension-converter /path/to/gatekeep-extension \
  --project-location ~/Desktop \
  --app-name GateKeep \
  --bundle-identifier com.yourname.gatekeep
```

This generates an Xcode project. Then:

1. Open the generated `.xcodeproj` in Xcode
2. Set your Apple Developer Team in signing settings
3. Run the app on your Mac (⌘R)
4. In Safari → Settings → Extensions → enable **GateKeep**
5. Grant permissions for the sites you want to gate

> **Note:** For iOS, archive and install via TestFlight or Xcode device deployment.

---

## ⚙️ Configuration

Edit **`config.js`** to customize everything:

### Add a new site

```js
sites: [
  {
    match: /reddit\.com/,       // regex to match hostname
    label: "Reddit",            // display name
    challengeType: "sudoku",    // which puzzle to use
    challengeConfig: { difficulty: "hard" }
  }
]
```

### Change unlock duration

```js
unlockDurationMinutes: 60  // unlock for 1 hour after solving
// Set to 0 to require solving on every visit
```

### Switch puzzle type

```js
challengeType: "math"   // use the math challenge instead
```

---

## 🧩 Adding New Challenge Types

1. Create a new file in `challenges/`, e.g. `challenges/typing.js`
2. Implement a class with:
   - `render()` → returns a DOM element to mount
   - `onSolved` callback property (called when challenge is complete)
3. Expose it on `window`: `window.TypingChallenge = TypingChallenge`
4. Register it in `config.js`:
   ```js
   challenges: {
     sudoku: "SudokuChallenge",
     math:   "MathChallenge",
     typing: "TypingChallenge",   // ← add this
   }
   ```
5. Add the script to `manifest.json`'s `content_scripts.js` array

Ideas for future challenges:
- 🔤 Typing speed test
- 🧠 Memory card flip
- 📚 Vocabulary/trivia quiz
- 🎵 Music theory ear training
- ✏️ "Write 3 reasons you need this site right now"

---

## 📁 File Structure

```
gatekeep-extension/
├── manifest.json          # Extension manifest (MV3)
├── config.js              # ← Edit this to configure sites & puzzles
├── content.js             # Core gate logic & unlock management
├── challenges/
│   ├── sudoku.js          # Sudoku challenge
│   └── math.js            # Math challenge (example)
├── styles/
│   └── gate.css           # All overlay styles
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## 🔑 Unlock Storage

Solved puzzles are stored in `localStorage` with an expiry timestamp. After the `unlockDurationMinutes` window, the gate reappears. This is per-browser-profile and clears if the user clears site data.

For a more robust solution, you could migrate the unlock state to `chrome.storage.local` (already in permissions) for cross-tab persistence — the architecture is ready for this.

# gatekeep