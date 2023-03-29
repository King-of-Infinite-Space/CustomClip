// some xpaths taken from
// https://lemmo.notion.site/Python-Notion-49cd2a7b5a034061be0da256101f0ebd
const entries = {
    "标题": "//*[@id='mainpic']/a/@title",
    "封面": "//*[@id='mainpic']/a/img/@src",
    "作者": "//*[@id='info']/span[1]/a/text()",
    "出版社": "//span[./text()='出版社:']/following-sibling::a[1]/text() | //span[./text()='出版社:']/following::text()[1]",
    "副标题": "//span[./text()='副标题:']/following::text()[1]",
    "原作名": "//span[./text()='原作名:']/following::text()[1]",
    "译者": "//span[./text()=' 译者']/following-sibling::a/text()",
    "出版年份": {
        xpath: "//span[./text()='出版年:']/following::text()[1]",
        output: (x) => parseInt(x.split('-')[0]),
    },
    "页数": {
        xpath: "//span[./text()='页数:']/following::text()[1]",
        output: (x) => parseInt(x),
    },
    // 价格 "//span[./text()='定价:']/following::text()[1]",
    // 装帧 "//span[./text()='装帧:']/following::text()[1]'
    // 出品方  "//span[./text()='出品方:']/following::text()[2]",
    // "丛书": "//span[./text()='丛书:']/following::text()[2]",

    // "ISBN": "//span[./text()='ISBN:']/following::text()[1]",
    "评分": {
        xpath: "//strong[@property='v:average']",
        output: (x) => parseFloat(x),
    },
    "评价人数": {
        xpath: "//span[@property='v:votes']",
        output: (x) => parseInt(x),
    },
    "链接": {
        output: () => window.location.href,
    },
    "标记日期": {
        output: () => new Date().toISOString().split('T')[0]
    }
}

addListener(getCurrentScriptName(), entries)