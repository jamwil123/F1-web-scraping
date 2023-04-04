const puppeteer = require("puppeteer");
let data;
process.setMaxListeners(75);
const { currentYearLinksScrape } = require("./current-year-race-links-scrape")
async function currentYearScrape(link) {
    const browser = await puppeteer.launch({ 
        headless: true,
        args: ['--max_old_space_size=8192'],
      });
    const page = await browser.newPage();
    await page.goto(
        link
        );
        
  
  data = await page.evaluate(() => {
    const pos = Array.from(
      document.querySelectorAll(
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content.group > div.resultsarchive-col-right > table > tbody > tr > td:nth-child(2)")
    ).map((x) => x.textContent);

    const startDate = Array.from(
      document.querySelectorAll(
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div > div.table-wrap > table > tbody > tr > td.dark.hide-for-mobile"
      )
    ).map((x) => x.textContent)

    const endDate = Array.from(
      document.querySelectorAll(
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content-header.group > p > span.full-date"
      )
    ).map((x) => x.textContent)

    const firstNames = Array.from(
      document.querySelectorAll(
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content.group > div.resultsarchive-col-right > table > tbody > tr > td > span.hide-for-tablet"
      )
    ).map((x) => x.textContent);

    const lastNames = Array.from(
      document.querySelectorAll(
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content.group > div.resultsarchive-col-right > table > tbody > tr > td > span.hide-for-mobile"
      )
    ).map((x) => x.textContent);

    const car = Array.from(
      document.querySelectorAll(
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content.group > div.resultsarchive-col-right > table > tbody > tr > td.semi-bold.uppercase.hide-for-tablet"
      )
    ).map((x) => x.textContent);

    const laps = Array.from(
      document.querySelectorAll(
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content.group > div.resultsarchive-col-right > table > tbody > tr > td.semi-bold.hide-for-mobile"
      )
    ).map((x) => x.textContent);

    const q1 = Array.from(
      document.querySelectorAll(
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content.group > div.resultsarchive-col-right > table > tbody > tr > td:nth-child(6)"
      )
    ).map((x) => x.textContent);

    const q2 = Array.from(
      document.querySelectorAll(
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content.group > div.resultsarchive-col-right > table > tbody > tr > td:nth-child(7)"
      )
    ).map((x) => x.textContent);

    const q3 = Array.from(
      document.querySelectorAll(
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content.group > div.resultsarchive-col-right > table > tbody > tr > td:nth-child(8)"
      )
    ).map((x) => x.textContent);

    
    let fullDate = startDate.map((x, i) => {
        return `${x}-${endDate[i]}`;
      });

    let fullDriversNames = firstNames.map((x, i) => {
      return `${x} ${lastNames[i]}`;
    });
    
    const raceResults = fullDriversNames.map((x, i) => {
      return { 
      position : pos[i],
      driver: fullDriversNames[i],
      car: car[i],
      "date": fullDate[i],
      "laps": parseInt(laps[i]),
      Q1: q1[i],
      Q2: q2[i],
      Q3: q3[i]
        }
  })
  return raceResults
  });
 

  await browser.close();

// writeData(data, `../data/current-year-races/race-results-${new Date().getFullYear().toString()}.json`)
function getCountryName(url) {
    const match = url.match(/\/races\/\d+\/(.+?)\//);
    return match ? match[1].replace(/-/g, ' ') : null;
  }
  return {[getCountryName(link)]: data };
}

async function runScrapesQualifying() {
let links = await currentYearLinksScrape()
let finalArr = []
for(let i = 0; i < links.length; i++ ){
    console.log(links[i])
   let data = await currentYearScrape(links[i])
   finalArr.push(data)
   // seed function needed 
}
return finalArr
   
}


// async function runMultipleScrapes() {
//       let links = await currentYearLinksScrape()
//       for(let i = 0; i < links.length; i++ ){
//         let singeRaceResults = await currentYearRaceResultsScrape(links[i])
//         // console.log(singeRaceResults)
//         raceResults[new Date().getFullYear().toString()]['race-results'][i]['final-grid'] = singeRaceResults
//       }
//    return raceResults
//   }
  
module.exports = {runScrapesQualifying}

  
