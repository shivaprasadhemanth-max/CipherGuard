const passwordInput = document.getElementById("password");
const toggleVisibility = document.getElementById("toggle-visibility");
const strengthLabel = document.getElementById("strength-label");
const meterFill = document.getElementById("meter-fill");
const strengthMeter = document.getElementById("strength-meter");
const scoreOutput = document.getElementById("score");
const scoreTitle = document.getElementById("score-title");
const scoreSummary = document.getElementById("score-summary");
const checksCount = document.getElementById("checks-count");
const suggestions = document.getElementById("suggestions");
const lengthRange = document.getElementById("length-range");
const lengthValue = document.getElementById("length-value");
const generatedOutput = document.getElementById("generated-password");
const generatorStatus = document.getElementById("generator-status");

document.getElementById("year").textContent = new Date().getFullYear();

const commonPasswords = new Set([
  "password", "password123", "123456", "12345678", "123456789", "qwerty",
  "qwerty123", "admin", "admin123", "letmein", "welcome", "iloveyou",
  "abc123", "111111", "000000", "changeme", "passw0rd", "india123"
]);
const commonPatterns = [
  /1234/, /2345/, /3456/, /4567/, /5678/, /6789/, /9876/,
  /qwerty/i, /asdf/i, /password/i, /admin/i, /letmein/i,
  /(.)\1{2,}/
];

function analyzePassword(password) {
  if (!password) return { score: 0, label: "Waiting for input", tier: "neutral",
    title: "Start with a unique password", summary: "Your analysis will appear here as you type.",
    checks: {}, tips: ["Use 12–16 or more characters.", "Prefer a unique passphrase with unrelated words.", "Never reuse passwords across accounts."] };

  const lower = /[a-z]/.test(password);
  const upper = /[A-Z]/.test(password);
  const number = /\d/.test(password);
  const symbol = /[^A-Za-z0-9]/.test(password);
  const length = password.length >= 12;
  const unique = !/(.)\1{2,}/.test(password);
  const pattern = !commonPatterns.some((regex) => regex.test(password)) &&
    !commonPasswords.has(password.toLowerCase());
  const checks = {
    length,
    case: lower && upper,
    number,
    symbol,
    unique,
    pattern
  };

  // This is a heuristic for learning purposes, not a cryptographic audit.
  let score = 0;
  score += Math.min(password.length / 16, 1) * 35;
  score += (lower && upper ? 12 : (lower || upper ? 5 : 0));
  score += number ? 12 : 0;
  score += symbol ? 15 : 0;
  score += unique ? 8 : 0;
  score += pattern ? 10 : 0;
  if (password.length < 8) score -= 15;
  if (commonPasswords.has(password.toLowerCase())) score = Math.min(score, 8);
  if (commonPatterns.some((regex) => regex.test(password))) score -= 12;
  if (/^(.)\1+$/.test(password)) score = Math.min(score, 5);
  score = Math.max(0, Math.min(100, Math.round(score)));

  let label, tier, title, summary;
  if (score < 30) {
    label = "Weak"; tier = "weak"; title = "Too easy to guess";
    summary = "Increase length and avoid familiar words, sequences, and repeated characters.";
  } else if (score < 55) {
    label = "Fair"; tier = "fair"; title = "Needs more protection";
    summary = "Add length and variety, and replace predictable patterns with unrelated words.";
  } else if (score < 78) {
    label = "Good"; tier = "good"; title = "Getting stronger";
    summary = "You are on the right track. Improve any remaining checklist items.";
  } else {
    label = "Strong"; tier = "strong"; title = "A stronger password";
    summary = "Good structure. Make sure it is unique to one account and stored safely.";
  }

  const tips = [];
  if (!length) tips.push("Use at least 12 characters; longer is generally better.");
  if (!(lower && upper)) tips.push("Mix uppercase and lowercase letters, or use a long passphrase.");
  if (!number) tips.push("Add numbers in a way that is not just a predictable ending.");
  if (!symbol) tips.push("Consider a symbol, but prioritize length and unpredictability.");
  if (!unique) tips.push("Avoid repeating the same character three or more times.");
  if (!pattern) tips.push("Remove common words, keyboard patterns, and number sequences.");
  if (commonPasswords.has(password.toLowerCase())) tips.unshift("This is a commonly used password. Replace it completely.");
  if (tips.length === 0) tips.push("Keep it unique for every account and store it in a password manager.");
  if (tips.length > 4) tips.length = 4;

  return { score, label, tier, title, summary, checks, tips };
}

