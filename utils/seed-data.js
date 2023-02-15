const db = require('./db')


// console.log(schema[0]["2022"])

const seedData = () =>{

    async function runLoop() {
        for (let i = 1950; i <= 2022; i++) {
          await new Promise(resolve => {
            setTimeout(() => {
                const data = require(`../data/race-results-${i.toString()}`)
                let year = Object.keys(data)[0]
                        db
                                .collection('previous-races')
                                .doc(year)
                                .set(data[year]).then((res)=>{
                                    console.log(res)
                                })


              resolve();
            }, 0);
          });
        }
      }
      
runLoop()
    }


   

seedData()