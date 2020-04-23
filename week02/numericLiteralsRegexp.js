/**
 * 匹配 ECMAScript 2019 所规定的所有数字字面量的正则表达式
 *
 * http://ecma-international.org/ecma-262/10.0/#sec-literals-numeric-literals
 */

const DecimalDigit = '[0-9]'

const NonZeroDigit = '[1-9]'

const DecimalDigits = `${DecimalDigit}+`

const DecimalIntegerLiteral = `(0|${NonZeroDigit}(${DecimalDigits})?)`

const dot = '\\.'

const ExponentIndicator = '[eE]'

const SignedInteger = `[+-]?${DecimalDigits}`

const ExponentPart = `${ExponentIndicator}${SignedInteger}`

const DecimalLiteral = `(${DecimalIntegerLiteral}${dot}(${DecimalDigits})?(${ExponentPart})?|${dot}${DecimalDigits}(${ExponentPart})?|${DecimalIntegerLiteral}(${ExponentPart})?)`

const BinaryDigit = '[01]'

const BinaryDigits = `${BinaryDigit}+`

const BinaryIntegerLiteral = `0[bB]${BinaryDigits}`

const OctalDigit = '[0-7]'

const OctalDigits = `${OctalDigit}+`

const OctalIntegerLiteral = `0[oO]${OctalDigits}`

const HexDigit = '[0-9a-fA-F]'

const HexDigits = `${HexDigit}+`

const HexIntegerLiteral = `0[xX]${HexDigits}`

const NumericLiterals = `${DecimalLiteral}|${BinaryIntegerLiteral}|${OctalIntegerLiteral}|${HexIntegerLiteral}`

export default new RegExp(NumericLiterals)