function renderAnalysis() {
  const result = analyzePassword(passwordInput.value);
  scoreOutput.textContent = result.score;
  strengthLabel.textContent = result.label;
  strengthLabel.className = `strength-label ${result.tier}`;
  meterFill.style.width = `${result.score}%`;
  const colors = { neutral: "#65738a", weak: "#ff777f", fair: "#f7c96b", good: "#83d8ff", strong: "#63e6a5" };
  meterFill.style.background = colors[result.tier];
  strengthMeter.setAttribute("aria-valuenow", String(result.score));
  scoreTitle.textContent = result.title;
  scoreSummary.textContent = result.summary;

  const checkElements = [...document.querySelectorAll(".check-item")];
  let passed = 0;
  checkElements.forEach((element) => {
    const key = element.dataset.check;
    const ok = Boolean(result.checks[key]);
    element.classList.toggle("pass", ok);
    element.querySelector(".check-symbol").textContent = ok ? "✓" : "○";
    if (ok) passed++;
  });
  checksCount.textContent = `${passed} of 6 complete`;
  suggestions.replaceChildren();
  result.tips.forEach((tip) => {
    const li = document.createElement("li");
    li.textContent = tip;
    suggestions.appendChild(li);
  });
  document.getElementById("feedback-title").textContent =
    passwordInput.value ? "How to improve this password" : "Tips for a stronger password";
}
passwordInput.addEventListener("input", renderAnalysis);

toggleVisibility.addEventListener("click", () => {
  const show = passwordInput.type === "password";
  passwordInput.type = show ? "text" : "password";
  toggleVisibility.textContent = show ? "Hide" : "Show";
  toggleVisibility.setAttribute("aria-label", show ? "Hide password" : "Show password");
});

lengthRange.addEventListener("input", () => {
  lengthValue.textContent = lengthRange.value;
});

function secureRandomInt(max) {
  const values = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / max) * max;
  let value;
  do {
    crypto.getRandomValues(values);
    value = values[0];
  } while (value >= limit);
  return value % max;
}

function generatePassword(length) {
  const groups = ["ABCDEFGHJKLMNPQRSTUVWXYZ", "abcdefghijkmnopqrstuvwxyz", "23456789", "!@#$%^&*_-+="];
  const all = groups.join("");
  const chars = groups.map(group => group[secureRandomInt(group.length)]);
  while (chars.length < length) chars.push(all[secureRandomInt(all.length)]);
  // Fisher-Yates shuffle using cryptographic random values.
  for (let i = chars.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

document.getElementById("generate-password").addEventListener("click", () => {
  const generated = generatePassword(Number(lengthRange.value));
  generatedOutput.value = generated;
  generatorStatus.textContent = "Generated locally. Copy it and store it safely.";
  passwordInput.value = generated;
  passwordInput.type = "password";
  toggleVisibility.textContent = "Show";
  toggleVisibility.setAttribute("aria-label", "Show password");
  renderAnalysis();
});

document.getElementById("copy-password").addEventListener("click", async () => {
  if (!generatedOutput.value) {
    generatorStatus.textContent = "Generate a password first.";
    return;
  }
  try {
    await navigator.clipboard.writeText(generatedOutput.value);
    generatorStatus.textContent = "Copied to clipboard.";
  } catch (_error) {
    generatedOutput.focus();
    generatedOutput.select();
    const copied = document.execCommand("copy");
    generatorStatus.textContent = copied ? "Copied to clipboard." : "Copy failed. Select and copy manually.";
  }
});

renderAnalysis();