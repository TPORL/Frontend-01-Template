# Unicode

- [Unicode 官方文档](https://home.unicode.org/)

- [Unicode 非官方文档](https://www.fileformat.info/info/unicode/index.htm)

  - [Blocks](https://www.fileformat.info/info/unicode/block/index.htm)
  - [Categories](https://www.fileformat.info/info/unicode/category/index.htm)

## 知识点

- U+0000 ~ U+007F 属于 ASCII 码 (兼容)

  - 写代码最好只用 ASCII 中的字符

- U+0000 ~ U+FFFF 范围内的叫 BMP(Basic Multilingual Plane)

  - `String.fromCharCode`和`String.prototype.charCodeAt`只支持 BMP 字符
  - `String.fromCodePoint`和`String.prototype.codePointAt`支持非 BMP 字符 (ES6)

- Unicode Blocks - CJK - 中日韩

  - 尝试把中文字符写成 unicode 的形式(\u)

- Unicode Categories - Separator, Space - 空格系列
