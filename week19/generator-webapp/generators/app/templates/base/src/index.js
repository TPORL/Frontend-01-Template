export const add = (a, b) => a + b

new Promise((resolve) => {
  setTimeout(() => {
    resolve(add(1, 2))
  }, 1000)
}).then((result) => {
  console.log(result)
})
