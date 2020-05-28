const fs = require('fs')
const { polyfill } = require('spritejs/lib/platform/node-canvas')
const { Scene, Sprite, ENV } = require('spritejs')

polyfill({ ENV })

const scene = new Scene({ width: 800, height: 600 })

const layer = scene.layer()

const box = new Sprite({
  anchor: [0.5, 0.5],
  size: [150, 150],
  pos: [300, 180],
  bgcolor: 'white',
  borderWidth: 1,
  borderRadius: 20,
})

layer.append(box)

const canvas = scene.snapshot()

fs.writeFile('viewport.jpg', canvas.toBuffer('image/jpeg'), (err) => {
  if (err) {
    console.log(err)
  }
})
