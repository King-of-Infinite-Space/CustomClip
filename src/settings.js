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
    // support the github url (simply replace blob with raw), e.g.
    // https://github.com/King-of-Infinite-Space/CustomClip/blob/main/example_rules/steam.json
    let url = this.ruleUrl.trim()
    url = url.replace(/github\.com\/(.*)\/blob\//, "raw.githubusercontent.com/$1/")
    // $1 is user/repo
    try {
      // check if url is valid
      const _ = new URL(url)
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }
      const rules = await response.json()
      this.rules.push(...rules)
      this.ruleStr = prettifyJson(this.rules, {maxLevel: 4})
      const fileName = this.ruleUrl.split('/').pop()
      this.fetchStatus = `${rules.length} rules added from ${fileName}. Please edit destinations and save.`
      console.debug(rules.length, 'rules fetched from', this.ruleUrl)
    } catch (error) {
      this.fetchStatus = `Error: ${error.message}`
      console.error('Failed to fetch external rules:', error)
    }
  },
  loadRules: async function () {
    try {
      const result = await chrome.storage.sync.get('rules')
      let rules = result.rules
      if (!rules) {
        rules = []
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
      this.fetchStatus = ''
    } catch (error) {
      this.saveStatus = `${error}`
      console.error('Failed to save rules to storage:', error)
    }
  },
  editSaveStatus: function () {
    this.saveStatus = 'edit not saved'
  },
  async mounted() {
    // somehow this method is not called automatically
    // need to bind explicitly in HTML
    try {
      await this.loadRules()
    } catch (error) {
      console.error('Failed to load rules on mount:', error)
    }
  },
}).mount()
