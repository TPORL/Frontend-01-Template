const ttys = require('ttys')

const stdin = ttys.stdin
const stdout = ttys.stdout

stdin.setRawMode(true)
stdin.resume()
stdin.setEncoding('utf8')

function getChar() {
  return new Promise((resolve) => {
    stdin.once('data', resolve)
  })
}

function up(n = 1) {
  stdout.write('\033[' + n + 'A')
}

function down(n = 1) {
  stdout.write('\033[' + n + 'B')
}

function left(n = 1) {
  stdout.write('\033[' + n + 'D')
}

function right(n = 1) {
  stdout.write('\033[' + n + 'C')
}

void (async () => {
  stdout.write('which framework do you want to use?\n')
  const framework = await select(['Angular', 'React', 'Vue'])
  stdout.write(`You selected ${framework}!\n`)
  process.exit()
})()

async function select(choices) {
  let selected = 0

  for (let i = 0; i < choices.length; i++) {
    const choice = choices[i]
    if (i === selected) {
      stdout.write('[\x1b[32mx\x1b[0m]' + choice + '\n')
    } else {
      stdout.write('[ ]' + choice + '\n')
    }
  }

  up(choices.length)
  right()

  while (true) {
    let char = await getChar()

    if (char === '\u0003') {
      process.exit()
    }

    if (char === 'w' && selected > 0) {
      stdout.write(' ')
      left()
      selected--
      up()
      stdout.write('\x1b[32mx\x1b[0m')
      left()
    }

    if (char === 's' && selected < choices.length - 1) {
      stdout.write(' ')
      left()
      selected++
      down()
      stdout.write('\x1b[32mx\x1b[0m')
      left()
    }

    if (char === '\r') {
      down(choices.length - selected)
      left()
      return choices[selected]
    }
  }
}
