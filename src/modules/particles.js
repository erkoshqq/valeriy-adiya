const COLORS = [
  'rgba(201,165,90,0.25)',
  'rgba(226,192,122,0.2)',
  'rgba(201,165,90,0.15)',
]

function makeParticle(w, h, randomY = false) {
  return {
    x: Math.random() * w,
    y: randomY ? Math.random() * h : h + 10,
    r: .8 + Math.random() * 2,
    vx: (Math.random() - .5) * .2,
    vy: -(.1 + Math.random() * .25),
    col: COLORS[Math.floor(Math.random() * COLORS.length)],
    o: .2 + Math.random() * .4,
  }
}

export function initParticles() {
  const canvas = document.getElementById('particles-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
  resize(); window.addEventListener('resize', resize)

  const particles = Array.from({ length: 28 }, () =>
    makeParticle(canvas.width, canvas.height, true)
  )

  ;(function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => {
      p.x += p.vx + Math.sin(p.y * .006) * .15
      p.y += p.vy
      if (p.y < -8) Object.assign(p, makeParticle(canvas.width, canvas.height, false))
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = p.col
      ctx.globalAlpha = p.o
      ctx.fill()
      ctx.globalAlpha = 1
    })
    requestAnimationFrame(draw)
  })()
}
