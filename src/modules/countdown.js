const WEDDING = new Date('2026-08-29T16:00:00')

export function initCountdown() {
  const els = {
    d: document.getElementById('cd-d'),
    h: document.getElementById('cd-h'),
    m: document.getElementById('cd-m'),
    s: document.getElementById('cd-s'),
  }
  if (!els.d) return
  const pad = n => String(n).padStart(2, '0')
  function tick() {
    const diff = WEDDING - new Date()
    if (diff <= 0) { Object.values(els).forEach(e => e.textContent = '00'); return }
    els.d.textContent = pad(Math.floor(diff / 86400000))
    els.h.textContent = pad(Math.floor(diff % 86400000 / 3600000))
    els.m.textContent = pad(Math.floor(diff % 3600000  /   60000))
    els.s.textContent = pad(Math.floor(diff %   60000  /    1000))
  }
  tick(); setInterval(tick, 1000)
}
