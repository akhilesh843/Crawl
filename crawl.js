const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const createSlug  = require("./slug.js");
const app = express();
const port = 3000;



const getData = async (keyword) => {
    let slugs=await createSlug(keyword);
// 8 is gurgaon city  emaar-gurgaon-greens-3bhk
    const BASE_URL = `https://www.99acres.com/search/property/buy/${slugs}?city=8&keyword=${keyword}&preference=S&area_unit=1&res_com=R`; 
 console.log(BASE_URL);
 
    const browser = await puppeteer.launch({
        headless: true, 
        // args: ['--no-sandbox', '--disable-setuid-sandbox']
        args: [
            'proxy-server=200.73.128.156:3128',
            '--disable-features=IsolateOrigins,site-per-process',
            '--flag-switches-begin',
            '--disable-site-isolation-trials',
            '--flag-switches-end',
            '--disable-features=UserAgentClientHint',
            '--autoplay-policy=user-gesture-required',
            '--disable-background-networking',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-breakpad',
            '--disable-client-side-phishing-detection',
            '--disable-component-update',
            '--disable-default-apps',
            '--disable-dev-shm-usage',
            '--disable-domain-reliability',
            '--disable-extensions',
            '--disable-features=AudioServiceOutOfProcess',
            '--disable-hang-monitor',
            '--disable-ipc-flooding-protection',
            '--disable-notifications',
            '--disable-offer-store-unmasked-wallet-cards',
            '--disable-popup-blocking',
            '--disable-print-preview',
            '--disable-prompt-on-repost',
            '--disable-renderer-backgrounding',
            '--disable-setuid-sandbox',
            '--disable-speech-api',
            '--disable-sync',
            '--hide-scrollbars',
            '--ignore-gpu-blacklist',
            '--metrics-recording-only',
            '--mute-audio',
            '--no-default-browser-check',
            '--no-first-run',
            '--no-pings',
            '--no-sandbox',
            '--no-zygote',
            '--password-store=basic',
            '--use-gl=swiftshader',
            '--use-mock-keychain',
            '--disable-web-security',
            '--disable-features=BlockInsecurePrivateNetworkRequests',
            '--disable-software-rasterizer',
            '--disable-gpu',
            '--disable-accelerated-2d-canvas',
            '--disable-accelerated-video',
            '--disable-histogram-customizer',
            '--disable-metrics',
            '--disable-shared-workers',
            '--disable-v8-idle-tasks',
            '--disable-logging'
        ]
    });
    
    // const context = await browser.createIncognitoBrowserContext();
    // const page = await context.newPage();
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768});
    try {
        await page.setUserAgent(
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36"
        );

        await page.goto(BASE_URL, {
            waitUntil: ["networkidle2", "domcontentloaded", "load"],
        });

        console.log("helloc cheking still");
        const content = await page.evaluate(() => document.body.innerHTML);
        const $ = cheerio.load(content);
  
        let cardItem = $("body").find(".tupleNew__contentWrap").map((index, item) => {
            let cardObj = {
            //   image: $(item).find(".gagoLZ >  img").attr("src"),
                heading: $(item).find(".tupleNew__locationName.ellipsis").text(),
                title: $(item).find(".tupleNew__propertyHeading.ellipsis").attr('title'),
                perSqFt: $(item).find(".tupleNew__perSqftWrap.ellipsis").text(),
                price: $(item).find(".tupleNew__priceValWrap").text(),
                sqft: $(item).find(".tupleNew__area1Type").text(),
                areaTypeSq: $(item).find(".tupleNew__area2Type.ellipsis").text(),
                areaType: $(item).find(".tupleNew__areaType").text(),
                url: $(item).find(".tupleNew__propertyHeading.ellipsis").attr('href')
            };
            return cardObj;
        }).get();
        
        console.log(cardItem);
        await page.close();
        await browser.close();
         return cardItem = cardItem.slice(0, 10);
   

        
   

    } catch (err) {
        console.error("Error while fetching data:", err);
        await page.close();
        await browser.close();
        return [];
    }
};

app.get("/getData", async (req, res) => {
    const { keyword} = req.query;

    if (!keyword) {
        return res.status(400).send({ error: "Keyword are required" });
    }

    try {
        const data = await getData(keyword);
        res.status(200).send({'message':'Data fetched successfully','data':data });  
    } catch (error) {
        res.status(500).send({ error: "Failed to fetch data" });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
