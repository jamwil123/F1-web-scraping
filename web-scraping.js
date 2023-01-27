const puppeteer = require('puppeteer')
const fs = require('fs/promises')
const axios = require('axios');
const {driverPointsScrape} = require('./drivers-points-scraping-tool')
let pointsData 
let mainURL = 'https://f1-api.netlify.app/.netlify/functions'
let addNewValuesSubURL = {subURL: '/api/drivers/data/add_data', method: 'patch'} 
let getAllDriversData = {subURL: '/api/drivers', method: 'get'} 


// while (true) {
//     console.log('in the while');
//     if(new Date().getDay() === 5){
//         console.log('in the if');
//         Promise.all(start().then((res)=>{
//         callAPI(names, addNewValuesSubURL.subURL)
//         }))
//         setTimeout(() => {
//             console.log("30 seconds have passed");
//           }, 5 * 1000);
//     }
// }

function asyncLoop(i) {
    driverPointsScrape().then((res)=>{
                callAPI(pointsData, addNewValuesSubURL.subURL)
                }).then(() => {
      setTimeout(() => {
        asyncLoop(i);
        console.log('5 seconds delay are over')
      }, 5 * 1000);
    });
  }
  
  asyncLoop(0);




async function callAPI(data, subURL) {
    console.log(`${mainURL}${addNewValuesSubURL.subURL}`);
    
    axios.patch(`${mainURL}${subURL}`, data)
  .then(response => {
    // handle success
    console.log(response.data);
  })
  .catch(error => {
    // handle error
    console.log(error.data);
  })

}