const db = require("./db");
const {driverStandingsScrape} = require('../Scraping Tools/current-drivers-standings')
const {teamStandingsScrape} = require('../Scraping Tools/current-team-standings')
const {runMultipleScrapes} = require('../Scraping Tools/current-year-races-scrape')
const {runScrapesQualifying} = require("../Scraping Tools/current-year-qualifying-scrape")
// console.log(schema[0]["2022"])

const seedData = () => {
  async function runLoop() {
    for (let i = 2010; i <= 2022; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          const data = require(`../data/archive-data-final/race-results-${i.toString()}.json`);
          let year = Object.keys(data)[0];
          db.collection("previous-races")
            .doc(year)
            .set(data[year])
            .then((res) => {
              console.log(`data written to ${year}` );
            });

          resolve();
        }, 0);
      });
    }
  }

  runLoop();
};

const seedCurrentDriversData = () => {
  async function runLoop() {
    for (let i = 0; i <= 19; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          const data = require(`../data/current-drivers/current-driver-${i}.json`);
          let driverName = Object.keys(data[0])[0];
          db.collection("drivers")
            .doc(driverName)
            .set(data[0][driverName])
            .then((res) => {
              console.log(`data POSTED for ${driverName}` );
            });

          resolve();
        }, 0);
      });
    }
  }

  runLoop();
};

const seedCurrentTeamsData = () => {
  async function runLoop() {
    for (let i = 0; i <= 9; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          const data = require(`../data/current-teams/current-team-${i}.json`);
          let teamName = Object.keys(data[0])[0];
          db.collection("teams")
            .doc(teamName)
            .set(data[0][teamName])
            .then((res) => {
              console.log(`data POSTED for ${teamName}` );
            });

          resolve();
        }, 0);
      });
    }
  }

  runLoop();
};




const seedDriversStandings = async () => {
const data = await driverStandingsScrape()
console.log(Object.keys(data[0])[0])
  async function runLoop() {
    for (let i = 0; i < data.length; i++) {
      await new Promise((resolve) => {
        setTimeout(() => {
          let position = Object.keys(data[i])[0];
          db.collection("drivers-standings")
            .doc(position)
            .set(data[i][position])
            .then((res) => {
              console.log(`data POSTED for ${data[i][position].name}` );
            });

          resolve();
        }, 0);
      });
    }
  }

  runLoop();
};

const seedTeamStandings = async () => {
  const data = await teamStandingsScrape()
    async function runLoop() {
      for (let i = 0; i < data.length; i++) {
        await new Promise((resolve) => {
          setTimeout(() => {
            let position = Object.keys(data[i])[0];
            db.collection("team-standings")
              .doc(position)
              .set(data[i][position])
              .then((res) => {
                console.log(`data POSTED for ${data[i][position].name}` );
              });
  
            resolve();
          }, 0);
        });
      }
    }
  
    runLoop();
  };

  const seedCurrentRaceResults = async () => {
    const data = await runMultipleScrapes()
      async function runLoop() {
        for (let i = 0; i < 1; i++) {
          await new Promise((resolve) => {
            setTimeout(() => {
              db.collection("previous-races")
                .doc(new Date().getFullYear().toString())
                .set(data[new Date().getFullYear().toString()])
                .then((res) => {
                  console.log(`data POSTED for ${new Date().getFullYear().toString()}` );
                });
    
              resolve();
            }, 0);
          });
        }
      }
    
      runLoop();
    };

    const seedCurrentYearQualifying = async () => {
      const data = await runScrapesQualifying()
      console.log(data)
        async function runLoop() {
          for (let i = 0; i < 1; i++) {
            await new Promise((resolve) => {
              setTimeout(() => {
                db.collection("previous-races")
                  .doc(new Date().getFullYear().toString())
                  .update({qualifying: data})
                  .then((res) => {
                    console.log(`data POSTED for ${new Date().getFullYear().toString()}` );
                  });
      
                resolve();
              }, 0);
            });
        }
      }
      
        runLoop();
      };

      seedCurrentYearQualifying()

