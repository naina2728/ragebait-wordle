// ============================================================
// RAGEBAIT WORDLE
// A wordle that's rigged to make you ALMOST win every row
// but you only get it on the 6th try (maybe).
// Uses VALID_WORDS (Set) and ANSWER_WORDS (Array) from words.js
// ============================================================

// ============================================================
// PRE-COMPUTE: Build a neighbor index for fast near-miss lookups
// For every answer word, find all answer words 1 letter away
// ============================================================

const neighborCache = new Map();

function buildNeighborIndex() {
  const words = ANSWER_WORDS;
  for (const word of words) {
    const neighbors = [];
    for (const other of words) {
      if (other === word) continue;
      let diff = 0;
      for (let i = 0; i < 5; i++) {
        if (word[i] !== other[i]) diff++;
        if (diff > 2) break;
      }
      if (diff === 1) neighbors.push(other);
    }
    if (neighbors.length > 0) {
      neighborCache.set(word, neighbors);
    }
  }
}

buildNeighborIndex();

// Get the words with the most 1-letter-away neighbors (most frustrating)
function getBestTargets() {
  const entries = [...neighborCache.entries()];
  entries.sort((a, b) => b[1].length - a[1].length);
  // Top 200 words with most neighbors = maximum rage potential
  return entries.slice(0, 200).map(e => e[0]);
}

const BEST_TARGETS = getBestTargets();

// ============================================================
// RAGE MESSAGES
// ============================================================

const RAGE_TOASTS = [
  "SO close! 😩",
  "Almost had it! 🤏",
  "One letter off... 💀",
  "You're RIGHT there!",
  "This is YOUR round... right?",
  "The answer is on the tip of your tongue!",
  "Surely next guess...",
  "Can you FEEL how close you are?",
  "Don't give up now!",
  "It's basically solved already!",
  "You practically have it!",
  "Just one tiny change...",
  "AGHHH so close!",
  "The word is BEGGING you to guess it",
  "Your brain knows it...",
  "I believe in you (kinda) 🫠",
  "Soooo close it hurts",
  "You're basically a genius... almost",
  "The word is RIGHT there...",
  "One. Letter. Off. 😤",
];

const LOSS_MESSAGES = [
  "You were SO close the entire time...",
  "Every single guess was almost right 😭",
  "The answer was right there all along...",
  "One letter away, six times in a row 💀",
  "This game owes you an apology",
  "Literally ONE letter each time... brutal",
  "The word was hiding in plain sight 🫠",
];

// ============================================================
// GAME STATE
// ============================================================

let targetWord = "";
let currentRow = 0;
let currentTile = 0;
let currentGuess = "";
let gameOver = false;
let guessedWords = [];
let isRevealing = false; // lock input during reveal animation

// ============================================================
// CORE EVALUATION
// ============================================================

function evaluateGuess(guess, target) {
  const result = Array(5).fill("absent");
  const targetArr = target.split("");
  const guessArr = guess.split("");
  const used = Array(5).fill(false);

  // First pass: correct (green)
  for (let i = 0; i < 5; i++) {
    if (guessArr[i] === targetArr[i]) {
      result[i] = "correct";
      used[i] = true;
    }
  }

  // Second pass: present (yellow)
  for (let i = 0; i < 5; i++) {
    if (result[i] === "correct") continue;
    for (let j = 0; j < 5; j++) {
      if (!used[j] && guessArr[i] === targetArr[j]) {
        result[i] = "present";
        used[j] = true;
        break;
      }
    }
  }

  return result;
}

function countGreens(evaluation) {
  return evaluation.filter(e => e === "correct").length;
}

function countHits(evaluation) {
  return evaluation.filter(e => e !== "absent").length;
}

// ============================================================
// CORE RIGGING LOGIC - THE SECRET SAUCE
// ============================================================

/**
 * Score how "frustrating" a candidate target is relative to a guess.
 * Higher = more rage-inducing (many greens/yellows but NOT a win)
 */
function frustrationScore(guess, candidate) {
  if (guess === candidate) return -1000; // never pick exact match
  const eval_ = evaluateGuess(guess, candidate);
  const greens = countGreens(eval_);
  const hits = countHits(eval_);
  // 4 greens = maximum rage, 3 greens + yellows = very close
  return greens * 20 + hits * 5;
}

