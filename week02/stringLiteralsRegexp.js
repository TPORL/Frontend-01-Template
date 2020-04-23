/**
 * 匹配 ECMAScript 2019 所规定的所有字符串字面量的正则表达式
 *
 * http://ecma-international.org/ecma-262/10.0/#sec-literals-string-literals
 */

const DecimalDigit = '[0-9]'

const SingleEscapeCharacter = `['"\\\\bfnrtv]`

const EscapeCharacter = `(${SingleEscapeCharacter}|${DecimalDigit}|x|u)`

const LineTerminator = '[\\n\\r\\u2028\\u2029]'

// SourceCharacter but not one of EscapeCharacter or LineTerminator
const NonEscapeCharacter = `[^['"\\\\bfnrtv0-9xu\\n\\r\\u2028\\u2029]`

const CharacterEscapeSequence = `(${SingleEscapeCharacter}|${NonEscapeCharacter})`

const HexDigit = '[0-9a-fA-F]'

const HexEscapeSequence = `x${HexDigit}{2}`

const Hex4Digits = `${HexDigit}{4}`

const CodePoint = `(${HexDigit}{1,5}|0${HexDigit}{5}|10${HexDigit}{4})`

const UnicodeEscapeSequence = `(u${Hex4Digits}|u\\{${CodePoint}\\})`

const EscapeSequence = `(${CharacterEscapeSequence}|0(?!${DecimalDigit})|${HexEscapeSequence}|${UnicodeEscapeSequence})`

const LineTerminatorSequence = '(\\n|\\r(?!\\n)|\\u2028|\\u2029|\\r\\n)'

const LineContinuation = `\\\\${LineTerminatorSequence}`

const DoubleStringCharacter = `([^"\\\\\\n\\r\\u2028\\u2029]|\\u2028|\\u2029|\\\\${EscapeSequence}|${LineContinuation})`

const DoubleStringCharacters = `(${DoubleStringCharacter})+`

const SingleStringCharacter = `([^'\\\\\\n\\r\\u2028\\u2029]|\\u2028|\\u2029|\\\\${EscapeSequence}|${LineContinuation})`

const SingleStringCharacters = `${SingleStringCharacter}+`

const StringLiteral = `"(${DoubleStringCharacters})?"|'(${SingleStringCharacters})?'`

export default new RegExp(StringLiteral, 'u')
