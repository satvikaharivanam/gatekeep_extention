// ============================================================
//  GateKeep — Sudoku Challenge
// ============================================================

class SudokuChallenge {
  constructor(config = {}) {
    this.difficulty = config.difficulty || "hard";
    this.puzzle = null;
    this.solution = null;
    this.selectedCell = null;
    this.errors = 0;
  }

  // ── Puzzle Bank ───────────────────────────────────────────
  // Each puzzle: [givens, solution] in row-major order, 0 = empty
  getPuzzleBank() {
    return {
      hard: [
        {
          givens: [
            8,0,0, 0,0,0, 0,0,0,
            0,0,3, 6,0,0, 0,0,0,
            0,7,0, 0,9,0, 2,0,0,
            0,5,0, 0,0,7, 0,0,0,
            0,0,0, 0,4,5, 7,0,0,
            0,0,0, 1,0,0, 0,3,0,
            0,0,1, 0,0,0, 0,6,8,
            0,0,8, 5,0,0, 0,1,0,
            0,9,0, 0,0,0, 4,0,0
          ],
          solution: [
            8,1,2, 7,5,3, 6,4,9,
            9,4,3, 6,8,2, 1,7,5,
            6,7,5, 4,9,1, 2,8,3,
            1,5,4, 2,3,7, 8,9,6,
            3,6,9, 8,4,5, 7,2,1,
            2,8,7, 1,6,9, 5,3,4,
            5,2,1, 9,7,4, 3,6,8,
            4,3,8, 5,2,6, 9,1,7,
            7,9,6, 3,1,8, 4,5,2
          ]
        },
        {
          givens: [
            0,0,0, 0,0,0, 0,0,0,
            0,0,0, 0,0,3, 0,8,5,
            0,0,1, 0,2,0, 0,0,0,
            0,0,0, 5,0,7, 0,0,0,
            0,0,4, 0,0,0, 1,0,0,
            0,9,0, 0,0,0, 0,0,0,
            5,0,0, 0,0,0, 0,7,3,
            0,0,2, 0,1,0, 0,0,0,
            0,0,0, 0,4,0, 0,0,9
          ],
          solution: [
            9,8,7, 6,5,4, 3,2,1,
            2,4,6, 1,7,3, 9,8,5,
            3,5,1, 9,2,8, 7,4,6,
            1,2,8, 5,3,7, 6,9,4,
            6,3,4, 8,9,2, 1,5,7,
            7,9,5, 4,6,1, 8,3,2,
            5,1,9, 2,8,6, 4,7,3,
            4,7,2, 3,1,9, 5,6,8,
            8,6,3, 7,4,5, 2,1,9
          ]
        },
        {
          givens: [
            0,2,0, 0,0,0, 0,0,0,
            0,0,0, 6,0,0, 0,0,3,
            0,7,4, 0,8,0, 0,0,0,
            0,0,0, 0,0,3, 0,0,2,
            0,8,0, 0,4,0, 0,1,0,
            6,0,0, 5,0,0, 0,0,0,
            0,0,0, 0,1,0, 7,8,0,
            5,0,0, 0,0,9, 0,0,0,
            0,0,0, 0,0,0, 0,4,0
          ],
          solution: [
            1,2,6, 4,3,7, 9,5,8,
            8,9,5, 6,2,1, 4,7,3,
            3,7,4, 9,8,5, 1,2,6,
            4,5,7, 1,9,3, 8,6,2,
            9,8,3, 2,4,6, 5,1,7,
            6,1,2, 5,7,8, 3,9,4,
            2,6,9, 3,1,4, 7,8,5,
            5,4,8, 7,6,9, 2,3,1,
            7,3,1, 8,5,2, 6,4,9
          ]
        }
      ],
      medium: [
        {
          givens: [
            0,0,0, 2,6,0, 7,0,1,
            6,8,0, 0,7,0, 0,9,0,
            1,9,0, 0,0,4, 5,0,0,
            8,2,0, 1,0,0, 0,4,0,
            0,0,4, 6,0,2, 9,0,0,
            0,5,0, 0,0,3, 0,2,8,
            0,0,9, 3,0,0, 0,7,4,
            0,4,0, 0,5,0, 0,3,6,
            7,0,3, 0,1,8, 0,0,0
          ],
          solution: [
            4,3,5, 2,6,9, 7,8,1,
            6,8,2, 5,7,1, 4,9,3,
            1,9,7, 8,3,4, 5,6,2,
            8,2,6, 1,9,5, 3,4,7,
            3,7,4, 6,8,2, 9,1,5,
            9,5,1, 7,4,3, 6,2,8,
            5,1,9, 3,2,6, 8,7,4,
            2,4,8, 9,5,7, 1,3,6,
            7,6,3, 4,1,8, 2,5,9
          ]
        }
      ]
    };
  }

  load() {
    const bank = this.getPuzzleBank()[this.difficulty] || this.getPuzzleBank().hard;
    const chosen = bank[Math.floor(Math.random() * bank.length)];
    this.puzzle = [...chosen.givens];
    this.solution = [...chosen.solution];
    this.userGrid = [...chosen.givens]; // player's working copy
  }