/**
 * Find the best alternative target that:
 * 1. Is NOT the player's guess
 * 2. Is NOT already guessed
 * 3. Gives maximum greens/yellows (close but no cigar)
 * 4. Is consistent with ALL previous evaluations shown to the player
 */
function findBestSwap(guess, previousEvals) {
  let bestWord = null;
  let bestScore = -Infinity;

  // Search through answer words for best near-miss
  for (const candidate of ANSWER_WORDS) {
    if (candidate === guess) continue;
    if (guessedWords.includes(candidate)) continue;

    // CHECK CONSISTENCY: The new target must produce the SAME evaluation
    // for all previously shown guesses. Otherwise the player would notice
    // contradictions in their colored tiles.
    let consistent = true;
    for (const { word, result } of previousEvals) {
      const hypothetical = evaluateGuess(word, candidate);
      for (let i = 0; i < 5; i++) {
        if (hypothetical[i] !== result[i]) {
          consistent = false;
          break;
        }
      }
      if (!consistent) break;
    }
    if (!consistent) continue;

    const score = frustrationScore(guess, candidate);
    if (score > bestScore) {
      bestScore = score;
      bestWord = candidate;
    }
  }

  return bestWord;
}

/**
 * The main rigging function. Called on every guess submission.
 * Decides whether to swap the target to maximize frustration.
 */
// Track what evaluations we've shown the player (for consistency checking)
let shownEvaluations = [];

function maybeRigTheGame(guess) {
  const currentEval = evaluateGuess(guess, targetWord);
  const greens = countGreens(currentEval);
  const hits = countHits(currentEval);
  const isExactMatch = (guess === targetWord);
  const isLastRow = (currentRow === 5);

  // ---- RULE 1: Last row (6th guess) - MAYBE let them win ----
  if (isLastRow) {
    if (isExactMatch) {
      // They guessed it on the last try - let them have it (backhanded win)
      return currentEval;
    }
    // Not correct on last row - just show the honest eval, they lose
    // But first, try to swap to something that gives them 4 greens for max pain
    const swap = findBestSwap(guess, shownEvaluations);
    if (swap) {
      const swapEval = evaluateGuess(guess, swap);
      const swapGreens = countGreens(swapEval);
      // If the swap gives more greens than current, use it for extra pain
      if (swapGreens > greens && swapGreens >= 3) {
        targetWord = swap;
        return swapEval;
      }
    }
    return currentEval;
  }

  // ---- RULE 2: Exact match before last row - ALWAYS swap ----
  if (isExactMatch) {
    const swap = findBestSwap(guess, shownEvaluations);
    if (swap) {
      targetWord = swap;
      return evaluateGuess(guess, targetWord);
    }
    // Extremely rare: no consistent swap exists. Let them win.
    return currentEval;
  }

  // ---- RULE 3: Very close (4 greens) - maybe downgrade to 3 ----
  if (greens === 4 && currentRow < 4) {
    // 50% chance to swap to something with 3 greens instead (evil)
    if (Math.random() < 0.5) {
      const swap = findBestSwap(guess, shownEvaluations);
      if (swap) {
        const swapEval = evaluateGuess(guess, swap);
        const swapGreens = countGreens(swapEval);
        if (swapGreens === 3 && countHits(swapEval) >= 4) {
          targetWord = swap;
          return swapEval;
        }
      }
    }
    // Otherwise let the 4 greens stand - it's still rage-inducing
    return currentEval;
  }

  // ---- RULE 4: Cold guess (0-1 hits) - warm them up for frustration ----
  if (hits <= 1 && currentRow <= 2) {
    const swap = findBestSwap(guess, shownEvaluations);
    if (swap) {
      const swapEval = evaluateGuess(guess, swap);
      const swapHits = countHits(swapEval);
      const swapGreens = countGreens(swapEval);
      // Swap only if it gives significantly more hits
      if (swapHits >= 3 && swapGreens >= 1) {
        targetWord = swap;
        return swapEval;
      }
    }
  }

  // ---- RULE 5: Moderate guess (2-3 hits) - try to bump up to 3-4 greens ----
  if (hits >= 2 && greens <= 2 && currentRow <= 3) {
    const swap = findBestSwap(guess, shownEvaluations);
    if (swap) {
      const swapEval = evaluateGuess(guess, swap);
      const swapGreens = countGreens(swapEval);
      const swapHits = countHits(swapEval);
      if (swapGreens >= 3 && swapHits >= 4 && swapGreens > greens) {
        targetWord = swap;
        return swapEval;
      }
    }
  }

  return currentEval;
}


