// content scripts declared in manifest.json share the same global namespace

const transformationRegistry = {
  parseInt: args => parseInt(args[0]),
  parseFloat: args => parseFloat(args[0]),
  matchRegex: args => args[0].match(new RegExp(args[1]))[args[2] || 0],
  splitSelect: args => args[0].split(args[1])[args[2]],
  replaceAll: args => args[0].replaceAll(args[1], args[2]),
  getCurrentDate: args => new Date().toISOString().split('T')[0],
  getCurrentURL: args => window.location.href,
  add: args => args[0] + args[1],
  subtract: args => args[0] - args[1],
  multiply: args => args[0] * args[1],
  divideBy: args => args[0] / args[1],
}

const applyTransformation = (content, transformations, key) => {
  let result = content
  let errMsg = null
  // Apply transformations in order
  for (const [fn, ...args] of transformations) {
    if (transformationRegistry[fn]) {
      try {
        result = transformationRegistry[fn]([result, ...args])
      } catch (error) {
        errMsg = `Error applying transformation ${fn} for ${key}: ${error.message}`
        console.error(errMsg)
        break
      }
    }
  }
  return [result, errMsg]
}

const getTextsFromXpath = xpath => {
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
  return contents
}

const getTextsFromCss = css => {
  const elements = document.querySelectorAll(css)
  const contents = []
  elements.forEach(el => {
    const text = el.innerText.trim()
    if (text) {
      contents.push(text)
    }
  })
  return contents
}

function extractEntry(entry, key) {
  let contents = null
  let errMsg = null
  if (typeof entry === 'string') {
    contents = getTextsFromXpath(entry)
  } else if (entry.xpath) {
    contents = getTextsFromXpath(entry.xpath)
  } else if (entry.css) {
    contents = getTextsFromCss(entry.css)
  }
  const content = contents ? contents.join(', ') : ''
  if (
    (content !== '' || (!entry.xpath && !entry.css)) &&
    entry.transformations
  ) {
    // only apply transformations if content is not empty or no extraction needed
    return applyTransformation(content, entry.transformations, key)
  }
  return [content, errMsg]
}

function extractData(properties) {
  const data = {}
  const errors = []
  for (const key in properties) {
    const [content, errorMsg] = extractEntry(properties[key], key)
    data[key] = content
    if (errorMsg) {
      errors.push(errorMsg)
    }
    // could be empty string if no match
  }
  return [data, errors]
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.source !== 'popup') {
    return false // Don't keep channel open
  }

  // Handle async response properly
  ;(async () => {
    const rules = await chrome.storage.sync
      .get('rules')
      .then(result => result.rules || [])
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
    if (!rule) {
      sendResponse({ name: '' }) // No matching rule
      return
    }
    const [contents, errors] = extractData(rule.entries)

    const response = {
      name: rule.name,
      destinations: rule.destinations,
      entries: contents,
      errors: errors,
    }
    // TODO better error handling
    sendResponse(response)
  })()

  return true // Keep message channel open for async response
})
