export function initReveal() {
  const els = document.querySelectorAll('.reveal')
  if (!els.length) return
  const ro = new IntersectionObserver(
    entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target) } }),
    { threshold: .12 }
  )
  els.forEach(el => ro.observe(el))
}
