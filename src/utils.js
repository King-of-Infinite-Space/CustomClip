export function prettifyJson(
  jsonData,
  { indent = 2, maxLevel = 2, removeOutmost = false } = {}
) {
  let jsonStr = JSON.stringify(jsonData, null, indent)
  jsonStr = jsonStr.replace(
    new RegExp(`\n[ ]{${(maxLevel + 1) * indent},}`, 'g'),
    ''
  )
  jsonStr = jsonStr.replace(
    new RegExp(`\n[ ]{${maxLevel * indent}}([}\\]],?)`, 'g'),
    '$1'
  )
  if (removeOutmost) {
    if (jsonStr.startsWith('{\n') && jsonStr.endsWith('\n}')) {
      jsonStr = jsonStr.slice(2, -2)
    }
    if (jsonStr.startsWith('"') && jsonStr.endsWith('"')) {
      jsonStr = jsonStr.slice(1, -1)
    }
  }
  return jsonStr
}