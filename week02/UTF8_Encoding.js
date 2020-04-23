/**
 * 把字符串编码为 UTF-8 编码
 *
 * https://encoding.spec.whatwg.org/#utf-8-encoder
 */

function UTF8_encoder(codePoint) {
  if (codePoint <= 0x007f) {
    return codePoint
  }

  let count = 0
  let offset

  if (codePoint <= 0x07ff) {
    count = 1
    offset = 0xc0
  } else if (codePoint <= 0xffff) {
    count = 2
    offset = 0xe0
  } else if (codePoint <= 0x10ffff) {
    count = 3
    offset = 0xf0
  }

  const bytes = [(codePoint >> (6 * count)) + offset]

  while (count > 0) {
    const temp = codePoint >> (6 * (count - 1))
    bytes.push(0x80 | (temp & 0x3f))
    count--
  }

  return bytes
}

function UTF8_Encoding2(string) {
  return Object.values(string)
    .map((char) => {
      return UTF8_encoder(char.codePointAt(0))
        .map((byte) => `\\x${byte.toString(16).toUpperCase()}`)
        .join('')
    })
    .join('')
}
