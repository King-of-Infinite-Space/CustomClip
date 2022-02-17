a prototype Chrome extension for extracting data from web pages

---

A common scenario:
1. Extract and format data from a webpage (source)
2. Send formatted data somewhere (destination)

If destination is some notebook app (eg. Notion), there are web clipper extensions. They work fine for saving contents of the page, but do not allow predefined named fields for specific sources.

If destination is some reference management software (eg. Zotero) and the source is an academic article, there are extensions to automatically extract relevant information.

There are also various web scraper extensions, but they often require manual configuration.

---

This goal of this extension is to allow full customization of
1. what data to extract in specific pages ("extractor")
2. where to send the data ("sender")

"extractor" scripts are declared as `content_scripts` in `manifest.json` to have access to DOM. They extract page contents via xpath or CSS selector and format them. (This similar to Zotero translators.)
"sender" scripts define the API endpoints that the data will be sent to. When the extension window opens, it asks the extactor script for data and displays it to the user. The data can be edited before being transfered by a sender.

This workflow may be most suitable for building a personal database. (Like Zotero, but not limited to academic resources.) For example, I use this to save douban book entries to Notion database.