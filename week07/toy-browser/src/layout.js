function getStyle(element) {
  if (!element.style) {
    element.style = {}
  }

  for (const prop in element.computedStyle) {
    const value = element.computedStyle[prop].value.toString()
    if (/px$/.test(value)) {
      element.style[prop] = parseInt(value)
    } else if (/^[0-9\.]+$/.test(value)) {
      element.style[prop] = parseInt(value)
    } else {
      element.style[prop] = value
    }
  }

  return element.style
}

module.exports = function layout(element) {
  if (!element.computedStyle) return

  const style = getStyle(element)

  if (style.display !== 'flex' && style.display !== 'inline-flex') return

  void ['width', 'height'].forEach((size) => {
    if (style[size] === 'auto' || style[size] === '') {
      style[size] = null
    }
  })

  style.flexDirection = style.flexDirection || 'row'
  style.flexWrap = style.flexWrap || 'nowrap'
  style.justifyContent = style.justifyContent || 'flex-start'
  style.alignItems = style.alignItems || 'stretch'
  style.alignContent = style.alignContent || 'stretch'

  let mainSize
  let mainStart
  let mainEnd
  let mainSign
  let mainBase
  let crossSize
  let crossStart
  let crossEnd
  let crossSign
  let crossBase

  switch (style.flexDirection) {
    case 'row':
      mainSize = 'width'
      mainStart = 'left'
      mainEnd = 'right'
      mainSign = +1
      mainBase = 0
      crossSize = 'height'
      crossStart = 'top'
      crossEnd = 'bottom'
      break
    case 'row-reverse':
      mainSize = 'width'
      mainStart = 'right'
      mainEnd = 'left'
      mainSign = -1
      mainBase = style[mainSize]
      crossSize = 'height'
      crossStart = 'top'
      crossEnd = 'bottom'
      break
    case 'column':
      mainSize = 'height'
      mainStart = 'top'
      mainEnd = 'bottom'
      mainSign = +1
      mainBase = 0
      crossSize = 'width'
      crossStart = 'left'
      crossEnd = 'right'
      break
    case 'column-reverse':
      mainSize = 'height'
      mainStart = 'bottom'
      mainEnd = 'left'
      mainSign = -1
      mainBase = style[mainSize]
      crossSize = 'width'
      crossStart = 'left'
      crossEnd = 'right'
      break
  }

  if (style.flexWrap === 'wrap-reverse') {
    ;[crossStart, crossEnd] = [crossEnd, crossStart]
    crossBase = style[crossSize]
    crossSign = -1
  } else {
    crossSign = +1
    crossBase = 0
  }

  const items = element.children.filter((child) => child.type === 'element')

  items.sort((a, b) => {
    const orderA = a.style.order ? a.style.order.value || 0 : 0 // a.style?.order?.value ?? 0
    const orderB = b.style.order ? b.style.order.value || 0 : 0 // b.style?.order?.value ?? 0
    return orderA - orderB
  })

  let isAutomaticSize = false
  if (!style[mainSize]) {
    style[mainSize] = 0
    items.forEach((item) => {
      const itemStyle = getStyle(item)
      if (itemStyle[mainSize] == null) {
        style[mainSize] += itemStyle[mainSize]
      }
    })
    isAutomaticSize = true
  }

  const flexLine = []
  const flexLines = [flexLine]

  let mainSpace = style[mainSize]
  let crossSpace = 0

  items.forEach((item) => {
    const itemStyle = getStyle(item)

    if (itemStyle[mainSize] == null) {
      itemStyle[mainSize] = 0
    }

    if (itemStyle.flex) {
      flexLine.push(item)
    } else if (style.flexWrap === 'nowrap' && isAutomaticSize) {
      mainSpace -= itemStyle[mainSize]
      if (itemStyle[crossSize] != null) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
      flexLine.push(item)
    } else {
      if (itemStyle[mainSize] > style[mainSize]) {
        itemStyle[mainSize] = style[mainSize]
      }

      if (mainSpace < itemStyle[mainSize]) {
        flexLine.mainSpace = mainSpace
        flexLine.crossSpace = crossSpace
        flexLine = [item]
        flexLines.push(flexLine)
        mainSpace = style[mainSize]
        crossSpace = 0
      } else {
        flexLine.push(item)
      }

      mainSpace -= itemStyle[mainSize]
      if (itemStyle[crossSize] != null) {
        crossSpace = Math.max(crossSpace, itemStyle[crossSize])
      }
    }
  })

  flexLine.mainSpace = mainSpace

  if (style.flexWrap === 'nowrap' || isAutomaticSize) {
    flexLine.crossSpace =
      style[crossSize] !== undefined ? style[crossSize] : crossSpace
  } else {
    flexLine.crossSpace = crossSpace
  }

  if (mainSpace < 0) {
    const scale = style[mainSize] / (style[mainSize] - mainSpace)
    let currentMain = mainBase
    items.forEach((item) => {
      const itemStyle = getStyle(item)
      if (itemStyle.flex) {
        itemStyle[mainSize] = 0
      }
      itemStyle[mainSize] = itemStyle[mainSize] * scale
      itemStyle[mainStart] = currentMain
      itemStyle[mainEnd] = itemStyle[mainStart] + mainSign * itemStyle[mainSize]
      currentMain = itemStyle[mainEnd]
    })
  } else {
    flexLines.forEach((flexLine) => {
      let mainSpace = flexLine.mainSpace
      let flexTotal = 0

      flexLine.forEach((item) => {
        const itemStyle = getStyle(item)

        if (itemStyle.flex != null) {
          flexTotal += itemStyle.flex
        }
      })

      if (flexTotal > 0) {
        let currentMain = mainBase
        flexLine.forEach((item) => {
          const itemStyle = getStyle(item)

          if (itemStyle.flex != null) {
            itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex
          }

          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] =
            itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd]
        })
      } else {
        let currentMain, step
        switch (style.justifyContent) {
          case 'flex-start':
            currentMain = mainBase
            step = 0
            break
          case 'flex-end':
            currentMain = mainSpace * mainSign + mainBase
            step = 0
            break
          case 'center':
            currentMain = (mainSpace / 2) * mainSign + mainBase
            step = 0
            break
          case 'space-between':
            currentMain = mainBase
            step = (mainSpace / (flexLine.length - 1)) * mainSign
            break
          case 'space-around':
            step = (mainSpace / flexLine.length) * mainSign
            currentMain = step / 2 + mainBase
            break
        }
        flexLine.forEach((item) => {
          const itemStyle = getStyle(item)
          itemStyle[mainStart] = currentMain
          itemStyle[mainEnd] =
            itemStyle[mainStart] + mainSign * itemStyle[mainSize]
          currentMain = itemStyle[mainEnd] + step
        })
      }
    })
  }

  if (!style[crossSize]) {
    crossSpace = 0
    style[crossSize] = 0
    flexLines.forEach((flexLine) => {
      style[crossSize] += flexLine.crossSpace
    })
  } else {
    crossSpace = style[crossSize]
    flexLines.forEach((flexLine) => {
      crossSpace -= flexLine.crossSpace
    })
  }

  if (style.flexWrap === 'wrap-reverse') {
    crossBase = style[crossSize]
  } else {
    crossBase = 0
  }

  let step
  switch (style.alignContent) {
    case 'flex-start':
      step = 0
      break
    case 'flex-end':
      crossBase += crossSign * crossSpace
      step = 0
      break
    case 'center':
      crossBase += (crossSign * crossSpace) / 2
      step = 0
      break
    case 'space-betwwen':
      step = crossSpace / (flexLines.length - 1)
      break
    case 'space-around':
      step = crossBase / flexLines.length
      crossBase += (crossSign * step) / 2
      break
    case 'stretch':
      step = 0
      break
  }

  flexLines.forEach((flexLine) => {
    const lineCrossSize =
      style.alignContent === 'stretch'
        ? flexLine.crossSpace + crossSpace / flexLines.length
        : flexLine.crossSpace

    flexLine.forEach((item) => {
      const itemStyle = getStyle(item)

      const align = itemStyle.alignSelf || style.alignItems

      if (itemStyle[crossSize] == null) {
        itemStyle[crossSize] = align === 'stretch' ? lineCrossSize : 0
      }

      switch (align) {
        case 'flex-start':
          itemStyle[crossStart] = crossBase
          itemStyle[crossEnd] =
            itemStyle[crossStart] + crossSign * itemStyle[crossSize]
          break
        case 'flex-end':
          itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize
          itemStyle[crossStart] =
            itemStyle[crossEnd] - crossSign * itemStyle[crossSize]
          break
        case 'center':
          itemStyle[crossStart] =
            crossBase + (crossSign * (lineCrossSize - itemStyle[crossSize])) / 2
          itemStyle[crossEnd] =
            itemStyle[crossStart] + crossSign * itemStyle[crossSize]
          break
        case 'stretch':
          itemStyle[crossStart] = crossBase
          itemStyle[crossEnd] =
            crossBase +
            crossSign *
              (itemStyle[crossSize] != null
                ? itemStyle[crossSize]
                : lineCrossSize)

          itemStyle[crossSize] =
            crossSign * (itemStyle[crossEnd] - itemStyle[crossStart])
          break
      }
    })

    crossBase += crossSign * (lineCrossSize + step)
  })

  console.log(items)
}
