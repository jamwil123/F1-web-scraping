const puppeteer = require('puppeteer')
const { convertThreeCharsCountry } = require('../utils/long-country-convert')



async function driverStandingsScrape() {
    
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    // await page.goto(`https://www.formula1.com/en/results.html/${new Date().getFullYear().toString()}/drivers.html`)
    await page.goto(`https://www.formula1.com/en/results.html/2022/drivers.html`)
    // await page.exposeFunction("stringConvert", convertThreeCharsCountry);
    

    let pointsData = await page.evaluate(async() =>{
        const firstNames = Array.from(document.querySelectorAll('body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content > div > table > tbody > tr > td > a > span.hide-for-tablet')).map(x => x.textContent)
        const lastNames = Array.from(document.querySelectorAll('body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content > div > table > tbody > tr > td > a > span.hide-for-mobile')).map(x => x.textContent)
        const driversPoints = Array.from(document.querySelectorAll('body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content > div > table > tbody > tr > td.dark.bold')).map(x => x.textContent)
        const position = Array.from(document.querySelectorAll('body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content > div > table > tbody > tr > td:nth-child(2)')).map(x => x.textContent)
        const car = Array.from(document.querySelectorAll('body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content > div > table > tbody > tr > td:nth-child(5) > a')).map(x => x.textContent)
        const nationality = Array.from(document.querySelectorAll('body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content > div > table > tbody > tr > td.dark.semi-bold.uppercase')).map(x => x.textContent)
    

        if(firstNames.length === 0){
            return false
        }
        let driversNames = firstNames.map((x, i)=>{
            let name = `${x} ${lastNames[i]}`
            return name
        })


        return driversNames.map((x, i)=>{
            return {[position[i]]:{points: parseInt(driversPoints[i]), 
            name: x,
            nationality: nationality[i],
            car:car[i]}}
        })

    })

   
    
    await browser.close()
    return pointsData
}

driverStandingsScrape()


module.exports = {driverStandingsScrape}