// ============================================================
// UI
// ============================================================

const board = document.getElementById("board");
const keyboard = document.getElementById("keyboard");
const toastContainer = document.getElementById("toast-container");
const modalOverlay = document.getElementById("modal-overlay");
const modalTitle = document.getElementById("modal-title");
const modalMessage = document.getElementById("modal-message");
const modalWord = document.getElementById("modal-word");
const modalEmoji = document.getElementById("modal-emoji");
const playAgainBtn = document.getElementById("play-again-btn");

function createBoard() {
  board.innerHTML = "";
  for (let r = 0; r < 6; r++) {
    const row = document.createElement("div");
    row.classList.add("row");
    row.id = `row-${r}`;
    for (let c = 0; c < 5; c++) {
      const tile = document.createElement("div");
      tile.classList.add("tile");
      tile.id = `tile-${r}-${c}`;
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
}

function showToast(message, isRage = false) {
  const toast = document.createElement("div");
  toast.classList.add("toast");
  if (isRage) toast.classList.add("rage");
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 1500);
}

function showModal(won) {
  if (won) {
    modalEmoji.textContent = "😤";
    modalTitle.textContent = "You got it...";
    modalMessage.textContent = "On the LAST try. After being one letter away FIVE times. Sure, call that a win.";
    modalWord.textContent = targetWord;
  } else {
    modalEmoji.textContent = "💀";
    modalTitle.textContent = "So close yet so far";
    modalMessage.textContent = LOSS_MESSAGES[Math.floor(Math.random() * LOSS_MESSAGES.length)];
    modalWord.textContent = targetWord;
  }
  modalOverlay.classList.remove("hidden");
}

function updateKeyboard(guess, evaluation) {
  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i];
    const btn = keyboard.querySelector(`button[data-key="${letter}"]`);
    if (!btn) continue;

    const state = evaluation[i];
    // Only upgrade: absent -> present -> correct
    if (state === "correct") {
      btn.className = btn.classList.contains("wide-btn") ? "wide-btn correct" : "correct";
    } else if (state === "present" && !btn.classList.contains("correct")) {
      btn.className = btn.classList.contains("wide-btn") ? "wide-btn present" : "present";
    } else if (state === "absent" && !btn.classList.contains("correct") && !btn.classList.contains("present")) {
      btn.className = btn.classList.contains("wide-btn") ? "wide-btn absent" : "absent";
    }
  }
}

function revealRow(rowIndex, evaluation, callback) {
  const row = document.getElementById(`row-${rowIndex}`);
  const tiles = row.querySelectorAll(".tile");

  tiles.forEach((tile, i) => {
    setTimeout(() => {
      tile.classList.add("revealed");

      // After the flip midpoint, apply the color
      setTimeout(() => {
        tile.classList.add(evaluation[i]);
      }, 250);

      // After full flip of last tile, run callback
      if (i === 4 && callback) {
        setTimeout(callback, 300);
      }
    }, i * 300);
  });
}

function playAlmostAnimation(rowIndex) {
  const row = document.getElementById(`row-${rowIndex}`);
  const tiles = row.querySelectorAll(".tile");
  tiles.forEach((tile, i) => {
    setTimeout(() => {
      tile.classList.add("almost");
    }, i * 80);
  });
}

function playWinAnimation(rowIndex) {
  const row = document.getElementById(`row-${rowIndex}`);
  const tiles = row.querySelectorAll(".tile");
  tiles.forEach((tile, i) => {
    setTimeout(() => {
      tile.classList.add("dance");
    }, i * 100);
  });
}

