const entries = {
    标题: '//div[@id="appHubAppName"]',
    好评率: {
        xpath: '//div[@itemprop="aggregateRating"]/@data-tooltip-html',
        output: x => parseInt(x.match(/\d+%/)[0]) || -1,
    },
    评价人数: {
        xpath: '//div[@itemprop="aggregateRating"]/@data-tooltip-html',
        output: x =>
            parseInt(x.replaceAll(",", "").match(/\d+(?!\%)\s/)[0]) || -1,
    },
    开发商: '//div[@class="dev_row"][1]/a',
    发行商: '//div[@class="dev_row"][2]/a',
    发行年份: {
        xpath: "//div[@class='release_date']/div[@class='date']",
        output: x => parseInt(x.match(/\d{4}/)[0]),
    },
    链接: {
        output: () => window.location.href,
    },
    标记日期: {
        output: () => new Date().toISOString().split("T")[0],
    },
    原价: {
        xpath: "(//div[contains(@class, 'game_area_purchase_game')])[1]//div[contains(@class,'game_purchase_price')]/text() | (//div[@class='discount_original_price'])[1]",
        output: x => parseFloat(x.match(/\d+\.\d+/)[0]),
    },
    购价: {
        xpath: "(//div[@class='discount_final_price'])[1] | (//div[contains(@class, 'game_area_purchase_game')])[1]//div[contains(@class,'game_purchase_price')]/text()",
        output: x => parseFloat(x.match(/\d+\.\d+/)[0]),
    },
    折扣: {
        xpath: "(//div[contains(@class, 'game_area_purchase_game')])[1]//div[@class='discount_pct']",
        output: x => parseInt(x.match(/\d+/)[0])/100,
    },
}

addListener(getCurrentScriptName(), entries)
