import { createApp } from '../lib/petite-vue-csp.es.js'
import  HighlightedCode from '../lib/highlighted-code-web.js'

import { prettifyJson } from './utils.js'

createApp({
  rules: [],
  ruleStr: '',
  ruleUrl: '',
  saveStatus: '',
  fetchStatus: '',
  fetchExternalRules: async function () {
    // for example
    // support the github url (simply replace blob with raw)
    // https://github.com/King-of-Infinite-Space/CustomClip/blob/main/example_rules/steam.json
    let url = this.ruleUrl.trim()
    url = url.replace(/github\.com\/(.*)\/blob\//, "raw.githubusercontent.com/$1/")
    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      const rules = await response.json()
      this.rules.push(...rules)
      this.ruleStr = prettifyJson(this.rules, {maxLevel: 4})
      const fileName = this.ruleUrl.split('/').pop()
      this.fetchStatus = `${rules.length} rules added from ${fileName}. Please edit destinations. "Save" to confirm.`
      console.debug(rules.length, 'rules fetched from', this.ruleUrl)
    } catch (error) {
      this.fetchStatus = error
      console.error('Failed to fetch external rules:', error)
    }
  },
  loadRules: async function () {
    try {
      const result = await chrome.storage.sync.get('rules')
      let rules = result.rules
      if (!rules) {
        rules = [{
          "name": "Example Rule",
          "matchURL": "example\.com",
        }]
      }
      this.rules = rules
      this.ruleStr = prettifyJson(rules, {maxLevel: 4})
      this.saveStatus = `${rules.length} rules loaded from storage`
    } catch (error) {
      this.saveStatus = error
      console.error('Failed to load rules from storage:', error)
    }
  },
  saveRules: async function () {
    // somehow highlighted code breaks model
    this.ruleStr = document.getElementById('rules').value
    try {
      const rules = JSON.parse(this.ruleStr)
      this.rules = rules
      await chrome.storage.sync.set({ rules: rules })
      this.saveStatus = `${rules.length} rules saved to storage`
      // console.debug(rules.length, 'rules saved to storage')
    } catch (error) {
      this.saveStatus = `${error}`
      console.error('Failed to save rules to storage:', error)
    }
  },
  async mounted() {
    // somehow this method needs to be called explicitly
    // console.debug('mounted')
    try {
      await this.loadRules()
    } catch (error) {
      console.error('Failed to load rules on mount:', error)
    }
  },
}).mount()
