const puppeteer = require("puppeteer");
const fs = require("fs");
const {writeData} = require("../utils/write-file")

process.setMaxListeners(75);

async function individialRaceLinks() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--max_old_space_size=8192"],
    });
    const page = await browser.newPage();
    await page.goto(
      `https://www.formula1.com/en/teams.html`
    );
  
    const hrefValues = await page.$$eval('body > div.site-wrapper > main > div.container.listing.team-listing > div > div > a', aTags => aTags.map(aTag => aTag.href));
    await browser.close();
  
  
      writeData(hrefValues, `../data/current-teams/team-profile-links.json`);
  
  
  }

 

async function previousRacesScrape(link, year) {
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

  }, year);

  //   console.log(data);
  await browser.close();

  // updateJSONFile(data, `../data/race-results-${year}.json`)
  return data;
}

const getData = (i) => {
    return new Promise((resolve, reject) => {
      fs.readFile(
        `../data/archive-races/race-results-${i}.json`,
        "utf8",
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(data));
          }
        }
      );
    });
  };

const mutateDataIntoOne = (jsonData, populatedArray, i) => {
  return jsonData[i.toString()]["race-results"].map((results, index) => {
    // console.log(Object.keys(populatedArray[index]))
    const resultsObj = { ...results };
    resultsObj["final-grid"] = populatedArray[index][index];
    return resultsObj;
  });

  
};

const callWebScrape = async (i, iteration) => {
  const link = require(`../data/final-grid/final-grid-links-${i}-${iteration}.json`);
  
   return await previousRacesScrape(link[0], i)
};

const writeDataToFile = (data, i) => {
  const newJsonData = JSON.stringify(data);
  fs.writeFile(
    `../data/archive-races/race-results-${i}.json`,
    newJsonData,
    "utf8",
    (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log(
          `Data written to ../data/archive-races/race-results-${i}.json`
        );
      }
    }
  );
};

const linksList = async () => {
  for (let i = 1950; i <= 2022; i++) {

    await individialRaceLinks(i, "races")
    // Calls the webscrape function to get the data(takes an index value eg year)
    
    
    // Calls FS to read the data in the archive(takes an index eg year)
    // let archiveData = await getData(i);

    // Mutates both the archive data and the webscrape data together
    // let mutatedData = mutateDataIntoOne(archiveData, webScrapeData, i);
    // console.log(mutatedData)

    // writeDataToFile(mutatedData, i);
  }
};

individialRaceLinks()

module.exports = {callWebScrape, previousRacesScrape}