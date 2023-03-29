import { NOTION_TOKEN, notion_db_id } from "./tokens.js"

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
      properties: data,
    }),
  })
  const j = await response.json()
  j.success = !j.status
  return j
}

export { postToNotion }