  // ── Render ────────────────────────────────────────────────
  render() {
    this.load();

    const wrapper = document.createElement("div");
    wrapper.className = "gk-challenge gk-sudoku";
    wrapper.innerHTML = `
      <div class="gk-sudoku-inner">
        <div class="gk-challenge-header">
          <div class="gk-badge">CHALLENGE</div>
          <h2 class="gk-title">Solve the Puzzle</h2>
          <p class="gk-subtitle">Complete this hard Sudoku to unlock access.</p>
        </div>

        <div class="gk-sudoku-grid" id="gk-grid"></div>

        <div class="gk-numpad" id="gk-numpad">
          ${[1,2,3,4,5,6,7,8,9].map(n =>
            `<button class="gk-numpad-btn" data-num="${n}">${n}</button>`
          ).join("")}
          <button class="gk-numpad-btn gk-erase" data-num="0">⌫</button>
        </div>

        <div class="gk-actions">
          <div class="gk-status" id="gk-status"></div>
          <button class="gk-btn-check" id="gk-check">Check Solution</button>
        </div>
      </div>
    `;

    this._buildGrid(wrapper.querySelector("#gk-grid"));
    this._bindNumpad(wrapper.querySelector("#gk-numpad"));
    wrapper.querySelector("#gk-check").addEventListener("click", () => this._checkSolution(wrapper));

    return wrapper;
  }

  _buildGrid(grid) {
    for (let i = 0; i < 81; i++) {
      const cell = document.createElement("div");
      cell.className = "gk-cell";
      cell.dataset.index = i;

      const row = Math.floor(i / 9);
      const col = i % 9;
      const box = Math.floor(row / 3) * 3 + Math.floor(col / 3);
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.dataset.box = box;

      if (this.puzzle[i] !== 0) {
        cell.textContent = this.puzzle[i];
        cell.classList.add("gk-given");
      } else {
        cell.classList.add("gk-editable");
        cell.addEventListener("click", () => this._selectCell(cell));
      }

      grid.appendChild(cell);
    }
    this._gridEl = grid;
  }

  _selectCell(cell) {
    this._gridEl.querySelectorAll(".gk-cell").forEach(c => {
      c.classList.remove("gk-selected", "gk-highlight");
    });

    cell.classList.add("gk-selected");
    this.selectedCell = cell;

    // Highlight same row, col, box
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    const box = cell.dataset.box;
    this._gridEl.querySelectorAll(".gk-cell").forEach(c => {
      if (c !== cell && (c.dataset.row === row || c.dataset.col === col || c.dataset.box === box)) {
        c.classList.add("gk-highlight");
      }
    });
  }

  _bindNumpad(numpad) {
    numpad.addEventListener("click", (e) => {
      const btn = e.target.closest(".gk-numpad-btn");
      if (!btn || !this.selectedCell) return;
      const num = parseInt(btn.dataset.num);
      const idx = parseInt(this.selectedCell.dataset.index);
      this.userGrid[idx] = num;
      this.selectedCell.textContent = num === 0 ? "" : num;
      this.selectedCell.classList.remove("gk-error");
    });

    // Keyboard support
    document.addEventListener("keydown", (e) => {
      if (!this.selectedCell) return;
      if (e.key >= "1" && e.key <= "9") {
        const idx = parseInt(this.selectedCell.dataset.index);
        this.userGrid[idx] = parseInt(e.key);
        this.selectedCell.textContent = e.key;
        this.selectedCell.classList.remove("gk-error");
      } else if (e.key === "Backspace" || e.key === "Delete" || e.key === "0") {
        const idx = parseInt(this.selectedCell.dataset.index);
        this.userGrid[idx] = 0;
        this.selectedCell.textContent = "";
        this.selectedCell.classList.remove("gk-error");
      }
    });
  }

  _checkSolution(wrapper) {
    let allFilled = true;
    let hasError = false;

    this._gridEl.querySelectorAll(".gk-editable").forEach(cell => {
      const idx = parseInt(cell.dataset.index);
      const val = this.userGrid[idx];
      if (!val) {
        allFilled = false;
      } else if (val !== this.solution[idx]) {
        cell.classList.add("gk-error");
        hasError = true;
      } else {
        cell.classList.remove("gk-error");
      }
    });

    const status = wrapper.querySelector("#gk-status");

    if (!allFilled) {
      status.textContent = "Fill in all cells first.";
      status.className = "gk-status gk-status-warn";
      return;
    }

    if (hasError) {
      this.errors++;
      status.textContent = `Incorrect. ${this.errors} mistake${this.errors > 1 ? "s" : ""} so far. Keep trying.`;
      status.className = "gk-status gk-status-error";
      return;
    }

    // ✅ Solved!
    status.textContent = "Solved! Unlocking access…";
    status.className = "gk-status gk-status-success";
    wrapper.classList.add("gk-solved");

    setTimeout(() => {
      if (typeof this.onSolved === "function") this.onSolved();
    }, 1200);
  }
}

window.SudokuChallenge = SudokuChallenge;
