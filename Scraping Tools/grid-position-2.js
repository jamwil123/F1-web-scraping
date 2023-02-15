const puppeteer = require("puppeteer");
const fs = require("fs");

process.setMaxListeners(75);

// async function individialRaceLinks(year, category) {
//   const browser = await puppeteer.launch({
//     headless: true,
//     args: ["--max_old_space_size=8192"],
//   });
//   const page = await browser.newPage();
//   await page.goto(
//     `https://www.formula1.com/en/results.html/${year}/${category}.html`
//   );

//   const hrefValues = await page.$$eval('body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div > div.table-wrap > table > tbody > tr > td > a', aTags => aTags.map(aTag => aTag.href));
// console.log(hrefValues)
//   await browser.close();

//   writeData(hrefValues, `../data/final-grid/final-grid-links-${year}.json`);

// }

async function previousRacesScrape(link, year) {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--max_old_space_size=8192"],
  });
  const page = await browser.newPage();
  await page.goto(link);

  data = await page.evaluate((year) => {
    const driverNo = Array.from(
      document.querySelectorAll(
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content.group > div.resultsarchive-col-right > table > tbody > tr > td.dark.hide-for-mobile"
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
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content.group > div.resultsarchive-col-right > table > tbody > tr > td.semi-bold.uppercase.hide-for-tablet"
      )
    ).map((x) => x.textContent);

    const laps = Array.from(
      document.querySelectorAll(
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content.group > div.resultsarchive-col-right > table > tbody > tr > td.bold.hide-for-mobile"
      )
    ).map((x) => x.textContent);

    const totalTime = Array.from(
      document.querySelectorAll(
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content.group > div.resultsarchive-col-right > table > tbody > tr > td"
      )
    ).map((x) => x.textContent);

    const points = Array.from(
      document.querySelectorAll(
        "body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content.group > div.resultsarchive-col-right > table > tbody > tr > td"
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

    const raceResults = fullDriversNames.map((x, i) => {
      return {
        position: i + 1,
        "winner-car": parseInt(car[i]),
        "drivers-number": driverNo[i],
        "drivers-name": fullDriversNames[i],
        laps: parseInt(laps[i]),
        "final-time": totalTime[i],
        "points-earned": points[i],
      };
    });

    return { [country]: raceResults };
  }, year);

//   console.log(data);
  await browser.close();

  // updateJSONFile(data, `../data/race-results-${year}.json`)

  return data;
}

const linksList = async () => {
  for (let i = 1950; i <= 1955; i++) {
    const links = require(`../data/final-grid/final-grid-links-${i}.json`);
    let promises = 
      links.map(async (link) => {
        return await previousRacesScrape(link, i);
      }
      );
      let populatedArray = await Promise.all(promises)

    fs.readFile(`../data/archive-races/race-results-${i}.json`, 'utf8', (err, data) => {
        if (err) {
          console.log(err);
        } else {
          const jsonData = JSON.parse(data);
          console.log(jsonData[i.toString()]["race-results"],"\n", populatedArray[0] )
          jsonData[i.toString()]["race-results"].map((results) => {
            // if(results["race-name"] === object)
            console.log()
          });
          const newJsonData = JSON.stringify(jsonData);
          // Write the new JSON data to the file using a server-side script or other appropriate method
        }
      });
  }
};

linksList();

// async function runMultipleScrapes() {
//   const numScrapes = 2022;

//   for (let i = 1950; i <= numScrapes; i++) {
//     await individialRaceLinks(i.toString(), "races");
//   }
// }

// runMultipleScrapes();
