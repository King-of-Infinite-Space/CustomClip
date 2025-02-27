## Custom Clip

Web extension to extract specified text elements

- Define "rules" in JSON in extension settings
  - Each rule specifies a regex to match URL and xpaths/css to extract 
  - see [example](./example_rules/steam.json)
- Open the extension on a matching page to preview and edit extracted data
  ```json
    {"Title": "HUMANITY","Rating": 94}
- Send the extracted data to
  - Notion database
  - Webhook (for integrating with other services such as Make, Zapier, etc)
  - Markdown with YAML frontmatter (for Obsidian etc)
  - _to be developed..._


Useful for building a personal catalogue (such as books read)

---

#### Alternatives

- [pdulvp/extract-data](https://github.com/pdulvp/extract-data)
- [powersave.pro](https://powersave.pro/)