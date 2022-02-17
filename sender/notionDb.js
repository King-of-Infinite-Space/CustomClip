import { NOTION_TOKEN } from './tokens.js'

async function postToNotion(data) {
    // Default options are marked with *
    const response = await fetch("https://api.notion.com/v1/pages", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${NOTION_TOKEN}`,
            'Notion-Version': '2021-08-16',
        },
        body: data
    })
    const j = await response.json()
    j.success = !j.status
    return j
}

export { postToNotion }