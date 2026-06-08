import { getLang } from './lang.js'

const SHEET_URL = import.meta.env.VITE_SHEET_URL
const ICONS = ['✨', '🌟', '💫', '🤍', '◆', '❋']

let wishes  = []
let current = 0

function esc(s = '') {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}

function buildCard(w, i) {
  const card = document.createElement('div')
  card.className = 'wish-card'
  card.innerHTML = `
    <span class="wish-card-icon">${ICONS[i % ICONS.length]}</span>
    <p class="wish-card-text">${esc(w.text)}</p>
    <p class="wish-card-name">${esc(w.name)}</p>
  `
  return card
}

function renderSlider(track, dotsWrap) {
  track.innerHTML = ''; dotsWrap.innerHTML = ''
  if (!wishes.length) {
    const lang = getLang()
    track.innerHTML = `<div class="wish-card">
      <span class="wish-card-icon">✨</span>
      <p class="wish-card-text" style="opacity:.4;text-align:center">
        ${lang === 'kz' ? 'Бірінші болып тілек қалдырыңыз' : 'Оставьте первое пожелание'}
      </p>
    </div>`
    return
  }
  wishes.forEach((w, i) => {
    track.appendChild(buildCard(w, i))
    const dot = document.createElement('button')
    dot.className = 'wishes-dot' + (i === current ? ' active' : '')
    dot.addEventListener('click', () => goTo(i, track, dotsWrap))
    dotsWrap.appendChild(dot)
  })
  goTo(current, track, dotsWrap, true)
}

function goTo(index, track, dotsWrap, instant = false) {
  if (!wishes.length) return
  current = ((index % wishes.length) + wishes.length) % wishes.length
  track.style.transition = instant ? 'none' : 'transform .65s cubic-bezier(.77,0,.18,1)'
  track.style.transform  = `translateX(-${current * 100}%)`
  dotsWrap.querySelectorAll('.wishes-dot').forEach((d, i) => d.classList.toggle('active', i === current))
}

async function fetchWishes() {
  try {
    const res  = await fetch(`${SHEET_URL}?sheet=wishes`)
    const data = await res.json()
    wishes = data.filter(w => w.name && w.text).reverse()
  } catch { wishes = [] }
}

async function postWish(name, text) {
  await fetch(SHEET_URL, {
    method: 'POST', mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sheet: 'wishes', name, text }),
  })
}

export async function initWishes() {
  const track     = document.getElementById('wishes-track')
  const dotsWrap  = document.getElementById('wishes-dots')
  const prevBtn   = document.getElementById('wishes-prev')
  const nextBtn   = document.getElementById('wishes-next')
  const nameInput = document.getElementById('wish-name')
  const textInput = document.getElementById('wish-text')
  const submitBtn = document.getElementById('wish-submit')
  if (!track) return

  track.innerHTML = `<div class="wish-card">
    <span class="wish-card-icon">✨</span>
    <p class="wish-card-text wish-skeleton"></p>
    <p class="wish-card-name wish-skeleton" style="width:80px"></p>
  </div>`

  await fetchWishes()
  renderSlider(track, dotsWrap)

  prevBtn?.addEventListener('click', () => goTo(current - 1, track, dotsWrap))
  nextBtn?.addEventListener('click', () => goTo(current + 1, track, dotsWrap))

  let touchStartX = 0
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX }, { passive: true })
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX
    if (Math.abs(dx) < 40) return
    dx < 0 ? goTo(current + 1, track, dotsWrap) : goTo(current - 1, track, dotsWrap)
  })

  setInterval(() => goTo(current + 1, track, dotsWrap), 5000)

  submitBtn?.addEventListener('click', async () => {
    const name = nameInput.value.trim()
    const text = textInput.value.trim()
    const lang = getLang()
    if (!name || !text) {
      if (!name) nameInput.style.borderColor = '#c06060'
      if (!text) textInput.style.borderColor = '#c06060'
      return
    }
    nameInput.style.borderColor = ''; textInput.style.borderColor = ''
    const span = submitBtn.querySelector('span')
    const orig = span.textContent
    span.textContent = lang === 'kz' ? 'Жіберілуде…' : 'Отправляем…'
    submitBtn.disabled = true
    wishes.unshift({ name, text }); current = 0
    renderSlider(track, dotsWrap)
    postWish(name, text).catch(console.warn)
    nameInput.value = ''; textInput.value = ''
    span.textContent = lang === 'kz' ? '✓ Жіберілді!' : '✓ Отправлено!'
    setTimeout(() => { span.textContent = orig; submitBtn.disabled = false }, 2000)
  })

  nameInput?.addEventListener('input', () => { nameInput.style.borderColor = '' })
  textInput?.addEventListener('input', () => { textInput.style.borderColor = '' })
}
