// used in popup

export const sender = {
  async notion(data, { databaseId, token }) {
    const response = await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        'Notion-Version': '2021-08-16',
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: data,
      }),
    })
    const j = await response.json()
    return {
      success: !j.status,
      response: j,
    }
  },

  yamlfrontmatter(jsonData, options = {}) {
    try {
      // Format json into yaml frontmatter in markdown
      let yamlStr = '---\n'
      for (const [key, value] of Object.entries(jsonData)) {
        // Handle different value types
        const formattedValue =
          typeof value === 'string'
            ? `"${value.replace(/"/g, '\\"')}"`
            : JSON.stringify(value)
        yamlStr += `${key}: ${formattedValue}\n`
      }
      yamlStr += '---\n'

      let filename = 'data.md'
      for (const [key, value] of Object.entries(jsonData)) {
        if (key.toLowerCase() === 'title' || key === '标题') {
          filename = value + '.md'
        }
      }

      // Create and download the file
      const blob = new Blob([yamlStr], { type: 'text/markdown' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()

      // Cleanup
      setTimeout(() => URL.revokeObjectURL(url), 100)
      return { success: true, response: 'Download started' }
    } catch (error) {
      console.error('Error creating YAML frontmatter:', error)
      throw error
    }
  },
  async webhook(data, { url }) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      // hostname
      const hostname = new URL(url).hostname
      return {
        success: response.ok,
        response: `Sent to webhook at ${hostname}`,
      }
    } catch (error) {
      console.error('Error sending to webhook:', error)
      throw error
    }
  },
  async obsidian(data, params) {
  }
}

export const formatter = {
  notion(data) {
    const formattedData = {}

    for (const [key, value] of Object.entries(data)) {
      // format data object to match notion api
      console.log(key, value)
      if (key === '标题' || key.toLowerCase() === 'title') {
        formattedData[key] = { title: [{ text: { content: value } }] }
      } else if (typeof value === 'number') {
        formattedData[key] = { number: value }
      } else if (value.startsWith('http')) {
        formattedData[key] = { url: value }
      } else if (Date.parse(value)) {
        formattedData[key] = {
          date: {
            start: new Date(value).toISOString().split('T')[0],
            end: null,
          },
        }
      } else {
        formattedData[key] = { rich_text: [{ text: { content: value } }] }
      }
    }
    return formattedData
  },
}
