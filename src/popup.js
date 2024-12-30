const vstore = PetiteVue.reactive({
  sendOptions: [],
  destinations: [],
  destValues: [],
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
  { indent = 2, level = 2, removeOuterBrackets = false } = {}
) {
  let s = JSON.stringify(jsonData, null, indent)
  s = s.replace(new RegExp(`\n[ ]{${(level + 1) * indent},}`, 'g'), '')
  s = s.replace(new RegExp(`\n[ ]{${level * indent}}([}\\]],?)`, 'g'), '$1')
  if (removeOuterBrackets) {
    if (s.startsWith('{\n')) {
      s = s.slice(2) // remove outer brackets and newline
    }
    if (s.endsWith('\n}')) {
      s = s.slice(0, -2) // remove newline and outer brackets
    }
  }
  return s
}

async function postData(data, source) {
  try {
    const destName = document.getElementById('destinations').value
    _postStatus.innerText = `Sending from ${source} to ${destName}...`
    const destination = vstore.destinations.filter(
      dest => dest.name === destName
    )[0]
    // console.log(destination) // an object with token etc
    destination.name = destination.name.toLowerCase()
    const formattedData = formatter[destination.name]
      ? formatter[destination.name](data)
      : data
    const result = await sender[destination.name](formattedData, destination)
    let successText = 'Success\n'
    if (result.success) {
      _postStatus.classList.add('success')
    } else {
      successText = 'Error\n'
      _postStatus.classList.add('error')
    }
    _postStatus.innerText =
      successText +
      prettifyJson(result.response, {
        removeOuterBrackets: true,
      })
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
      vstore.destValues = vstore.destinations.map(dest => dest.name)
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
