const puppeteer = require("puppeteer");
const readJSONFile = require("../utils/readJSONFile");
const {writeData} = require("../utils/write-file")
let data;
process.setMaxListeners(75);


async function previousYearsScrape(link, year) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--max_old_space_size=8192"],
      });
      const page = await browser.newPage();
      await page.goto(link);
    
      data = await page.evaluate((year) => {
        const position = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content.group > div.resultsarchive-col-right > table > tbody > tr > td:nth-child(2)"
          )
        ).map((x) => x.textContent);
    
        const driverNo = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content.group > div.resultsarchive-col-right > table > tbody > tr > td:nth-child(3)"
          )
        ).map((x) => x.textContent);
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
            "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content.group > div.resultsarchive-col-right > table > tbody > tr > td:nth-child(5)"
          )
        ).map((x) => x.textContent);
    
        const laps = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content.group > div.resultsarchive-col-right > table > tbody > tr > td:nth-child(6)"
          )
        ).map((x) => x.textContent);
    
        const totalTime = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content.group > div.resultsarchive-col-right > table > tbody > tr > td:nth-child(7)"
          )
        ).map((x) => x.textContent);
    
        const points = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content.group > div.resultsarchive-col-right > table > tbody > tr > td:nth-child(8)"
          )
        ).map((x) => x.textContent);
    
        const country = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content-header.group > p > span.circuit-info"
          )
        ).map((x) => x.textContent.split(", ")[1]);
    
        let fullDriversNames = firstNames.map((x, i) => {
          return `${x} ${lastNames[i]}`;
        });
    
        // const deleteAllSpecialChars = (str)=>{
        //     return str.trim()
        // }
    
        // let formattedDate = date.map((x, i) => {
        //   const inputDate = new Date(x);
        //   const day = inputDate.getDate();
        //   const month = inputDate.getMonth() + 1;
        //   const year1 = inputDate.getFullYear();
    
        //   return `${day}/${month}/${year1}`;
        // });
    
        return fullDriversNames.map((x, i) => {
          return {
            position: position[i],
            "car-driven": car[i],
            "drivers-number": driverNo[i],
            "drivers-name": fullDriversNames[i],
            laps: laps[i],
            "final-time": totalTime[i],
            "points-earned": points[i],
            race: country[i],
          };
        });
    
      });
    
      //   console.log(data);
      await browser.close();
    
      // updateJSONFile(data, `../data/race-results-${year}.json`)
      
    //   writeData(data, `../data/final-grid-data/final-results-${year}.json`)
      return data;
    }

async function runMultipleScrapes() {
    const numScrapes = 2022;
    
    for (let i = 2001; i <= numScrapes; i++) {
        const links = require(`../data/final-grid/final-grid-links-${i}.json`);
        let scrapedGridData = [];
        for (let j = 0; j < links.length; j++) {
          const data = await previousYearsScrape(links[j], i);
          scrapedGridData.push(data);
        }
        writeData(scrapedGridData, `../data/final-grid-data/final-results-${i}.json`)
    
      }
    }


async function combineData (){
    for (let i = 1950; i <= 2022; i++) {
    let gridData = await readJSONFile(`../data/final-grid-data/final-results-${i}.json`)
    let archiveData = await readJSONFile(`../data/archive-races/race-results-${i}.json`)

        for (let j = 0; j < archiveData[i]['race-results'].length; j++){
            archiveData[i]['race-results'][j]['final-grid'] = gridData[j]
        }

     writeData( archiveData, `../data/archive-data-final/race-results-${i}.json` )
    }

}
  
  combineData()

  
module.exports = { previousYearsScrape, data}