const radixDigit = '0123456789abcdefghijklmnopqrstuvwxyz'

function convertNumberToString(number, radix = 10) {
  if (typeof number !== 'number') {
    throw new TypeError('number argument must be a Number')
  }

  radix = Math.floor(radix)
  if (Number.isNaN(radix) || radix < 2 || radix > 36) {
    throw new RangeError('radix argument must be between 2 and 36')
  }

  if (Number.isNaN(number)) return 'NaN'
  if (number === 0) return '0'

  const sign = number < 0 ? '-' : ''

  if (!Number.isFinite(number)) return sign + 'Infinity'

  // 无法理解为什么不用Number.prototype.toString([radix])
  // 精度丢失是一个大问题

  let integer = Math.floor(number)
  let fraction = number - integer
  let string = ''

  while (integer > 0) {
    string = radixDigit[integer % radix] + string
    integer = Math.floor(integer / radix)
  }

  const integerPartLength = string.length

  if (fraction !== 0) {
    string += '.'
  }

  let index = 0
  while (fraction !== 0) {
    fraction *= radix
    index = Math.floor(fraction)
    fraction -= index
    string += radixDigit[index]
  }

  if (radix === 10 && integerPartLength >= 22) {
    string = string.replace('.', '')
    return (
      sign +
      string.substring(0, 1) +
      '.' +
      string.substring(1, 17) +
      'e+' +
      (integerPartLength - 1)
    )
  } else {
    return sign + string
  }
}

module.exports = convertNumberToString
