
const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const createSlug = require("./slug.js");
const app = express();
const port = 3000;
const cors = require('cors');
app.use(cors());

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const getData = async (keyword) => {
    let slugs=await createSlug(keyword);
// 8 is gurgaon city
    const BASE_URL = `https://www.99acres.com/search/property/buy/${slugs}?city=8&keyword=${keyword}&preference=S&area_unit=1&res_com=R`; 
 console.log(BASE_URL,"First");
 
    const browser = await puppeteer.launch({
        headless: true, 
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
        args: [
             '--disable-setuid-sandbox',
            '--no-sandbox',
            "--single-process",
           "--no-zygote"
        ]
        // args: [
        //     'proxy-server=200.73.128.156:3128',
        //     '--disable-features=IsolateOrigins,site-per-process',
        //     '--flag-switches-begin',
        //     '--disable-site-isolation-trials',
        //     '--flag-switches-end',
        //     '--disable-features=UserAgentClientHint',
        //     '--autoplay-policy=user-gesture-required',
        //     '--disable-background-networking',
        //     '--disable-background-timer-throttling',
        //     '--disable-backgrounding-occluded-windows',
        //     '--disable-breakpad',
        //     '--disable-client-side-phishing-detection',
        //     '--disable-component-update',
        //     '--disable-default-apps',
        //     '--disable-dev-shm-usage',
        //     '--disable-domain-reliability',
        //     '--disable-extensions',
        //     '--disable-features=AudioServiceOutOfProcess',
        //     '--disable-hang-monitor',
        //     '--disable-ipc-flooding-protection',
        //     '--disable-notifications',
        //     '--disable-offer-store-unmasked-wallet-cards',
        //     '--disable-popup-blocking',
        //     '--disable-print-preview',
        //     '--disable-prompt-on-repost',
        //     '--disable-renderer-backgrounding',
        //     '--disable-setuid-sandbox',
        //     '--disable-speech-api',
        //     '--disable-sync',
        //     '--hide-scrollbars',
        //     '--ignore-gpu-blacklist',
        //     '--metrics-recording-only',
        //     '--mute-audio',
        //     '--no-default-browser-check',
        //     '--no-first-run',
        //     '--no-pings',
        //     '--no-sandbox',
        //     '--no-zygote',
        //     '--password-store=basic',
        //     '--use-gl=swiftshader',
        //     '--use-mock-keychain',
        //     '--disable-web-security',
        //     '--disable-features=BlockInsecurePrivateNetworkRequests',
        //     '--disable-software-rasterizer',
        //     '--disable-gpu',
        //     '--disable-accelerated-2d-canvas',
        //     '--disable-accelerated-video',
        //     '--disable-histogram-customizer',
        //     '--disable-metrics',
        //     '--disable-shared-workers',
        //     '--disable-v8-idle-tasks',
        //     '--disable-logging'
        // ]
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
  
        let apiToken = $('#__apiToken').val();
        console.log(apiToken,"APITOKEN");
        

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
                url: $(item).find(".tupleNew__propertyHeading.ellipsis").attr('href'),
                
            };
            return cardObj;
        }).get();
        
        // console.log(cardItem[0].url);


        let societyTrends = '';
        let localityTrends = '';
        // await page.goto(cardItem[0].url, {
        //     waitUntil: "domcontentloaded",
        //     timeout: 0,
        // });
        await delay(1000);
        try {
            for (let i = 0; i < 1; i++) {
                const { url } = cardItem[i];
                console.log(url, "Url");
                await page.goto(url, {
                    waitUntil: "domcontentloaded",
                    timeout: 0,
                });
             
                await delay(3000);
                // const content1 = await page.content();
                // const $ = cheerio.load(content1);
                await page.waitForFunction('window.__initialData__');
                // Extract the data from window.__initialData__
                const data = await page.evaluate(() => {
                    const initialData = window.__initialData__;
                    
                    if (initialData && initialData.pd && initialData.pd.pageData && initialData.pd.pageData.priceEstimatorDetails) {
                        const priceEstimatorDetails = initialData.pd.pageData.priceEstimatorDetails;
            
                        // Check if priceInsights and priceTrendsResponse exist inside priceEstimatorDetails
                        if (priceEstimatorDetails.priceInsights && priceEstimatorDetails.priceInsights.priceTrends && priceEstimatorDetails.priceInsights.priceTrends.priceTrendsResponse) {
                            const priceTrendsResponse= priceEstimatorDetails.priceInsights.priceTrends.priceTrendsResponse;
                            return priceTrendsResponse;
                            // console.log(priceTrendsResponse);
                        
                        }
                    }
                    return null;
                });
            
            
                societyTrends = data ? JSON.stringify(data.societyTrends) : '';
                
                localityTrends = data && data.localityTrends ? JSON.stringify(data.localityTrends) : '';              
       
            }
        } catch (error) {
            console.log(error);
            
        }
      
        // console.log(s);
        
   await page.close();
   await browser.close();
        return {
            cardItem: cardItem.slice(0, 5),
            societyTrends: societyTrends,
            localityTrends:localityTrends
         }

    } catch (err) {
        console.error("Error while fetching data:", err);
        await page.close();
        await browser.close();
        return [];
    }
};

app.get("/getPriceData", async (req, res) => {
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
