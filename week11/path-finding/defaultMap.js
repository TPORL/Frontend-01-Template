const defaultMap = Array(10000).fill(0)

for (let y = 5; y < 35; y++) {
  const x = 10
  const index = x + y * 100
  defaultMap[index] = 1
}

for (let x = 10; x < 35; x++) {
  const y = 34
  const index = x + y * 100
  defaultMap[index] = 1
}

for (let y = 10; y < 45; y++) {
  const x = 44
  const index = x + y * 100
  defaultMap[index] = 1
}

for (let x = 20; x < 45; x++) {
  const y = 10
  const index = x + y * 100
  defaultMap[index] = 1
}

for (let y = 55; y < 85; y++) {
  const x = 90
  const index = x + y * 100
  defaultMap[index] = 1
}

for (let x = 90; x >= 60; x--) {
  const y = 85
  const index = x + y * 100
  defaultMap[index] = 1
}

for (let y = 60; y < 90; y++) {
  const x = 55
  const index = x + y * 100
  defaultMap[index] = 1
}

for (let x = 55; x < 85; x++) {
  const y = 60
  const index = x + y * 100
  defaultMap[index] = 1
}

for (let x = 10, y = 89; x <= 89; x++, y--) {
  const index = x + y * 100
  defaultMap[index] = 1
}
