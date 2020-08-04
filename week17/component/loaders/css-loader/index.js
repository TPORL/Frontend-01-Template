const css = require('css')

module.exports = function cssLoader(source, map) {
  const ast = css.parse(source)
  const name = this.resourcePath.match(/([^/\\]+).css$/)[1]
  for (const rule of ast.stylesheet.rules) {
    rule.selectors = rule.selectors.map((selector) => {
      return selector.match(new RegExp(`^.${name}`))
        ? selector
        : `.${name} ${selector}`
    })
  }
  return `
    const style = document.createElement('style')
    style.innerHTML = ${JSON.stringify(css.stringify(ast))}
    document.head.appendChild(style)
  `
}
