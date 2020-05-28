# Toy Browser

## Bugs

- [spritejs issues 152](https://github.com/spritejs/spritejs/issues/152) window 系统需要修改 node_modules\spritejs\lib\platform\node-canvas.js `var _nodeCanvasWebgl = require("node-canvas-webgl");` 改为 `var _nodeCanvasWebgl = require("canvas");`
