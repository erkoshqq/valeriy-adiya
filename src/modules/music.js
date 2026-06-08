export function initMusic() {
  const audio   = document.getElementById('bg-audio')
  const btn     = document.getElementById('music-btn')
  const icPlay  = document.getElementById('ic-play')
  const icPause = document.getElementById('ic-pause')
  if (!audio || !btn) return

  let playing = false, started = false

  function setPlaying(v) {
    playing = v
    icPlay.hidden  =  v
    icPause.hidden = !v
    btn.classList.toggle('playing', v)
  }

  btn.addEventListener('click', () => {
    if (!started) {
      audio.volume = 0.4
      audio.play().then(() => { started = true; setPlaying(true) }).catch(() => {})
    } else if (playing) {
      audio.pause(); setPlaying(false)
    } else {
      audio.play(); setPlaying(true)
    }
  })
}
