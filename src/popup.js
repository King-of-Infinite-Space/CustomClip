import { createApp } from '../lib/petite-vue-csp.es.js'
import HighlightedCode from '../lib/highlighted-code-web.js'

import { sender, formatter } from './sender.js'
import { prettifyJson } from './utils.js'

// Create Petite Vue application with all state and methods directly in the root scope
createApp({
  // Application state
  preStatus: 'loading...',
  postStatus: '',
  postStatusClass: '',
  inputValue: '',
  selectedDestination: '',
  destinations: [],
  currentRule: null,

  // Lifecycle hook - runs when component is mounted
  // mounted() {
  //   this.getData()
  // },
  // this method needs to be called explicitly instead

  // Open Chrome extension options page
  openOptionsPage() {
    chrome.runtime.openOptionsPage()
  },

  // Submit data to selected destination
  async submitData() {
    try {
      const senderName = this.selectedDestination
      this.postStatusClass = ''
      this.postStatus = `Sending from ${this.currentRule} to ${senderName}...`

      const senderOptions = this.destinations.filter(
        dest => dest.sender === senderName
      )[0]

      const formattedData = formatter[senderName]
        ? formatter[senderName](JSON.parse(this.inputValue))
        : JSON.parse(this.inputValue)

      const result = await sender[senderName](formattedData, senderOptions)
      let statusText = "Sent without response"

      if (result.success) {
        statusText = 'Success'
        this.postStatusClass = 'success'
      } else {
        statusText = 'Error'
        this.postStatusClass = 'error'
      }

      if (result.response) {
        const responseText = prettifyJson(result.response, {removeOutmost: true})
        statusText += '\n' + responseText
      }

      this.postStatus = statusText
    } catch (error) {
      this.postStatus = error.toString()
      this.postStatusClass = 'error'
      console.error(error)
    }
  },

  // Fetch data from active tab
  async getData() {
    try {
      const tabs = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })
      const response = await chrome.tabs.sendMessage(tabs[0].id, {
        source: 'popup',
      })

      if (response.name) {
        this.currentRule = response.name
        this.preStatus = `Rule: ${response.name}`
        this.inputValue = prettifyJson(response.entries)

        const filteredDestinations = response.destinations.filter(
          dest => sender[dest.sender] !== undefined
        )

        this.destinations = filteredDestinations
        if (filteredDestinations.length > 0) {
          this.selectedDestination = filteredDestinations[0].name || filteredDestinations[0].sender
        }

        if (response.errors.length > 0) {
          this.postStatusClass = 'error'
          this.postStatus = response.errors.join('\n')
        }

        this.postStatus = ''
      } else {
        this.preStatus = 'No rule matching current URL'
      }
    } catch (error) {
      this.preStatus = error.toString()
      this.postStatusClass = 'error'
      throw error
    }
  },

  // Format JSON data for display
}).mount()
