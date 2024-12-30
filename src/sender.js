// used in popup

const sender = {
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
      // Format json into yaml frontmatter
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

      let filename = 'data.yaml'
      for (const [key, value] of Object.entries(jsonData)) {
        if (key.toLowerCase() === 'title' || key === '标题') {
          filename = value + '.yaml'
        }
      }

      // Create and download the file
      const blob = new Blob([yamlStr], { type: 'text/yaml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()

      // Cleanup
      setTimeout(() => URL.revokeObjectURL(url), 100)
      return { success: true, response: 'Initiating download' }
    } catch (error) {
      console.error('Error creating YAML frontmatter:', error)
      throw error
    }
  },

  async googleSheet(jsonData, { sheetId, sheetName, apiKey }) {
    // TODO: implement auth
    const endpoint = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}`

    try {
      // Fetch headers
      const headersResponse = await fetch(`${endpoint}!A1:Z1?key=${apiKey}`)
      if (!headersResponse.ok) {
        throw new Error('Failed to fetch headers', headersResponse.statusText)
      }

      const headersData = await headersResponse.json()
      const headers = headersData.values?.[0] || []

      // Map JSON data to headers
      const rowData = headers.map(key =>
        jsonData[key] !== undefined ? jsonData[key] : ''
      )

      // Append the row
      const response = await fetch(
        `${endpoint}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS&key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            values: [rowData],
          }),
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          `API Error: ${errorData.error?.message || response.statusText}`
        )
      }

      return await response.json()
    } catch (error) {
      console.error('Error adding row to sheet:', error)
      throw error
    }
  },
}

const formatter = {
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
