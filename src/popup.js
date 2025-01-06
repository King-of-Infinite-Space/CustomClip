const vstore = PetiteVue.reactive({
  sendOptions: [],
  destinations: [],
})

PetiteVue.createApp({
  vstore,
}).mount()

const _preStatus = document.getElementById('preStatus')
const _postStatus = document.getElementById('postStatus')
const _submitButton = document.getElementById('submitButton')
const _inputBox = document.getElementById('inputBox')
const _form = document.getElementById('form')
document.getElementById('optionsButton').onclick = () => {
  chrome.runtime.openOptionsPage()
}

window.onload = () => {
  getData()
}

function prettifyJson(
  jsonData,
  { indent = 2, level = 2, removeOutmost = false } = {}
) {
  let jsonStr = JSON.stringify(jsonData, null, indent)
  jsonStr = jsonStr.replace(
    new RegExp(`\n[ ]{${(level + 1) * indent},}`, 'g'),
    ''
  )
  jsonStr = jsonStr.replace(
    new RegExp(`\n[ ]{${level * indent}}([}\\]],?)`, 'g'),
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

async function postData(data, source) {
  try {
    const destName = document.getElementById('destinations').value
    _postStatus.innerText = `Sending from ${source} to ${destName}...`
    const destOptions = vstore.destinations.filter(
      dest => dest.name === destName
    )[0]
    // console.log(destination) // an object with token etc
    destOptions.name = destOptions.name.toLowerCase()
    const formattedData = formatter[destOptions.name]
      ? formatter[destOptions.name](data)
      : data
    const result = await sender[destOptions.name](formattedData, destOptions)
    let successText = 'Success\n'
    if (result.success) {
      _postStatus.classList.add('success')
    } else {
      successText = 'Error\n'
      _postStatus.classList.add('error')
    }
    if (result.response) {
      successText += prettifyJson(result.response, {
        removeOutmost: true,
      })
    }
    _postStatus.innerText = successText
  } catch (error) {
    _postStatus.innerText = error
    _postStatus.classList.add('error')
    console.error(error)
  }
}
async function getData() {
  try {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true })
    const response = await chrome.tabs.sendMessage(tabs[0].id, {
      source: 'popup',
    })
    if (response.name) {
      _preStatus.innerText = `Rule: ${response.name}`
      _inputBox.value = prettifyJson(response.entries)
      vstore.destinations = response.destinations.filter(
        dest => sender[dest.name.toLowerCase()] !== undefined
      )
      _postStatus.innerText = ''
      _submitButton.onclick = () => {
        _postStatus.classList.remove('error')
        _postStatus.classList.remove('success')
        postData(response.entries, response.name)
      }
    } else {
      _preStatus.innerText = 'No rule matching current URL'
    }
  } catch (error) {
    _preStatus.innerText = error
    _preStatus.classList.add('error')
    throw error
  }
}
