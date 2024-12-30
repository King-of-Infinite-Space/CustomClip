PetiteVue.createApp({
  rules: [],
  ruleStr: '',
  ruleUrl: '',
  saveStatus: '',
  fetchStatus: '',
  fetchExternalRules: async function () {
    try {
      const response = await fetch(this.ruleUrl)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const rules = await response.json()
      this.rules.push(...rules)
      this.ruleStr = JSON.stringify(this.rules, null, 2)
      console.debug(rules.length, 'rules fetched from', this.ruleUrl)
      this.fetchStatus = `${rules.length} rules added. "Save" to confirm.`
    } catch (error) {
      this.fetchStatus = error
      console.error('Failed to fetch external rules:', error)
    }
  },
  loadRules: async function () {
    try {
      const result = await chrome.storage.sync.get('rules')
      const rules = result.rules
      if (!rules) {
        this.ruleStr = "No saved rules"
        return
      }
      this.rules = rules
      this.ruleStr = JSON.stringify(this.rules, null, 2)
      this.saveStatus = `${rules.length} rules loaded from save`
    } catch (error) {
      this.saveStatus = error
      console.error('Failed to load rules from storage:', error)
    }
  },
  saveRules: async function () {
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
