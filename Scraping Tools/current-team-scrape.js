const puppeteer = require("puppeteer");
const readJSONFile = require("../utils/readJSONFile");
const {writeData} = require("../utils/write-file")
let data;
process.setMaxListeners(75);


async function currentTeamScrape(link, year) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--max_old_space_size=8192"],
      });
      const page = await browser.newPage();
      await page.goto(link);
    
      data = await page.evaluate((year) => {
    

        const teamName = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header.team-details > section.stats > div > table > tbody > tr:nth-child(1) > td"
          )
        ).map((x) => x.textContent);
    
        const shortTeamName = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header:nth-child(1) > h1"
          )
        ).map((x) => x.textContent);
    
        const teamBase = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header.team-details > section.stats > div > table > tbody > tr:nth-child(2) > td"
          )
        ).map((x) => x.textContent);
    
        const teamChief = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header.team-details > section.stats > div > table > tbody > tr:nth-child(3) > td"
          )
        ).map((x) => x.textContent);
    
        const technicalChief = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header.team-details > section.stats > div > table > tbody > tr:nth-child(4) > td"
          )
        ).map((x) => x.textContent);

        const chassis = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header.team-details > section.stats > div > table > tbody > tr:nth-child(5) > td"
          )
        ).map((x) => x.textContent);

        const powerUnit = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header.team-details > section.stats > div > table > tbody > tr:nth-child(6) > td"
          )
        ).map((x) => x.textContent);

        const firstTeamEntry = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header.team-details > section.stats > div > table > tbody > tr:nth-child(7) > td"
          )
        ).map((x) => x.textContent);

        const worldChampionships = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header.team-details > section.stats > div > table > tbody > tr:nth-child(8) > td"
          )
        ).map((x) => x.textContent);

        const heighestRaceFinish = Array.from(
          document.querySelectorAll(
            "body > div.site-wrapper > main > article > div > header.team-details > section.stats > div > table > tbody > tr:nth-child(9) > td"
          )
        ).map((x) => x.textContent);

        const polePositions = Array.from(
            document.querySelectorAll(
              "body > div.site-wrapper > main > article > div > header.team-details > section.stats > div > table > tbody > tr:nth-child(10) > td"
            )
          ).map((x) => x.textContent);

          const fastestLaps = Array.from(
            document.querySelectorAll(
              "body > div.site-wrapper > main > article > div > header.team-details > section.stats > div > table > tbody > tr:nth-child(11) > td"
            )
          ).map((x) => x.textContent);
          const driverOneName = Array.from(
            document.querySelectorAll(
              "body > div.site-wrapper > main > article > div > header.team-details > section.profile > ul > li:nth-child(1) > a > figure > figcaption > h1"
            )
          ).map((x) => x.textContent);
          const driverTwoName = Array.from(
            document.querySelectorAll(
              "body > div.site-wrapper > main > article > div > header.team-details > section.profile > ul > li:nth-child(2) > a > figure > figcaption > h1"
            )
          ).map((x) => x.textContent);
          

    
          return {[shortTeamName] :{
            "full-team-name": teamName[0],
            "team-base": teamBase[0],
            'team-chief': teamChief[0],
            "technical-chief": technicalChief[0],
            "chassis": chassis[0],
            "power-unit": powerUnit[0],
            "first-entry": firstTeamEntry[0],
            "world-constructor-championships": worldChampionships[0],
            "total-wins": heighestRaceFinish[0].slice(" ")[0] === '1' ? heighestRaceFinish[0].split("(x").pop().slice(0, -1) : '0',
            "highest-race-finish": heighestRaceFinish[0].split('(')[0].trim(' '),
            'total-pole-positions': polePositions[0],
            "total-fastest-laps": fastestLaps[0],
            "current-drivers": [driverOneName[0].trim(" "), driverTwoName[0].trim(" ")]
          }}
    
      });
    
      //   console.log(data);
      await browser.close();
    
      // updateJSONFile(data, `../data/race-results-${year}.json`)
      
    //   writeData(data, `../data/final-grid-data/final-results-${year}.json`)
      return data;
    }

async function runMultipleScrapes() {
    const links = require(`../data/current-teams/team-profile-links.json`);
    for (let i = 0; i <= 9; i++) {
        let scrapedTeamData = [];
          const data = await currentTeamScrape(links[i]);
          scrapedTeamData.push(data);
          writeData(scrapedTeamData, `../data/current-teams/current-team-${i}.json`)
        }
    
      }

      runMultipleScrapes()
