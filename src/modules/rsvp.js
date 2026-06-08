import { getLang } from './lang.js'

const SHEET_URL = import.meta.env.VITE_SHEET_URL
const ATT = {
  kz: { coming: 'Келемін', pair: 'Жұппен', no: 'Келе алмаймын' },
  ru: { coming: 'Приду',   pair: 'С парой', no: 'Не смогу'      },
}

let selectedAtt = ''

async function fetchCount() {
  try {
    const res  = await fetch(`${SHEET_URL}?sheet=rsvp`)
    const data = await res.json()
    return data.filter(r => r.attendance && !r.attendance.match(/алмаймын|Не смогу/i)).length
  } catch { return null }
}

function animateCount(el, target) {
  const dur = 1200, start = performance.now()
  ;(function step(now) {
    const p = Math.min((now - start) / dur, 1)
    el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)))
    if (p < 1) requestAnimationFrame(step)
  })(start)
}

function initCounter() {
  const el = document.getElementById('rsvp-count')
  if (!el) return
  fetchCount().then(n => { if (n !== null) animateCount(el, n) })
}

export function initRsvp() {
  const form   = document.getElementById('rsvp-form')
  const okDiv  = document.getElementById('rsvp-ok')
  const subBtn = document.getElementById('sub-btn')
  if (!form) return

  document.querySelectorAll('.choice').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.choice').forEach(b => b.classList.remove('sel'))
      btn.classList.add('sel')
      selectedAtt = btn.dataset.val
      document.getElementById('fg-att').classList.remove('err')
    })
  })

  document.getElementById('f-name')?.addEventListener('input', () => {
    document.getElementById('fg-name').classList.remove('err')
  })

  form.addEventListener('submit', async e => {
    e.preventDefault()
    const name = document.getElementById('f-name').value.trim()
    const lang = getLang()
    let valid  = true
    document.getElementById('fg-name').classList.toggle('err', !name)
    document.getElementById('fg-att').classList.toggle('err', !selectedAtt)
    if (!name || !selectedAtt) valid = false
    if (!valid) return

    subBtn.disabled = true
    subBtn.querySelector('span').textContent = lang === 'kz' ? 'Жіберілуде…' : 'Отправляем…'

    try {
      await fetch(SHEET_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sheet: 'rsvp', name,
          attendance: ATT[lang][selectedAtt],
          timestamp:  new Date().toISOString(),
        }),
      })

      form.hidden = true; okDiv.hidden = false
      document.getElementById('ok-ttl').textContent = 'Рақмет!'
      document.getElementById('ok-msg').textContent = selectedAtt === 'no'
        ? (lang === 'kz' ? `${name}, жауабыңыз үшін рақмет 💌` : `${name}, спасибо за ответ 💌`)
        : (lang === 'kz' ? `${name}, 29 тамызда күтеміз! ✨` : `${name}, ждём вас 29 августа! ✨`)

      // Update counter
      const numEl = document.getElementById('rsvp-count')
      if (numEl && selectedAtt !== 'no') {
        const next = (parseInt(numEl.textContent) || 0) + 1
        animateCount(numEl, next)
        numEl.classList.add('bump')
        setTimeout(() => numEl.classList.remove('bump'), 400)
      }
    } catch {
      subBtn.disabled = false
      subBtn.querySelector('span').textContent = lang === 'kz' ? 'Қайта жіберу' : 'Попробовать снова'
    }
  })

  initCounter()
}
