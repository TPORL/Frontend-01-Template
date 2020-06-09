const nonascii = '[^\\u0000-\\u00b1]'
const unicode = '\\\\[0-9a-f]{1,6}(\\r\\n|[ \\n\\r\\t\\f])?'
const escape = `${unicode}|\\\\[^\\n\\r\\f0-9a-f]`
const nmstart = `[_a-z]|${nonascii}|${escape}`
const nmchar = `[_a-z0-9-]|${nonascii}|${escape}`
const ident = `[-]?(${nmstart})(${nmchar})*`
// const name = `(${nmchar})+`
// const num = '[0-9]+|[0-9]*\\.[0-9]+'

const namespacePreFix = `(${ident}|\\*)?\\|`
const elementName = ident

const w = '[ \\t\\r\\n\\f]*'
const nl = '\\n|\\r\\n|\\r|\\f'

const string1 = `"([^\\n\\r\\f\\\\"]|\\\\${nl}|${nonascii}|${escape})*"`
const string2 = `'([^\\n\\r\\f\\\\']|\\\\${nl}|${nonascii}|${escape})*'`
const string = `${string1}|${string2}`

const typeSelector = `(${namespacePreFix})?${elementName}`
const attrib = `\\[${w}(${ident})${w}((=|~=|\\|=|^=|$=|\\*=)${w}(${ident}|${string})${w})?\\]`

export default {
  ident: /[-]?(?:[_a-z]|[^\u0000-\u00b1]|\\[0-9a-f]{1,6}(?:\r\n|[ \n\r\t\f])?|\\[^\n\r\f0-9a-f])(?:[_a-z0-9-]|[^\u0000-\u00b1]|\\[0-9a-f]{1,6}(?:\r\n|[ \n\r\t\f])?|\\[^\n\r\f0-9a-f])*/,
  type: /(?:(?:[-]?(?:[_a-z]|[^\u0000-\u00b1]|\\[0-9a-f]{1,6}(?:\r\n|[ \n\r\t\f])?|\\[^\n\r\f0-9a-f])(?:[_a-z0-9-]|[^\u0000-\u00b1]|\\[0-9a-f]{1,6}(?:\r\n|[ \n\r\t\f])?|\\[^\n\r\f0-9a-f])*|\*)?\|)?[-]?(?:[_a-z]|[^\u0000-\u00b1]|\\[0-9a-f]{1,6}(?:\r\n|[ \n\r\t\f])?|\\[^\n\r\f0-9a-f])(?:[_a-z0-9-]|[^\u0000-\u00b1]|\\[0-9a-f]{1,6}(?:\r\n|[ \n\r\t\f])?|\\[^\n\r\f0-9a-f])*/,
  attr: /\[[ \t\r\n\f]*([-]?(?:[_a-z]|[^\u0000-\u00b1]|\\[0-9a-f]{1,6}(?:\r\n|[ \n\r\t\f])?|\\[^\n\r\f0-9a-f])(?:[_a-z0-9-]|[^\u0000-\u00b1]|\\[0-9a-f]{1,6}(?:\r\n|[ \n\r\t\f])?|\\[^\n\r\f0-9a-f])*)[ \t\r\n\f]*(?:(=|~=|\|=|^=|$=|\*=)[ \t\r\n\f]*([-]?(?:[_a-z]|[^\u0000-\u00b1]|\\[0-9a-f]{1,6}(?:\r\n|[ \n\r\t\f])?|\\[^\n\r\f0-9a-f])(?:[_a-z0-9-]|[^\u0000-\u00b1]|\\[0-9a-f]{1,6}(?:\r\n|[ \n\r\t\f])?|\\[^\n\r\f0-9a-f])*|"(?:[^\n\r\f\\"]|\\\n|\r\n|\r|\f|[^\u0000-\u00b1]|\\[0-9a-f]{1,6}(?:\r\n|[ \n\r\t\f])?|\\[^\n\r\f0-9a-f])*"|'(?:[^\n\r\f\\']|\\\n|\r\n|\r|\f|[^\u0000-\u00b1]|\\[0-9a-f]{1,6}(?:\r\n|[ \n\r\t\f])?|\\[^\n\r\f0-9a-f])*')[ \t\r\n\f]*)?\]/,
  pseudo: /([-]?(?:[_a-z]|[^\u0000-\u00b1]|\\[0-9a-f]{1,6}(?:\r\n|[ \n\r\t\f])?|\\[^\n\r\f0-9a-f])(?:[_a-z0-9-]|[^\u0000-\u00b1]|\\[0-9a-f]{1,6}(?:\r\n|[ \n\r\t\f])?|\\[^\n\r\f0-9a-f])*)(?:\(([^\)]*)\))?/,
  anb: /^[ \\t\\r\\n\\f]*(?:([0-9]+)(?!n)|(?:([0-9]+)?(n)[ \\t\\r\\n\\f]*(?:([+-])[ \\t\\r\\n\\f]*([0-9]+))?))[ \\t\\r\\n\\f]*$/,
}
