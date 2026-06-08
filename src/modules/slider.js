const AUTOPLAY_MS = 4500
const ANIM_MS     = 720

export function initSlider() {
  const track    = document.getElementById('slider-track')
  const dotsWrap = document.getElementById('slider-dots')
  const prevBtn  = document.getElementById('slider-prev')
  const nextBtn  = document.getElementById('slider-next')
  const bar      = document.getElementById('slider-progress-bar')
  if (!track) return

  const slides = Array.from(track.querySelectorAll('.slide'))
  const total  = slides.length
  if (total < 2) { prevBtn?.remove(); nextBtn?.remove(); dotsWrap?.remove(); return }

  let current = 0, autoTimer = null, isAnimating = false

  slides.forEach((_, i) => {
    const dot = document.createElement('button')
    dot.className = 'slider-dot' + (i === 0 ? ' active' : '')
    dot.setAttribute('aria-label', `Слайд ${i + 1}`)
    dot.addEventListener('click', () => goTo(i))
    dotsWrap.appendChild(dot)
  })

  function goTo(index, instant = false) {
    if (isAnimating && !instant) return
    isAnimating = true
    current = ((index % total) + total) % total
    track.style.transition = instant ? 'none' : `transform ${ANIM_MS}ms cubic-bezier(.77,0,.18,1)`
    track.style.transform  = `translateX(-${current * 100}%)`
    dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) => d.classList.toggle('active', i === current))
    setTimeout(() => { isAnimating = false }, instant ? 0 : ANIM_MS)
    startProgress()
  }

  function startProgress() {
    bar.style.transition = 'none'; bar.style.width = '0%'
    bar.getBoundingClientRect()
    bar.style.transition = `width ${AUTOPLAY_MS}ms linear`
    bar.style.width = '100%'
  }

  function startAutoplay() { stopAutoplay(); autoTimer = setInterval(() => goTo(current + 1), AUTOPLAY_MS); startProgress() }
  function stopAutoplay()  { clearInterval(autoTimer); bar.style.transition = 'none'; bar.style.width = '0%' }

  prevBtn?.addEventListener('click', () => { stopAutoplay(); goTo(current - 1); startAutoplay() })
  nextBtn?.addEventListener('click', () => { stopAutoplay(); goTo(current + 1); startAutoplay() })

  let touchStartX = 0
  track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX }, { passive: true })
  track.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - touchStartX
    if (Math.abs(dx) < 40) return
    stopAutoplay(); dx < 0 ? goTo(current + 1) : goTo(current - 1); startAutoplay()
  })

  const wrap = track.closest('.slider-wrap')
  wrap?.addEventListener('mouseenter', stopAutoplay)
  wrap?.addEventListener('mouseleave', startAutoplay)
  document.addEventListener('visibilitychange', () => document.hidden ? stopAutoplay() : startAutoplay())

  goTo(0, true); startAutoplay()
}
