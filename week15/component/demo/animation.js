const defaultOptions = {
  property: '',
  template: null,
  duration: 0,
  timingFunction: (t) => t,
  delay: 0,
}

export class Timeline {
  constructor() {
    this.animations = []
    this.requestID = null
    this.state = 'inited'
    this.startTime = 0
    this.pauseTime = 0
  }

  tick() {
    const time = Date.now() - this.startTime
    const animations = this.animations.filter(
      (animation) => !animation.finished
    )

    for (const animation of animations) {
      const {
        target,
        property,
        template,
        duration,
        timingFunction,
        delay,
        addTime,
      } = animation

      let progression = timingFunction(
        Math.max(time - delay - addTime, 0) / duration
      )
      if (time > duration + delay + addTime) {
        progression = 1
        animation.finished = true
      }

      target.style[property] = template(progression)
    }

    if (animations.length) {
      this.requestID = requestAnimationFrame(() => this.tick())
    }
  }

  add(animation, addTime) {
    animation.finished = false
    if (this.state === 'playing') {
      animation.addTime = addTime == undefined ? Date.now() : addTime
    } else {
      animation.addTime = addTime == undefined ? 0 : addTime
    }
    this.animations.push(animation)
  }

  play() {
    if (this.state !== 'inited') return
    this.state = 'playing'
    this.startTime = Date.now()
    this.tick()
  }

  pause() {
    if (this.state !== 'playing') return
    this.state = 'paused'
    this.pauseTime = Date.now()
    if (this.requestID !== null) {
      cancelAnimationFrame(this.requestID)
    }
  }

  resume() {
    if (this.state !== 'paused') return
    this.state = 'playing'
    this.startTime += Date.now() - this.pauseTime
    this.tick()
  }

  restart() {
    if (this.state === 'playing') {
      this.pause()
    }

    this.animations.forEach((animation) => {
      animation.finished = false
    })
    this.requestID = null
    this.state = 'playing'
    this.startTime = Date.now()
    this.pauseTime = 0
    this.tick()
  }
}

export class Animation {
  constructor(element, options) {
    if (typeof element === 'string') {
      this.target = document.querySelector(element)
    } else if (element instanceof HTMLElement) {
      this.target = element
    } else {
      throw new TypeError('')
    }

    Object.assign(this, defaultOptions, options)
  }
}
