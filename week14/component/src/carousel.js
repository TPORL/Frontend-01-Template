class Carousel {
  constructor() {
    this.$root = document.createElement('div')
    this.$root.classList.add('carousel')
    this.images = []
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
    $wrapper.style.transform = `translateX(-${imgAmount * 100}%)`
    this.$root.appendChild($wrapper)

    let position = imgAmount
    let isPointerDown = false
    let timeoutId

    const loop = () => {
      timeoutId = setTimeout(loop, this.delay)

      if (isPointerDown) return

      if (position >= imgAmount * 2 + 1) {
        $wrapper.style.transition = ''
        $wrapper.style.transform = `translateX(-${
          (position - imgAmount - 1) * 100
        }%)`
        position = position - imgAmount
      }

      // 这里不能使用嵌套requestAnimationFrame
      // 页面处于隐藏状态时,requestAnimationFrame会累积起来
      setTimeout(() => {
        $wrapper.style.transition = 'transform 1s ease'
        $wrapper.style.transform = `translateX(-${position * 100}%)`
        position = position + 1
      }, 16)
    }
    loop()
    window.loop = loop

    this.$root.addEventListener('pointerdown', (evt) => {
      evt.preventDefault()
      isPointerDown = true
      clearTimeout(timeoutId)

      const startX = evt.clientX
      let deltaX = 0

      // const offsetX = window.scrollX + this.$root.getBoundingClientRect().left
      // const translateX = $wrapper.getBoundingClientRect().left - offsetX
      const translateX = Number(
        getComputedStyle($wrapper).transform.split(',')[4]
      )

      const move = (evt) => {
        deltaX = evt.clientX - startX
        $wrapper.style.transition = ''
        $wrapper.style.transform = `translateX(${translateX + deltaX}px)`
      }

      const end = (evt) => {
        const width = $wrapper.getBoundingClientRect().width
        const lastX = translateX + deltaX
        if (lastX > 0) {
          position = 0
        } else {
          const precent = (deltaX > 0 ? -1 : 1) * 0.4
          position = Math.round(Math.abs(lastX) / width + precent)
          if (position >= elmAmount) {
            position = elmAmount - 1
          }
        }

        $wrapper.style.transition = 'transform 1s ease'
        $wrapper.style.transform = `translateX(-${position++ * 100}%)`

        isPointerDown = false
        timeoutId = setTimeout(loop, this.delay)

        document.removeEventListener('pointermove', move)
        document.removeEventListener('pointerup', end)
      }

      document.addEventListener('pointermove', move)
      document.addEventListener('pointerup', end)
    })
  }

  mountTo(element) {
    this.render()
    element.appendChild(this.$root)
  }
}

export default Carousel
