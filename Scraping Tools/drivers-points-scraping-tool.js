const puppeteer = require('puppeteer')

async function driverPointsScrape() {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.formula1.com/en/results.html/2022/drivers.html')


    pointsData = await page.evaluate(()=>{
        const firstNames = Array.from(document.querySelectorAll('body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content > div > table > tbody > tr > td > a > span.hide-for-tablet')).map(x => x.textContent)
        const lastNames = Array.from(document.querySelectorAll('body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content > div > table > tbody > tr > td > a > span.hide-for-mobile')).map(x => x.textContent)
        const driversPoints = Array.from(document.querySelectorAll('body > div.site-wrapper > main > article > div > div.ResultArchiveContainer > div.resultsarchive-wrapper > div.resultsarchive-content > div > table > tbody > tr > td.dark.bold')).map(x => x.textContent)

        let driversNames = firstNames.map((x, i)=>{
            let name = `${x} ${lastNames[i]}`
            return name
        })

        return driversNames.map((x, i)=>{
            return {[x]:{'Points': driversPoints[i]}}
        })

    })
    console.log(pointsData, 'names')
    
    await browser.close()
}

module.exports={driverPointsScrape}