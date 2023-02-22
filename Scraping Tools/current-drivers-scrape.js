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

        const teamName = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header > section.stats > div > table > tbody > tr:nth-child(1) > td"
          )
        ).map((x) => x.textContent);
    
        const country = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header > section.stats > div > table > tbody > tr:nth-child(2) > td"
          )
        ).map((x) => x.textContent);
    
        const podiums = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header > section.stats > div > table > tbody > tr:nth-child(3) > td"
          )
        ).map((x) => x.textContent);
    
        const points = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header > section.stats > div > table > tbody > tr:nth-child(4) > td"
          )
        ).map((x) => x.textContent);

        const starts = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header > section.stats > div > table > tbody > tr:nth-child(5) > td"
          )
        ).map((x) => x.textContent);
        const worlsTitles = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header > section.stats > div > table > tbody > tr:nth-child(6) > td"
          )
        ).map((x) => x.textContent);

        const highestRaceFinish = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header > section.stats > div > table > tbody > tr:nth-child(7) > td"
          )
        ).map((x) => x.textContent);
        const highestGridPos = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header > section.stats > div > table > tbody > tr:nth-child(8) > td"
          )
        ).map((x) => x.textContent);
        const dateOfBirth = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header > section.stats > div > table > tbody > tr:nth-child(9) > td"
          )
        ).map((x) => x.textContent);
        const placeOfBirth = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header > section.stats > div > table > tbody > tr:nth-child(10) > td"
          )
        ).map((x) => x.textContent);


    
          return {[name[0].trim(' ')] :{
            name: name[0].trim(' '),
            "drivers-no": driverNo[0],
            country: country[0],
            podiums: podiums[0],
            "total-points": points[0],
            "grand-prix-entered": starts[0],
            "WDC's": worlsTitles[0],
            "highest-race-finish": highestRaceFinish[0].slice(" ")[0],
            "total-wins": highestRaceFinish[0].slice(" ")[0] === '1' ? highestRaceFinish[0].split("(x").pop().slice(0, -1) : '0',
            'highest-grid-pos': highestGridPos[0],
            "date-of-birth": dateOfBirth[0],
            "place-of-birth": placeOfBirth[0]
          }}
    
      });
    
      //   console.log(data);
      await browser.close();
    
      // updateJSONFile(data, `../data/race-results-${year}.json`)
      
    //   writeData(data, `../data/final-grid-data/final-results-${year}.json`)
      return data;
    }

async function runMultipleScrapes() {
    const links = require(`../data/current-drivers/driver-profile-links.json`);
    for (let i = 0; i <= 19; i++) {
        let scrapedDriversData = [];
          const data = await currentDriversScrape(links[i]);
          scrapedDriversData.push(data);
          writeData(scrapedDriversData, `../data/current-drivers/current-driver-${i}.json`)
        }
    
      }

      runMultipleScrapes()
