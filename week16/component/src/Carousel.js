import { createElement, createRef } from './createElement.js'

export default class Carousel {
  constructor() {
    this.children = []
    this.attributes = {
      duration: 1000,
      easing: 'ease',
      delay: 3000,
    }
    this.properties = {}

    this.rootRef = createRef()
    this.wrapperRef = createRef()
    this.animation = null
    this.position = 0
  }

  setAttribute(name, value) {
    this.attributes[name] = value
  }

  appendChild(child) {
    this.children.push(child)
  }

  render() {
    let items = this.attributes.items
    items = items.concat(items, items)

    let baseX = 0

    const handlePanStart = () => {
      if (!this.animation) return

      this.animation.pause()

      baseX = Number(
        getComputedStyle(this.wrapperRef.current).transform.split(',')[4]
      )

      this.wrapperRef.current.animate(
        { transform: `translateX(${baseX}px)` },
        { fill: 'forwards' }
      )

      this.animation.cancel()
    }

    const handlePanMove = (event) => {
      if (!this.animation) return

      this.wrapperRef.current.animate(
        { transform: `translateX(${baseX + event.detail.deltaX}px)` },
        { fill: 'forwards' }
      )
    }

    const handlePanEnd = (event) => {
      if (!this.animation) return

      const width = this.wrapperRef.current.getBoundingClientRect().width
      const deltaX = event.detail.deltaX
      const startX = baseX + deltaX

      let position
      if (startX > 0) {
        position = 0
      } else {
        const precent = (deltaX > 0 ? -1 : 1) * 0.4
        position = Math.round(Math.abs(startX) / width + precent)
        if (position >= items.length) {
          position = items.length - 1
        }
      }

      const endX = -position * width

      this.animation = this.wrapperRef.current.animate(
        [
          { transform: `translateX(${startX}px)` },
          { transform: `translateX(${endX}px)` },
        ],
        {
          duration:
            (Math.abs(endX - startX) / width) * this.attributes.duration,
          easing: this.attributes.easing,
          fill: 'forwards',
        }
      )
      this.animation.onfinish = () => {
        this.position = position
        this.attributes.autoplay && this.loop()
      }
    }

    return (
      <div
        class="carousel"
        ref={this.rootRef}
        enableGesture={true}
        onpanstart={handlePanStart}
        onpanmove={handlePanMove}
        onpanend={handlePanEnd}
      >
        <div class="carousel-wrapper" ref={this.wrapperRef}>
          {items.map((item) => (
            <div class="carousel-slide">
              <img src={item} ondragstart={(event) => event.preventDefault()} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  mountTo(element) {
    this.render().mountTo(element)

    const itemCount = this.attributes.items.length
    this.position = length

    this.loop = () => {
      if (this.position >= itemCount * 2) {
        this.position = this.position - itemCount
      }

      this.animation = this.wrapperRef.current.animate(
        [
          { transform: `translateX(${this.position * -100}%)` },
          { transform: `translateX(${(this.position + 1) * -100}%)` },
        ],
        {
          duration: this.attributes.duration,
          easing: this.attributes.easing,
          delay: this.attributes.delay,
          fill: 'forwards',
        }
      )

      this.animation.onfinish = () => {
        this.position++
        this.loop()
      }
    }

    if (this.attributes.autoplay) {
      this.loop()
    }
  }
}
