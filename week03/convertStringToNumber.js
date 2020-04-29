/**
 * - Number() 不支持radix参数
 * - Number.parseInt() 不支持浮点数
 * - Number.parseFloat() 不支持radix参数
 *
 * convertNumberToString(string [, radix])
 *
 * - 支持StringNumericLiteral
 * - 支持radix
 */

const InfinityRegexp = /^[+-]?Infinity$/
const binaryIntegerLiteralRegexp = /^0[bB][01]+/
const octalIntegerLiteralRegexp = /^0[oO][0-7]+/
const hexIntegerLiteralRegexp = /^0[xX][0-9a-fA-F]+/
const signRegexp = /[+-]/
const exponentIndicatorRegexp = /[eE]/

function convertStringToNumber(string, radix) {
  const type = typeof string
  if (type === 'number') return string
  if (type !== 'string') {
    string = String(string).trim()
  }

  if (InfinityRegexp.test(string)) return Number(string)

  if (radix === undefined) {
    if (binaryIntegerLiteralRegexp.test(string)) {
      radix = 2
      string = string.slice(2)
    } else if (octalIntegerLiteralRegexp.test(string)) {
      radix = 8
      string = string.slice(2)
    } else if (hexIntegerLiteralRegexp.test(string)) {
      radix = 16
      string = string.slice(2)
    } else {
      radix = 10
    }
  } else {
    radix = Math.floor(radix)
    if (Number.isNaN(radix)) return NaN
    if (radix < 2 || radix > 36) return NaN
  }

  let sign = 1
  if (radix === 10 && signRegexp.test(string[0])) {
    sign = +(string[0] + 1)
    string = string.substring(1)
  }

  const [numericPart, exponentPart] = string.split(exponentIndicatorRegexp)
  const [integerPart, fractionPart] = numericPart.split('.')

  const integer = integerPart ? Number.parseInt(integerPart, radix) : 0
  const fraction =
    fractionPart && radix === 10
      ? Number.parseInt(fractionPart, 10) / 10 ** fractionPart.length
      : 0

  let exponent = 0
  if (exponentPart) {
    exponent = Number.parseInt(exponentPart, 10)
    if (Number.isNaN(exponent)) {
      exponent = 0
    }
  }

  return sign * (integer + fraction) * 10 ** exponent
}

module.exports = convertStringToNumber
