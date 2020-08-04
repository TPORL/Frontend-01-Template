function calcDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

function calcDirection(x1, y1, x2, y2) {
  // prettier-ignore
  return Math.abs(x1 - x2) > Math.abs(y1 - y2)
    ? x1 > x2 ? 'left' : 'right'
    : y1 > y2 ? 'up' : 'down'
}

export default function Gesture(target) {
  if (typeof target === 'string') {
    target = document.querySelector(target)
  }

  let pointers = []

  let tapCount = 0

  let preventTap = false
  let triggeredPress = false

  let tapTimeoutId = null
  let pressTimeoutId = null

  target.style && (target.style.touchAction = 'none')
  target.addEventListener('pointerdown', start)
  target.addEventListener('pointermove', move)
  target.addEventListener('pointerup', end)
  target.addEventListener('pointercancel', cancel)

  function start(event) {
    const pointer = Object.create(null)
    pointer.id = event.pointerId
    pointer.startTime = Date.now()
    pointer.startX = event.clientX
    pointer.startY = event.clientY
    pointer.clientX = event.clientX
    pointer.clientY = event.clientY
    pointer.deltaX = 0
    pointer.deltaY = 0
    pointer.endX = null
    pointer.endY = null
    pointers.push(pointer)

    preventTap = false
    triggeredPress = false

    pressTimeoutId = setTimeout(() => {
      dispatch('press')
      triggeredPress = true
      preventTap = true
    }, 500)

    dispatch('pan', Object.assign({}, pointer))
    dispatch('panstart', Object.assign({}, pointer))
  }

  function move(event) {
    const pointer = pointers[0]
    if (!pointer) return
    pointer.clientX = event.clientX
    pointer.clientY = event.clientY
    pointer.deltaX = pointer.clientX - pointer.startX
    pointer.deltaY = pointer.clientY - pointer.startY

    if (Math.abs(pointer.deltaX) >= 10 || Math.abs(pointer.deltaY) >= 10) {
      preventTap = true
      clearTimeout(pressTimeoutId)
    }

    dispatch('pan', Object.assign({}, pointer))
    dispatch('panmove', Object.assign({}, pointer))
  }

  function end(event) {
    const pointer = pointers[0]
    if (!pointer) return
    pointer.endTime = Date.now()
    pointer.clientX = event.clientX
    pointer.clientY = event.clientY
    pointer.deltaX = pointer.clientX - pointer.startX
    pointer.deltaY = pointer.clientY - pointer.startY
    pointer.endX = event.clientX
    pointer.endY = event.clientY
    pointers = pointers.filter((pointer) => pointer.id !== event.pointerId)

    clearTimeout(pressTimeoutId)

    const deltaTime = pointer.endTime - pointer.startTime

    if (Math.abs(pointer.deltaX) < 10 && Math.abs(pointer.deltaY) < 10) {
      if (!preventTap && deltaTime <= 250) {
        dispatch('tap', { tapCount: ++tapCount })
        clearTimeout(tapTimeoutId)
        tapTimeoutId = setTimeout(() => (tapCount = 0), 300)
      }
      if (triggeredPress) {
        dispatch('pressup')
      }
    } else {
      const distance = calcDistance(
        pointer.startX,
        pointer.startY,
        pointer.endX,
        pointer.endY
      )
      if (distance / deltaTime >= 0.3) {
        const direction = calcDirection(
          pointer.startX,
          pointer.startY,
          pointer.endX,
          pointer.endY
        )
        dispatch('swipe', { direction })
      }
    }

    dispatch('pan', Object.assign({}, pointer))
    dispatch('panend', Object.assign({}, pointer))
  }

  function cancel(event) {
    const pointer = pointers[0]
    if (!pointer) return
    pointer.clientX = event.clientX
    pointer.clientY = event.clientY
    pointer.deltaX = pointer.clientX - pointer.startX
    pointer.deltaY = pointer.clientY - pointer.startY
    pointers = pointers.filter((pointer) => pointer.id !== event.pointerId)

    clearTimeout(pressTimeoutId)

    dispatch('pan', Object.assign({}, pointer))
    dispatch('pancancel', Object.assign({}, pointer))
  }

  function dispatch(type, detail) {
    target.dispatchEvent(new CustomEvent(type, { detail }))
  }

  return target
}
