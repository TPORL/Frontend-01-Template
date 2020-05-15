/**
 * KMP 等效的状态机
 */

function createState(pChar, index) {
  return function state(sChar, states, table) {
    if (sChar === pChar) {
      return states[index + 1]
    } else {
      const nextState = states[table[index - 1] || 0]
      return index ? nextState(sChar) : nextState
    }
  }
}

function end() {
  return end
}

function match(pattern, string) {
  if (typeof pattern !== 'string' || typeof string !== 'string') return false
  if (pattern === string) return true
  if (!pattern || !string) return false

  const states = [createState(pattern[0], 0)]
  const table = [0]
  let i = 1
  let j = 0

  while (i < string.length) {
    if (string[i] === string[j]) {
      states.push(createState(pattern[i], i))
      table[i] = j + 1
      i++
      j++
    } else {
      if (j === 0) {
        states.push(createState(pattern[i], i))
        table[i] = 0
        i++
      } else {
        j = table[j - 1]
      }
    }
  }

  states.push(end)

  let state = states[0]

  for (let i = 0; i < string.length; i++) {
    state = state(pattern[i], states, table)
  }

  return state === end
}

console.log(match('abababx', 'abababx'))
console.log(match('abababx', 'ababababxab'))
console.log(match('abababx', 'abababcababababxab'))
console.log(match('ABCDABD', 'ABC ABCDAB ABCDABCDABDE'))
