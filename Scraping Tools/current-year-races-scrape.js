const puppeteer = require("puppeteer");
let data;
process.setMaxListeners(75);

async function currentYearScrape() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--max_old_space_size=8192'],
      });
    const page = await browser.newPage();
    await page.goto(
        `https://www.formula1.com/en/results.html/${new Date().getFullYear().toString()}/races.html`
        );
        
  
  data = await page.evaluate(() => {
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
  const finalData = { [new Date().getFullYear().toString()]: {"race-results": { }}}
    finalData[new Date().getFullYear().toString()]["race-results"] = raceResults
    return finalData
  });
 

  await browser.close();

// writeData(data, `../data/current-year-races/race-results-${new Date().getFullYear().toString()}.json`)

  return data;
}

async function currentYearRaceResultsScrape(link) {
  const browser = await puppeteer.launch({
      headless: true,
      args: ["--max_old_space_size=8192"],
    });
    const page = await browser.newPage();
    await page.goto(link);
  
    let data = await page.evaluate(() => {
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
    
    // writeData(data, `../data/current-year-races/current-grid-results-2023.json`)
    return data;
  }

async function raceLinksScrape() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--max_old_space_size=8192"],
    });
    const page = await browser.newPage();
    await page.goto(
      `https://www.formula1.com/en/results.html/${new Date().getFullYear().toString()}/races.html`
    );
  
    const hrefValues = await page.$$eval('body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div > div.table-wrap > table > tbody > tr > td > a', aTags => aTags.map(aTag => aTag.href));
    await browser.close();
  
  
      // writeData(hrefValues, `../data/current-year-races/race-links.json`);
      return hrefValues
  
  
  }


async function runMultipleScrapes() {
      let links = await raceLinksScrape()
      console.log(links)
      let raceResults = await currentYearScrape()
      for(let i = 0; i < links.length; i++ ){
        let singeRaceResults = await currentYearRaceResultsScrape(links[i])
        // console.log(singeRaceResults)
        raceResults[new Date().getFullYear().toString()]['race-results'][i]['final-grid'] = singeRaceResults
      }
   return raceResults
  }
  
  runMultipleScrapes();

  
module.exports = { currentYearScrape, data, runMultipleScrapes };