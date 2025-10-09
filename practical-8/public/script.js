async function fetchCount() {
  const res = await fetch('/api/count');
  const data = await res.json();
  document.getElementById('counter').textContent = data.count;
}

async function updateCount(action) {
  const res = await fetch('/api/count', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action })
  });
  const data = await res.json();
  document.getElementById('counter').textContent = data.count;
}

document.getElementById('inc').onclick = () => updateCount('inc');
document.getElementById('dec').onclick = () => updateCount('dec');
document.getElementById('reset').onclick = () => updateCount('reset');

fetchCount();
