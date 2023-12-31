const rules = [
  {
    name: "steam",
    regex: "store\\.steampowered\\.com/app/",
    enabled: true,
    entries: {
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
        xpath:
          "(//div[contains(@class, 'game_area_purchase_game')])[1]//div[contains(@class,'game_purchase_price')]/text() | (//div[@class='discount_original_price'])[1]",
        output: x => parseFloat(x.match(/\d+\.\d+/)[0]),
      },
      购价: {
        xpath:
          "(//div[@class='discount_final_price'])[1] | (//div[contains(@class, 'game_area_purchase_game')])[1]//div[contains(@class,'game_purchase_price')]/text()",
        output: x => parseFloat(x.match(/\d+\.\d+/)[0]),
      },
      折扣: {
        xpath:
          "(//div[contains(@class, 'game_area_purchase_game')])[1]//div[@class='discount_pct']",
        output: x => parseInt(x.match(/\d+/)[0]) / 100,
      },
    },
  },
  {
    name: "douban book",
    regex: "book\\.douban\\.com/subject/",
    enabled: true,
    entries: {
      标题: "//*[@id='mainpic']/a/@title",
      封面: "//*[@id='mainpic']/a/img/@src",
      作者: "//*[@id='info']/span[1]/a/text()",
      出版社:
        "//span[./text()='出版社:']/following-sibling::a[1]/text() | //span[./text()='出版社:']/following::text()[1]",
      副标题: "//span[./text()='副标题:']/following::text()[1]",
      原作名: "//span[./text()='原作名:']/following::text()[1]",
      译者: "//span[./text()=' 译者']/following-sibling::a/text()",
      出版年份: {
        xpath: "//span[./text()='出版年:']/following::text()[1]",
        output: x => parseInt(x.split("-")[0]),
      },
      页数: {
        xpath: "//span[./text()='页数:']/following::text()[1]",
        output: x => parseInt(x),
      },
      // 价格 "//span[./text()='定价:']/following::text()[1]",
      // 装帧 "//span[./text()='装帧:']/following::text()[1]'
      // 出品方  "//span[./text()='出品方:']/following::text()[2]",
      // "丛书": "//span[./text()='丛书:']/following::text()[2]",

      // "ISBN": "//span[./text()='ISBN:']/following::text()[1]",
      评分: {
        xpath: "//strong[@property='v:average']",
        output: x => parseFloat(x),
      },
      评价人数: {
        xpath: "//span[@property='v:votes']",
        output: x => parseInt(x),
      },
      链接: {
        output: () => window.location.href,
      },
      标记日期: {
        output: () => new Date().toISOString().split("T")[0],
      },
    },
  },
]
