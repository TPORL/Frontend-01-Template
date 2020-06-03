function calc(tokens, sp = [0, 0, 0]) {
  for (const token of tokens) {
    const type = token.type
    if (type === 'id') {
      sp[0] += 1
    } else if (type === 'class' || type === 'attribute') {
      sp[1] += 1
    } else if (type === 'pseudo-class') {
      const name = token.name
      if (name === 'is' || name === 'not' || name === 'has') {
        sp = calc(token.args, sp)
      } else if (name === 'nth-child' || name === 'nth-last-child') {
        // no support [of S]
        sp[1] += 1
      } else if (name === 'where') {
        // 0
      } else {
        sp[1] += 1
      }
    } else if (type === 'type' || type === 'pseudo-element') {
      sp[2] += 1
    }
  }
  return sp
}

function compare(sp1, sp2) {
  for (let i = 0; i < 3; i++) {
    const delta = sp1[i] - sp2[i]
    if (delta) return delta
  }
  return 0
}

export default {
  calc,
  compare,
}
