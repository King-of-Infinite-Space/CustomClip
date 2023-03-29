const entries = {
  标题: '//div[@id="appHubAppName"]',
  好评率: {
    xpath: '//div[@itemprop="aggregateRating"]/@data-tooltip-html',
    output: x => parseInt(x.match(/\d+%/)[0]) || -1,
  },
  评价人数: {
    xpath: '//div[@itemprop="aggregateRating"]/@data-tooltip-html',
    output: x => parseInt(x.replaceAll(',','').match(/\d+(?!\%)\s/)[0]) || -1,
  },
  开发商: '//div[@id="developers_list"]/a',
  发行商: '//div[@id="developers_list"]/following::a[1]',
  发行年份: {
    xpath: "//div[@class='release_date']/div[@class='date']",
    output: (x) => parseInt(x.match(/\d{4}/)[0]),
  },
  链接: {
    output: () => window.location.href,
  },
  标记日期: {
    output: () => new Date().toISOString().split("T")[0]
  },
}

addListener(getCurrentScriptName(), entries)
