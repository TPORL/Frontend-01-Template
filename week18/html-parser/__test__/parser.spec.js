import parser from '../src/parser.js'

describe('parser', () => {
  test('parse a single element', () => {
    const doc = parser('<div></div>')
    const div = doc.children[0]

    expect(doc.type).toBe('document')
    expect(div.type).toBe('element')
    expect(div.tagName).toBe('div')
    expect(div.children.length).toBe(0)
  })

  test('parse a single element with text content', () => {
    const doc = parser('<div>Hello World</div>')
    const text = doc.children[0].children[0]

    expect(text.type).toBe('text')
    expect(text.content).toBe('Hello World')
  })

  test('parse a single element with attributes', () => {
    const doc = parser('<div id="a" class=\'b\'  other = c disabled=></div>')
    const div = doc.children[0]

    expect(div.attributes).toEqual([
      { name: 'id', value: 'a' },
      { name: 'class', value: 'b' },
      { name: 'other', value: 'c' },
      { name: 'disabled', value: '' },
    ])

    const div2 = parser('<input checked readonly></input>').children[0]
    expect(div2.attributes).toEqual([
      { name: 'checked', value: '' },
      { name: 'readonly', value: '' },
    ])
  })

  test("tag start end doesn't match", () => {
    try {
      parser('<div></vid>')
    } catch (error) {
      expect(error.message).toBe("tag start end doesn't match!")
    }
  })

  test('parse a self closing element', () => {
    const doc = parser('<img/><img />')
    const img1 = doc.children[0]
    const img2 = doc.children[1]

    expect(img1.type).toBe('element')
    expect(img1.tagName).toBe('img')
    expect(img2.type).toBe('element')
    expect(img2.tagName).toBe('img')
  })

  test('parse script element', () => {
    const doc = parser(`
      <script>console.log("Hello World")</script>
      <script><</script>
      <script></</script>
      <script></s</script>
      <script></sc</script>
      <script></scr</script>
      <script></scri</script>
      <script></scrip</script>
      <script></script</script>
    `)

    doc.children
      .filter((child) => child.type === 'element')
      .forEach((child, index) => {
        expect(child.type).toBe('element')
        expect(child.tagName).toBe('script')

        const text = child.children[0]
        expect(text.type).toBe('text')
        switch (index) {
          case 0:
            expect(text.content).toBe('console.log("Hello World")')
            break
          case 1:
            expect(text.content).toBe('<')
            break
          case 2:
            expect(text.content).toBe('</')
            break
          case 3:
            expect(text.content).toBe('</s')
            break
          case 4:
            expect(text.content).toBe('</sc')
            break
          case 5:
            expect(text.content).toBe('</scr')
            break
          case 6:
            expect(text.content).toBe('</scri')
            break
          case 7:
            expect(text.content).toBe('</scrip')
            break
          case 8:
            expect(text.content).toBe('</script')
            break
        }
      })
  })

  test('not English char tag', () => {
    const doc = parser('<啊 /><a啊 />')

    expect(doc.children[0].type).toBe('text')
    expect(doc.children[0].content).toBe('<啊 />')
    expect(doc.children[1].type).toBe('element')
    expect(doc.children[1].children.length).toBe(0)
  })
})
