// content scripts declared in manifest.json share the same global namespace

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
            output: x => x
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

function getCurrentScriptName() {
    // ref https://stackoverflow.com/a/22165218
    const stackTrace = new Error().stack;
    console.log(stackTrace)
    const stackTraceLines = stackTrace.trim().split('\n');
    // firefox has an extra new line at the end
    const callerLine = stackTraceLines[stackTraceLines.length-1]
    const fileName = callerLine.split('/').pop().split('.')[0];
    console.log(`Content script: ${fileName}`)
    return fileName
}

function addListener(source, entries) {
    chrome.runtime.onMessage.addListener(
        function (message, sender, sendResponse) {
            if (message.source === "popup") {
                const data = extractData(entries)
                console.log(data)
                sendResponse({
                    source: source,
                    data: data
                });
            }
        }
    )
}
