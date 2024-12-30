// content scripts declared in manifest.json share the same global namespace

const transformationRegistry = {
  parseInt: args => parseInt(args[0]),
  parseFloat: args => parseFloat(args[0]),
  findMatch: args => args[0].match(new RegExp(args[1]))[args[2] || 0],
  splitSelect: args => args[0].split(args[1])[args[2]],
  replaceAll: args => args[0].replaceAll(args[1], args[2]),
  getCurrentDate: args => new Date().toISOString().split('T')[0],
  getCurrentURL: args => window.location.href,
  add: args => args[0] + args[1],
  subtract: args => args[0] - args[1],
  multiply: args => args[0] * args[1],
  divideBy: args => args[0] / args[1],
}

const applyTransformation = (value, transformations) => {
  return transformations.reduce((acc, [fn, ...args]) => {
    if (transformationRegistry[fn]) {
      return transformationRegistry[fn]([acc, ...args])
    }
    console.error(`Unsupported transformation function: ${fn}`)
  }, value)
}

const getTextFromXpath = xpath => {
  const matches = document.evaluate(
    xpath,
    document,
    null,
    XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
    null
  )
  const contents = []
  for (let i = 0; i < matches.snapshotLength; i++) {
    const node = matches.snapshotItem(i)
    const text = node.textContent.trim()
    if (text) {
      contents.push(text)
    }
  }
  return contents.join(', ')
}

function extractEntry(entry) {
  const content =
    typeof entry === 'string'
      ? getTextFromXpath(entry)
      : getTextFromXpath(entry.xpath)
  if (entry.transformations) {
    return applyTransformation(content, entry.transformations)
  }
  return content
}

function extractData(properties) {
  const data = {}
  for (const key in properties) {
    const entry = extractEntry(properties[key])
    if (entry) {
      data[key] = entry
    }
  }
  return data
}
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.source !== 'popup') {
    return false // Don't keep channel open
  }

  // Handle async response properly
  ;(async () => {
    const rules = await chrome.storage.sync
      .get('rules')
      .then(result => result.rules)
    let rule = null
    for (const r of rules) {
      if (
        r.enabled &&
        r.matchURL &&
        RegExp(r.matchURL).test(window.location.href)
      ) {
        rule = r
        break
      }
    }

    const response = rule
      ? {
          name: rule.name,
          entries: extractData(rule.entries),
          destinations: rule.destinations,
        }
      : { name: '' }

    sendResponse(response)
  })()

  return true // Keep message channel open for async response
})
