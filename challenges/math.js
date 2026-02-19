// ============================================================
//  GateKeep — Math Challenge (example extensibility)
// ============================================================

class MathChallenge {
  constructor(config = {}) {
    this.difficulty = config.difficulty || "medium";
    this.questions = [];
    this.answers = [];
    this.current = 0;
  }

  generateQuestions() {
    const q = [];
    if (this.difficulty === "hard") {
      const primes = [17, 19, 23, 29, 31, 37, 41, 43];
      for (let i = 0; i < 5; i++) {
        const a = primes[Math.floor(Math.random() * primes.length)];
        const b = primes[Math.floor(Math.random() * primes.length)];
        q.push({ text: `${a} × ${b} = ?`, answer: a * b });
      }
    } else {
      for (let i = 0; i < 5; i++) {
        const a = Math.floor(Math.random() * 50) + 10;
        const b = Math.floor(Math.random() * 50) + 10;
        q.push({ text: `${a} + ${b} = ?`, answer: a + b });
      }
    }
    return q;
  }

  render() {
    this.questions = this.generateQuestions();
    this.current = 0;

    const wrapper = document.createElement("div");
    wrapper.className = "gk-challenge gk-math";
    wrapper.innerHTML = `
      <div class="gk-math-inner">
        <div class="gk-challenge-header">
          <div class="gk-badge">CHALLENGE</div>
          <h2 class="gk-title">Mental Math</h2>
          <p class="gk-subtitle">Answer 5 questions correctly to unlock access.</p>
        </div>
        <div class="gk-math-progress" id="gk-math-prog">Question 1 of 5</div>
        <div class="gk-math-question" id="gk-math-q"></div>
        <input class="gk-math-input" id="gk-math-input" type="number" placeholder="Your answer…" autocomplete="off">
        <div class="gk-status" id="gk-math-status"></div>
        <button class="gk-btn-check" id="gk-math-submit">Submit</button>
      </div>
    `;

    this._wrapper = wrapper;
    this._renderQuestion();

    wrapper.querySelector("#gk-math-submit").addEventListener("click", () => this._submit());
    wrapper.querySelector("#gk-math-input").addEventListener("keydown", (e) => {
      if (e.key === "Enter") this._submit();
    });

    return wrapper;
  }

  _renderQuestion() {
    this._wrapper.querySelector("#gk-math-q").textContent = this.questions[this.current].text;
    this._wrapper.querySelector("#gk-math-prog").textContent = `Question ${this.current + 1} of ${this.questions.length}`;
    this._wrapper.querySelector("#gk-math-input").value = "";
    this._wrapper.querySelector("#gk-math-input").focus();
  }

  _submit() {
    const input = this._wrapper.querySelector("#gk-math-input");
    const status = this._wrapper.querySelector("#gk-math-status");
    const val = parseInt(input.value.trim());

    if (isNaN(val)) return;

    if (val === this.questions[this.current].answer) {
      this.current++;
      status.textContent = "Correct! ✓";
      status.className = "gk-status gk-status-success";

      if (this.current >= this.questions.length) {
        status.textContent = "All correct! Unlocking…";
        this._wrapper.classList.add("gk-solved");
        setTimeout(() => {
          if (typeof this.onSolved === "function") this.onSolved();
        }, 1200);
      } else {
        setTimeout(() => {
          status.textContent = "";
          this._renderQuestion();
        }, 600);
      }
    } else {
      status.textContent = `Wrong. Try again. (${this.questions[this.current].text})`;
      status.className = "gk-status gk-status-error";
      // Regenerate questions on wrong answer
      this.questions = this.generateQuestions();
      this.current = 0;
      setTimeout(() => {
        status.textContent = "Questions reset. Start again.";
        this._renderQuestion();
      }, 1500);
    }
  }
}

window.MathChallenge = MathChallenge;
