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

seedData();
