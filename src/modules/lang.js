let currentLang = 'kz'

export function getLang() { return currentLang }

export function setLang(lang) {
  currentLang = lang
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.dataset.lang === lang))

  document.querySelectorAll(`[data-${lang}]`).forEach(el => {
    const val = el.dataset[lang]
    if (!val) return
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') return
    el.innerHTML = val
  })

  document.querySelectorAll(`[data-${lang}-placeholder]`).forEach(el => {
    el.placeholder = el.dataset[`${lang}Placeholder`]
  })

  // После всех document.querySelectorAll — добавьте:
  const itextKz = document.getElementById('itext-kz')
  const itextRu = document.getElementById('itext-ru')
  if (itextKz) itextKz.hidden = (lang !== 'kz')
  if (itextRu) itextRu.hidden = (lang !== 'ru')

  const fp = document.getElementById('fp')
  if (fp) fp.textContent = fp.dataset[lang]
}

export function initLang(defaultLang = 'kz') {
  currentLang = defaultLang
  setLang(defaultLang)
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang))
  })
}
