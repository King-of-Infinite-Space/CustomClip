import { NOTION_TOKEN, notion_db_id } from "./tokens.js"

function formatData(data) {
  const formattedData = {}
  for (const [key, value] of Object.entries(data)) {
    // format data object to match notion api
    if (key === "标题" || key.toLowerCase() === "title") {
      formattedData[key] = { title: [{ text: { content: value } }] }
    } else if (typeof value === "number") {
      formattedData[key] = { number: value }
    } else if (value.startsWith("http")) {
      formattedData[key] = { url: value }
    } else if (Date.parse(value)) {
      formattedData[key] = {
        date: { start: new Date(value).toISOString().split("T")[0], end: null },
      }
    } else {
      formattedData[key] = { rich_text: [{ text: { content: value } }] }
    }
  }
  return formattedData
}

async function postToNotion(data, source) {
  // Default options are marked with *
  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${NOTION_TOKEN}`,
      "Notion-Version": "2021-08-16",
    },
    body: JSON.stringify({
      parent: { database_id: notion_db_id[source] },
      properties: formatData(data),
    }),
  })
  const j = await response.json()
  j.success = !j.status
  return j
}

export { postToNotion }
