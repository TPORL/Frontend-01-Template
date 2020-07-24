class Carousel {
  constructor() {
    this.$root = document.createElement('div')
    this.$root.classList.add('carousel')
    this.images = []
    this.animation = null
    this.duration = 1000
    this.easing = 'ease'
    this.delay = 1000
  }

  setAttribute(name, value) {
    this[name] = value
  }

  render() {
    const $wrapper = document.createElement('div')
    $wrapper.classList.add('carousel-wrapper')

    const imgAmount = this.images.length
    const elmAmount = imgAmount * 3
    for (let i = 0; i < elmAmount; i++) {
      const $slide = document.createElement('div')
      $slide.classList.add('carousel-slide')
      const $img = document.createElement('img')
      $img.src = this.images[i % imgAmount]
      $slide.appendChild($img)
      $wrapper.appendChild($slide)
    }
    this.$root.appendChild($wrapper)

    let position = imgAmount

    this.loop = (currentTime = 0) => {
      if (position >= imgAmount * 2) {
        position = position - imgAmount
      }

      this.animation = $wrapper.animate(
        [
          { transform: `translateX(-${position * 100}%)` },
          { transform: `translateX(-${++position * 100}%)` },
        ],
        {
          duration: this.duration,
          easing: this.easing,
          delay: this.delay,
          fill: 'forwards',
        }
      )
      this.animation.currentTime = currentTime
      this.animation.onfinish = () => this.loop()
    }

    if (this.autoplay) {
      this.loop()
    }
  }

  mountTo(element) {
    this.render()
    element.appendChild(this.$root)
  }

  play() {
    if (this.animation) {
      this.animation.play()
    } else {
      this.loop()
    }
  }

  pause() {
    if (this.animation) {
      this.animation.pause()
    }
  }
}

export default Carousel
