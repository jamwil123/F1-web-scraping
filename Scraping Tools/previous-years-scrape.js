const puppeteer = require("puppeteer");
const {writeData} = require("../utils/write-file")
let data;
process.setMaxListeners(75);

async function previousYearsScrape(year, category) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--max_old_space_size=8192'],
      });
    const page = await browser.newPage();
    await page.goto(
        `https://www.formula1.com/en/results.html/${year}/${category}.html`
        );
        
  
  data = await page.evaluate((yearDate) => {
    console.log("inside")
    const grandPrix = Array.from(
      document.querySelectorAll(
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div > div.table-wrap > table > tbody > tr > td > a"
      )
    ).map((x) => x.textContent);

    const date = Array.from(
      document.querySelectorAll(
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div > div.table-wrap > table > tbody > tr > td.dark.hide-for-mobile"
      )
    ).map((x) => x.textContent)
    const inputDate = new Date(date[0]);

    const year = inputDate.getFullYear();

    const firstNames = Array.from(
      document.querySelectorAll(
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div > div.table-wrap > table > tbody > tr > td > span.hide-for-tablet"
      )
    ).map((x) => x.textContent);

    const lastNames = Array.from(
      document.querySelectorAll(
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div > div.table-wrap > table > tbody > tr > td> span.hide-for-mobile"
      )
    ).map((x) => x.textContent);

    const car = Array.from(
      document.querySelectorAll(
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div > div.table-wrap > table > tbody > tr > td.semi-bold.uppercase"
      )
    ).map((x) => x.textContent);

    const laps = Array.from(
      document.querySelectorAll(
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div > div.table-wrap > table > tbody > tr> td.bold.hide-for-mobile"
      )
    ).map((x) => x.textContent);

    const finalData = { [yearDate]: {"race-results": { }}}
    

    let fullDriversNames = firstNames.map((x, i) => {
      return `${x} ${lastNames[i]}`;
    });

    const deleteAllSpecialChars = (str)=>{
        return str.trim()
    }

    let formattedDate = date.map((x, i) => {
      const inputDate = new Date(x);
      const day = inputDate.getDate();
      const month = inputDate.getMonth() + 1;
      const year1 = inputDate.getFullYear();

      return `${day}/${month}/${year1}`;
    });

    const raceResults = fullDriversNames.map((x, i) => {
      return {"race-name": deleteAllSpecialChars(grandPrix[i]), winner : fullDriversNames[i],
      "winner-car": car[i],
      "date": formattedDate[i],
      "laps": parseInt(laps[i]),
      "final-grid": []
    }
    })
    finalData[yearDate]["race-results"] = raceResults
    return finalData
  }, year);
 

  await browser.close();

writeData(data, `../data/race-results-${year}.json`)

  return data;
}


async function runMultipleScrapes() {
    const numScrapes = 2022;
    const promises = [];
    
    for (let i = 2001; i <= numScrapes; i++) {
      promises.push(previousYearsScrape(i.toString(), "races")); // Add each scrape as a Promise
    }
    
    await Promise.all(promises); // Wait for all Promises to resolve
  }
  
  runMultipleScrapes();

  
module.exports = { previousYearsScrape, data };
