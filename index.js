const {
  driverPointsScrape,
  pointsData,
} = require("./Scraping Tools/drivers-points-scraping-tool");
const { callAPI_PATCH } = require("./API Calls/API_Call_PATCH");
const functions = require('firebase-functions');
const cron = require('cron');

exports.f1WebScrapingFunction = functions.pubsub
  .schedule('*/10 * * * * *')
  .timeZone('GMT')
  .onRun((context) => {
    driverPointsScrape()
    .then((res) => {
      callAPI_PATCH(res, "/api/drivers/data/add_data");
    })
    console.log('This function is running every 10 seconds!');
    return null;
  });

// function asyncLoop(i) {
  
    // .then(() => {
    //   setTimeout(() => {
    //     asyncLoop(i);
    //     console.log("5 seconds delay are over");
    //   }, 10 * 1000);
    // });
// }

// asyncLoop(0);
