const superagent = require('superagent')
const cheerio = require('cheerio')
const fs = require('fs')
const process = require('process')

function printProgress(progress) {
  process.stdout.clearLine()
  process.stdout.cursorTo(0)
  process.stdout.write(progress)
}

async function fetchStandards() {
  const standards = []

  try {
    const res = await superagent.get('https://www.w3.org/TR/?tag=css')
    const $ = cheerio.load(res.text)
    const $a = $('#container li[data-tag~=css]:not([data-status~=ret]) h2 a')

    const length = $a.length
    let i = 0

    while (i++ < length) {
      const $item = $($a[i])
      const standard = {
        url: $item.attr('href'),
        name: $item.text(),
      }
      standard.properties = await fetchProperties(standard.url)
      standards.push(standard)

      printProgress(i + '/' + length)
    }
  } catch (err) {
    console.error(err)
  }

  return standards
}

async function fetchProperties(url) {
  try {
    const res = await superagent.get(url)
    const $ = cheerio.load(res.text)

    return $('.propdef [data-dfn-type=property]')
      .map(function () {
        return $(this).text()
      })
      .get()
  } catch (err) {
    console.error(err)
  }
  return []
}

void (async () => {
  const standards = await fetchStandards()
  const template = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <title>CSS Standards</title>
    <style>
      body {
        margin: 0;
        font: 16px/1.15 Arial,sans-serif;
        color: #333;
        -webkit-text-size-adjust: 100%;
      }

      table {
        border-collapse: collapse;
      }

      th,
      td {
        width: 50%;
        padding: 10px;
        border: 1px solid #bcbcbc;
        box-sizing: border-box;
      }

      th {
        font-weight: 400;
      }

      thead {
        background-color: #def;
      }

      tbody tr:nth-child(even) {
        background-color: #f6f6f6;
      }

      a {
        text-decoration: none;
        color: inherit;
      }

      a:hover {
        text-decoration: underline;
      }
    </style>
  </head>
  <body>
    <table>
      <thead>
        <tr>
          <th>Standard</th>
          <th>Properties</th>
        </tr>
      </thead>
      <tbody>
        ${standards
          .map(({ url, name, properties }) => {
            properties = properties.map((prop) => `<li>${prop}</li>`).join('')
            return `<tr><td><a href="${url}">${name}</a></td><td><ul>${properties}</ul></td></tr>`
          })
          .join('\n        ')}
      </tbody>
    </table>
  </body>
</html>
`.trim()

  fs.writeFile('css-standards.html', template, (err) => {
    if (err) {
      console.error(err)
    }
  })
})()
