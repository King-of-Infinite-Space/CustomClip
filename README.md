a prototype web extension to extract and save elements from web pages

---

A common scenario:
1. Extract and format data from a web page (source)
2. Send formatted data somewhere (destination)

There are web clipper extensions for specific destinations like notebook apps (eg. Notion) or reference management softwares (eg. Zotero), but users cannot choose arbitrary elements on the page to extract.

This goal of this extension is to allow full customization of
1. which elements to extract on what web pages ("extractor")
2. where to send the data ("sender")

The extension [pdulvp/extract-data](https://github.com/pdulvp/extract-data) has a great implementation for Step 1, but has limited options for Step 2.

In this prototype, extraction rules are defined in script files. A full implementation will allow defining extraction rules with JSON in extension setting page.\
Such an extension can be useful for building a personal database. (Like Zotero, but not limited to academic resources.) For example, I made this extension to save douban book entries to Notion database.

---

"extractor" scripts are declared as `content_scripts` in `manifest.json` to have access to DOM. They extract page contents via xpath or CSS selector and format them. (This similar to Zotero translators.)
"sender" scripts define the API endpoints that the data will be sent to. When the extension window opens, it asks the extactor script for data and displays it to the user. The data can be edited before being transfered by a sender.
