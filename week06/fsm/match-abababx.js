/**
 * 小试牛刀
 *
 * abababx
 */

function match(string) {
  let state = foundA
  for (const char of string) {
    state = state(char)
  }
  return state === end
}

function foundA(char) {
  if (char === 'a') {
    return foundB
  } else {
    return foundA
  }
}

function foundB(char) {
  if (char === 'b') {
    return foundA2
  } else {
    return foundA(char)
  }
}

function foundA2(char) {
  if (char === 'a') {
    return foundB2
  } else {
    return foundA(char)
  }
}

function foundB2(char) {
  if (char === 'b') {
    return foundA3
  } else {
    return foundA(char)
  }
}

function foundA3(char) {
  if (char === 'a') {
    return foundB3
  } else {
    return foundA(char)
  }
}

function foundB3(char) {
  if (char === 'b') {
    return foundX
  } else {
    return foundA(char)
  }
}

function foundX(char) {
  if (char === 'x') {
    return end
  } else {
    return foundA3(char)
  }
}

function end() {
  return end
}

console.log(match('abababx'))
console.log(match('ababababxab'))
console.log(match('abababcababababxab'))
