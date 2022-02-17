const getTextFromXpath = (xpath) => {
    const matches = document.evaluate(
        xpath,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
    );
    var contents = [];
    for (let i = 0; i < matches.snapshotLength; i++) {
        var node = matches.snapshotItem(i);
        contents.push(node.textContent.trim());
    }
    return contents.join(", ");
}

function fmtEntry(entry) {
    if (typeof entry === 'string') {
        return { "rich_text": [{ "text": { "content": getTextFromXpath(entry) } }] }
    }
    if (entry.xpath) {
        return entry.output(getTextFromXpath(entry.xpath))
    } else {
        return entry.output()
    }
}

function extractData(properties) {
    const data = {}
    for (const key in properties) {
        data[key] = fmtEntry(properties[key])
    }
    return data
}


// content scripts declared in manifest.json share the same global namespace