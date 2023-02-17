const puppeteer = require("puppeteer");
const readJSONFile = require("../utils/readJSONFile");
const {writeData} = require("../utils/write-file")
let data;
process.setMaxListeners(75);


async function currentDriversScrape(link, year) {
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
            "body > div.site-wrapper > main > article > div > header > section.profile > div > figure > figcaption > div > span:nth-child(1)"
          )
        ).map((x) => x.textContent);
        const name = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header > section.profile > div > figure > figcaption > h1"
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
    const links = require(`../data/current-drivers/driver-profile-links.json`);
    for (let i = 0; i <= links.length; i++) {
        let scrapedDriversData = [];
          const data = await currentDriversScrape(links[i]);
          scrapedDriversData.push(data);
        }
        writeData(scrapedGridData, `../data/final-grid-data/final-results-${i}.json`)
    
      }
