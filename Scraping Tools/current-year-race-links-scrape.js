const puppeteer = require("puppeteer");
let data;
process.setMaxListeners(75);

async function currentYearLinksScrape() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--max_old_space_size=8192'],
      });
    const page = await browser.newPage();
    await page.goto(
        `https://www.formula1.com/en/results.html/${new Date().getFullYear().toString()}/races.html`
        );
        
  
        data = await page.evaluate(() => {
            const grandPrixName = Array.from(
              document.querySelectorAll(
                "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-filter-container > div:nth-child(3) > ul > li > a"
              )
            )
              .map((x) => x.href.replace('race-result.html', 'qualifying.html'))
              .filter((href) => href !== `https://www.formula1.com/en/results.html/${new Date().getFullYear().toString()}/races.html`);
          
            return grandPrixName;
          });
          
 

  await browser.close();
  console.log(data)
  return data
}

module.exports = { currentYearLinksScrape }

