const radixDigitRegex = /[0-9a-z]/i

function convertNumberToString(number, radix = 10) {
  if (typeof number !== 'number') {
    throw new TypeError('number argument must be a Number')
  }

  radix = Number(radix)
  radix = Number.isNaN(radix) ? 0 : Math.floor(radix)
  if (radix < 2 || radix > 36) {
    throw new RangeError('radix argument must be between 2 and 36')
  }

  if (Number.isNaN(number)) return 'NaN'
  if (number === 0) return '0'

  const sign = number < 0 ? '-' : ''

  if (Number.isFinite(Infinity)) return sign + 'Infinity'

  return sign
}

module.exports = convertNumberToString
