const puppeteer = require('puppeteer')
const { convertThreeCharsCountry } = require('../utils/long-country-convert')



async function teamStandingsScrape() {
    
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    // await page.goto(`https://www.formula1.com/en/results.html/${new Date().getFullYear().toString()}/drivers.html`)
    await page.goto(`https://www.formula1.com/en/results.html/2022/team.html`)
    // await page.exposeFunction("stringConvert", convertThreeCharsCountry);
    

    let pointsData = await page.evaluate(async() =>{
        const teamName = Array.from(document.querySelectorAll('body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content > div > table > tbody > tr > td:nth-child(3) > a')).map(x => x.textContent)
        const teamPoints = Array.from(document.querySelectorAll('body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content > div > table > tbody > tr > td.dark.bold')).map(x => x.textContent)
        const position = Array.from(document.querySelectorAll('body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content > div > table > tbody > tr > td:nth-child(2)')).map(x => x.textContent)
       
    

        if(teamName.length === 0){
            return false
        }

        return teamName.map((x, i)=>{
            return {[position[i]]:{points: parseInt(teamPoints[i]), 
            name: teamName[i]}}
        })

    })

   
    
    await browser.close()
    return pointsData
}

teamStandingsScrape()


module.exports = {teamStandingsScrape}

