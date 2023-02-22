const db = require("./db");

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

// seedCurrentDriversData()

seedCurrentTeamsData()
