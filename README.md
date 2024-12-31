## Custom Clip

(Prototype) Web extension to extract and save specified text elements from web pages

- Define "rules" in JSON in extension settings
  - Each rule specifies a regex to match URL and xpaths to extract 
  - See `example_rules` folder
- Open the extension on a matching page to preview extracted data
  ```json
    {"Title": "HUMANITY","Rating": 94}
- Save the extracted data to
  - Notion database
  - Markdown with YAML frontmatter (for Obsidian etc)
  - _More to come_


Useful for building a personal catalogue (such as books read)

---

#### Alternatives

- [pdulvp/extract-data](https://github.com/pdulvp/extract-data) - has nice UI to edit and validate rules, but only supports downloading the data as a file
- Zotero - includes "translators" (i.e. rules) for various academic resources, but only saves them to Zotero