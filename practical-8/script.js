// Gym Rep Counter - persists count in localStorage
const counterEl = document.getElementById("counter");
const incBtn = document.getElementById("increment");
const decBtn = document.getElementById("decrement");
const resetBtn = document.getElementById("reset");

const STORAGE_KEY = "gym-rep-counter";

function getCount() {
  return Number(localStorage.getItem(STORAGE_KEY)) || 0;
}

function setCount(val) {
  localStorage.setItem(STORAGE_KEY, val);
}

function updateDisplay(val) {
  counterEl.textContent = val;
}

let count = getCount();
updateDisplay(count);

incBtn.addEventListener("click", () => {
  count++;
  setCount(count);
  updateDisplay(count);
});

decBtn.addEventListener("click", () => {
  if (count > 0) {
    count--;
    setCount(count);
    updateDisplay(count);
  }
});

resetBtn.addEventListener("click", () => {
  count = 0;
  setCount(count);
  updateDisplay(count);
});

// Optional: Keyboard support for accessibility
window.addEventListener("keydown", (e) => {
  if (e.key === "+") incBtn.click();
  if (e.key === "-") decBtn.click();
  if (e.key === "0") resetBtn.click();
});
