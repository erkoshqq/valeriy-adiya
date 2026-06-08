import './styles/main.css'

import { initCursor    } from './modules/cursor.js'
import { initParticles } from './modules/particles.js'
import { initLoader, initLoaderBtn } from './modules/loader.js'
import { initCountdown } from './modules/countdown.js'
import { initLang      } from './modules/lang.js'
import { initMusic     } from './modules/music.js'
import { initReveal    } from './modules/reveal.js'
import { initSlider    } from './modules/slider.js'
import { initWishes    } from './modules/wishes.js'
import { initRsvp      } from './modules/rsvp.js'

document.addEventListener('DOMContentLoaded', () => {
  initCursor()
  initParticles()
  initLoader()
  initLoaderBtn()
  initCountdown()
  initLang('ru')
  initMusic()
  initReveal()
  initSlider()
  initWishes()
  initRsvp()
})
