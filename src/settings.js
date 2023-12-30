// document
//     .getElementById("settings-form")
//     .addEventListener("submit", function (event) {
//         event.preventDefault()

//         var username = document.getElementById("username").value
//         var email = document.getElementById("email").value

//         // Save the settings
//         localStorage.setItem("username", username)
//         localStorage.setItem("email", email)

//         alert("Settings saved")
//     })

let savedRules = [
  {
    name: "steam",
    match: "https://steamcommunity.com/id/*",
    enabled: true,
    entries: {
      标题: '//div[@id="appHubAppName"]',
    },
  },
  {
    name: "steam2",
    enabled: false,
    match: "https://steamcommunity.com/id/*",
    entries: {
      标题: '//div[@id="appHubAppName"]',
    },
  },
]

Alpine.data("data", () => ({
  rules: savedRules,

  getRuleNameHTML() {
    if (this.rule.enabled) {
      return this.rule.name
    }
    return `<del>${this.rule.name}</del>`
  },
  getRuleEntries() {
    return this.rule.entries.JSON()
  }
}))
