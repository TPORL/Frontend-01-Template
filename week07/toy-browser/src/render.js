const { Sprite } = require('spritejs')

module.exports = function render(scene, { style, children }) {
  if (style) {
    const layer = scene.layer()

    const sprite = new Sprite({
      anchor: [0, 0],
      size: [style.width, style.height],
      pos: [style.left || 0, style.top || 0],
      bgcolor: style.backgroundColor || 'rgba(0,0,0,0)',
    })

    layer.append(sprite)
  }

  if (children) {
    for (const child of children) {
      render(scene, child)
    }
  }
}
