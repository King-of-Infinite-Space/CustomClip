const getTextFromXpath = (xpath) => {
    const matches = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );
    const contents = [];
    for (let i = 0; i < matches.snapshotLength; i++) {
        const node = matches.snapshotItem(i);
        const text = node.textContent.trim();
        if (text) {
            contents.push(text);
        }
    }
    return contents.join(", ");
}

function extractEntry(entry) {
    if (typeof entry === 'string') {
        entry = {
            xpath: entry,
            output: (x) => ({ "rich_text": [{ "text": { "content": x } }] })
        }
    }
    if (entry.xpath) {
        const content = getTextFromXpath(entry.xpath)
        return content ? entry.output(content) : null
    } else {
        return entry.output()
    }
}

function extractData(properties) {
    const data = {}
    for (const key in properties) {
        const entry = extractEntry(properties[key])
        if (entry) {
            data[key] = entry
        }
    }
    return data
}


// content scripts declared in manifest.json share the same global namespace