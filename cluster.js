const express = require('express');
const app = express();
const { Cluster } = require('puppeteer-cluster');
const cheerio = require('cheerio');
const createSlug = require("./slug.js");
const cors = require('cors');
app.use(cors());



app.get("/getPriceData", async (req, res) => {
    const { keyword} = req.query;

    if (!keyword) {
        return res.status(400).send({ error: "Keyword are required" });
    }

    try {
        const data = await getClusterPriceData(keyword);
        res.status(200).send({'message':'Data fetched successfully','data':data });  
    } catch (error) {
        res.status(500).send({ "message": "Failed to fetch data",err:error });
    }
});


/////////////////////////////////////////////////////////////////////////////////////////////////
// Cluster instance setup
let clusterInstance = null;

const getClusterInstance = async () => {
  if (!clusterInstance) {
      clusterInstance = await Cluster.launch({
          concurrency: Cluster.CONCURRENCY_PAGE,
          maxConcurrency: 3,
          timeout: 30000, 
          monitor:true,
          puppeteerOptions: {
              headless: 'new',
              args: [
                  '--use-fake-ui-for-media-stream', // Bypass location access dialog
                  '--disable-infobars', //disable inforbar : chrome is being controlled by a software
                  '--disable-gpu',
                  '--no-sandbox', // Avoids sandboxing for performance
                  '--disable-setuid-sandbox', // Same as above, avoids user namespace errors
                  '--disable-dev-shm-usage', // Prevents crashes in environments with low shared memory
                  '--disable-background-networking',
                  '--disable-background-timer-throttling',
                  '--disable-renderer-backgrounding',
                  '--mute-audio', // Disables audio for minimal resource usage
                  '--disable-extensions', // Prevents loading unnecessary Chrome extensions
              ],
          },
          reuseBrowser: true
      });

      // Log errors for all tasks in the cluster
      clusterInstance.on('taskerror', (err, data) => {
          console.error(`Error in cluster task for ${data}:`, err);
      });
  }
  return clusterInstance;
};



////////////////////////////////////////////////////////////////////
//crawl to get data

const getClusterPriceData = async (keyword) => {

const cluster=await getClusterInstance();
// console.log(cluster);

await cluster.task(async ({ page, data: { keyword } })=>{
 try {
  
  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36"
     );
     let slugs=await createSlug(keyword);
const BASE_URL = `https://www.99acres.com/search/property/buy/${slugs}?city=8&keyword=${keyword}&preference=S&area_unit=1&res_com=R`; 
console.log(BASE_URL);
await page.goto(BASE_URL, {
  waitUntil: ["networkidle2", "domcontentloaded", "load"],
});

await page.waitForNetworkIdle();

// const start=performance.now();


console.log("Checking if page content loads...");
const content = await page.evaluate(() => document.body.innerHTML);
const $ = cheerio.load(content);

let apiToken = $('#__apiToken').val();
console.log(apiToken,"APITOKEN");

// await page.waitForSelector(".tupleNew__priceValWrap", { visible: true });

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
  console.log(cardItem);


let societyTrends = '';
let localityTrends = '';


for (let i = 0; i < 1; i++) {
    const { url } = cardItem[i];
    console.log(url, "Url");
    await page.goto(url, {
        waitUntil: "domcontentloaded",
        timeout: 0,
    });

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

return {
    cardItem: cardItem.slice(0, 5),
    societyTrends: societyTrends,
    localityTrends:localityTrends
 }   
  
}catch(err){

console.error(`An error occured while fetching :${err}`)
}
});

    const result = await cluster.execute({ keyword });
    // await page.close();
    await cluster.close();
console.log(result,"ooooo");

    return result; 
}



const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});