function submitGuess() {
  if (gameOver || isRevealing) return;
  if (currentGuess.length !== 5) {
    const row = document.getElementById(`row-${currentRow}`);
    row.classList.add("shake");
    setTimeout(() => row.classList.remove("shake"), 500);
    showToast("Not enough letters");
    return;
  }

  if (!VALID_WORDS.has(currentGuess)) {
    const row = document.getElementById(`row-${currentRow}`);
    row.classList.add("shake");
    setTimeout(() => row.classList.remove("shake"), 500);
    showToast("Not in word list");
    return;
  }

  isRevealing = true;

  // THE RIG: get (possibly manipulated) evaluation
  const evaluation = maybeRigTheGame(currentGuess);
  const isCorrect = currentGuess === targetWord;

  // Record what we showed the player (for consistency checking on future swaps)
  shownEvaluations.push({ word: currentGuess, result: [...evaluation] });
  guessedWords.push(currentGuess);

  revealRow(currentRow, evaluation, () => {
    updateKeyboard(currentGuess, evaluation);
    isRevealing = false;

    if (isCorrect) {
      gameOver = true;
      playWinAnimation(currentRow);
      setTimeout(() => showModal(true), 800);
      return;
    }

    const hits = countHits(evaluation);
    const greens = countGreens(evaluation);

    // Show frustrating toast based on how close they were
    if (greens >= 3 || hits >= 4) {
      showToast(RAGE_TOASTS[Math.floor(Math.random() * RAGE_TOASTS.length)], true);
      playAlmostAnimation(currentRow);
    } else if (hits >= 2) {
      showToast(RAGE_TOASTS[Math.floor(Math.random() * RAGE_TOASTS.length)], false);
    }

    currentRow++;
    currentTile = 0;
    currentGuess = "";

    if (currentRow >= 6) {
      gameOver = true;
      setTimeout(() => showModal(false), 600);
    }
  });
}

function handleKey(key) {
  if (gameOver || isRevealing) return;

  if (key === "ENTER") {
    submitGuess();
    return;
  }

  if (key === "BACKSPACE") {
    if (currentTile > 0) {
      currentTile--;
      currentGuess = currentGuess.slice(0, -1);
      const tile = document.getElementById(`tile-${currentRow}-${currentTile}`);
      tile.textContent = "";
      tile.classList.remove("filled");
    }
    return;
  }

  if (currentTile < 5 && /^[A-Z]$/.test(key)) {
    const tile = document.getElementById(`tile-${currentRow}-${currentTile}`);
    tile.textContent = key;
    tile.classList.add("filled");
    currentGuess += key;
    currentTile++;
  }
}

// ============================================================
// EVENT LISTENERS
// ============================================================

keyboard.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  const key = btn.dataset.key;
  if (key) handleKey(key);
});

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey || e.metaKey || e.altKey) return;

  if (e.key === "Enter") {
    handleKey("ENTER");
  } else if (e.key === "Backspace") {
    handleKey("BACKSPACE");
  } else if (/^[a-zA-Z]$/.test(e.key)) {
    handleKey(e.key.toUpperCase());
  }
});

playAgainBtn.addEventListener("click", () => {
  modalOverlay.classList.add("hidden");
  resetGame();
});

// ============================================================
// INIT
// ============================================================

function pickTargetWord() {
  // Pick from BEST_TARGETS (words with most 1-off neighbors) for max frustration
  if (BEST_TARGETS.length > 0) {
    return BEST_TARGETS[Math.floor(Math.random() * BEST_TARGETS.length)];
  }
  return ANSWER_WORDS[Math.floor(Math.random() * ANSWER_WORDS.length)];
}

function resetGame() {
  currentRow = 0;
  currentTile = 0;
  currentGuess = "";
  gameOver = false;
  guessedWords = [];
  shownEvaluations = [];
  targetWord = pickTargetWord();

  createBoard();

  // Reset keyboard colors
  keyboard.querySelectorAll("button").forEach(btn => {
    const isWide = btn.dataset.key === "ENTER" || btn.dataset.key === "BACKSPACE";
    btn.className = isWide ? "wide-btn" : "";
  });
}

resetGame();
