const PETALS = [
  // Лепесток — маленький эллипс
  { type: 'petal', color: 'rgba(184,150,90,0.22)', size: [4, 8] },
  { type: 'petal', color: 'rgba(200,170,130,0.18)', size: [3, 7] },
  { type: 'petal', color: 'rgba(184,150,90,0.15)', size: [5, 9] },
]

function makeParticle(w, h, randomY = false) {
  const preset = PETALS[Math.floor(Math.random() * PETALS.length)]
  return {
    x:      Math.random() * w,
    y:      randomY ? Math.random() * h : h + 10,
    rx:     preset.size[0] + Math.random() * 2,
    ry:     preset.size[1] + Math.random() * 3,
    angle:  Math.random() * Math.PI * 2,
    spin:   (Math.random() - .5) * .02,
    vx:     (Math.random() - .5) * .3,
    vy:     -(.08 + Math.random() * .2),
    color:  preset.color,
    o:      .3 + Math.random() * .5,
  }
}

export function initParticles() {
  const canvas = document.getElementById('particles-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight }
  resize(); window.addEventListener('resize', resize)

  const particles = Array.from({ length: 32 }, () =>
    makeParticle(canvas.width, canvas.height, true)
  )

  ;(function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    particles.forEach(p => {
      p.x     += p.vx + Math.sin(p.y * .005) * .2
      p.y     += p.vy
      p.angle += p.spin
      if (p.y < -12) Object.assign(p, makeParticle(canvas.width, canvas.height, false))

      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate(p.angle)
      ctx.beginPath()
      ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.globalAlpha = p.o
      ctx.fill()
      ctx.restore()
      ctx.globalAlpha = 1
    })
    requestAnimationFrame(draw)
  })()
}