const convertNumberToString = require('../convertNumberToString')

describe('convertNumberToString', () => {
  it('DecimalLiteral', () => {
    expect(convertNumberToString(NaN)).toBe('NaN')
    expect(convertNumberToString(0)).toBe('0')
    expect(convertNumberToString(+0)).toBe('0')
    expect(convertNumberToString(-0)).toBe('0')
    expect(convertNumberToString(Infinity)).toBe('Infinity')
    expect(convertNumberToString(+Infinity)).toBe('Infinity')
    expect(convertNumberToString(-Infinity)).toBe('-Infinity')

    // expect(convertNumberToString(123.)).toBe('123') // prettier-ignore
    // expect(convertNumberToString(123.456)).toBe('123.456')
    // expect(convertNumberToString(123.456e3)).toBe('123456')
    // expect(convertNumberToString(123.456e100)).toBe('1.23456e+102')
    // expect(convertNumberToString(.123)).toBe('0.123') // prettier-ignore
    // expect(convertNumberToString(.123e3)).toBe('123') // prettier-ignore
    // expect(convertNumberToString(.123e100)).toBe('1.23e+99') // prettier-ignore
    // expect(convertNumberToString(123)).toBe('123')
    // expect(convertNumberToString(123e3)).toBe('123000')
    // expect(convertNumberToString(123e100)).toBe('1.23e+102')
  })

  it('BinaryIntegerLiteral', () => {
    expect(convertNumberToString(0b1000000)).toBe('64')
    expect(convertNumberToString(0b1000000, 2)).toBe('1000000')
    expect(convertNumberToString(0b1000000, 8)).toBe('100')
    expect(convertNumberToString(0b1000000, 10)).toBe('64')
    expect(convertNumberToString(0b1000000, 16)).toBe('40')
    expect(convertNumberToString(0b1000000, 36)).toBe('1s')
  })

  it('OctalIntegerLiteral', () => {
    expect(convertNumberToString(0o100)).toBe('64')
    expect(convertNumberToString(0o100, 2)).toBe('1000000')
    expect(convertNumberToString(0o100, 8)).toBe('100')
    expect(convertNumberToString(0o100, 10)).toBe('64')
    expect(convertNumberToString(0o100, 16)).toBe('40')
    expect(convertNumberToString(0o100, 36)).toBe('1s')
  })

  it('HexIntegerLiteral', () => {
    expect(convertNumberToString(0x40)).toBe('64')
    expect(convertNumberToString(0x40, 2)).toBe('1000000')
    expect(convertNumberToString(0x40, 8)).toBe('100')
    expect(convertNumberToString(0x40, 10)).toBe('64')
    expect(convertNumberToString(0x40, 16)).toBe('40')
    expect(convertNumberToString(0x40, 36)).toBe('1s')
  })
})
