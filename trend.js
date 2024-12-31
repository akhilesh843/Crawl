const express = require('express');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

const app = express();
const port = 3000;




app.get("/getData", async (req, res) => {
    fetch("https://www.99acres.com/api-aggregator/v2/project-details?projectIds=PROJECT_319819_R&page=PROJECT_DETAIL_PAGE&platform=DESKTOP&stage=SCROLL_CLICK&crawlableComponents=SEARCH_RESALE_PROPERTIES,SEARCH_RENTAL_PROPERTIES,SEARCH_BUILDER_PROJECTS,COLLABORATIVE_PROJECTS,SIMILAR_PROJECTS,RATINGS_AND_REVIEWS", {
        "headers": {
          "accept": "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,am;q=0.6,hi;q=0.5",
          "apitoken": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MzM1NjA2MDAuNTk0LCJleHAiOjE3MzM1NjA3MjAuNTk0LCJocSI6IjA1NmVhZThkNjE4ZTQ4MzI0YzQ4MDhjMWI0ZWZjNjFkIiwid2IiOiIwZWE3MzQ3OTBhMDYzMTc4NjQ4ZTkzMjc2MzliZjBlZSJ9.ULMT3ruzdARUajolsE5S8iKwiouRVigYPRuTbtw4MTM",
          "authorizationtoken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiV1FKWjZiQ1Q2ZHBkU0ZWYjhibHhkSGZwTFk0TTRNV3gyL2Zkem1EcWQ3clJBRUNZNEFocUZmRng3Z1cwNXF0ckwvZldBaElhMVVhNDJ4VGtIZUdndC9nODMrbmd4M2N4L3phV2FhZlpRQ3pnU1RqU2FKVjA1RE9EK01jZzBOTkRYc3NCdHI4L3JlcHRLUUdBTjlpQ3l6NmFRTWZWZEd6TWdHcURDRVJCWlBlRWRiWnFodXZ4OGFSNmU2dHJ6VEFBTFUzSXFNdG1hR1VSWTlnWG16OGNYYkY0Vmt1bVVqaHR2aUs3OXdRTXRWdGVESDMrUFpVTTd3KzlZeWZ3SEp3TDdoeEw3N3hiOGU2aFZrM1RKN2FBS3hIcm90bTdwR1QrN1lvdkpHSGRldWl0QmFnYithcFQyeVhmMGpOVFVZRzNrV01TMlZXeHdUM2VQWjFSckpqa2VZaWM4QkVrSU9rNUFTZlhsdnZ2bkpzUWdaVlhDNUZMS3BzM0tzQnVmKzc5IiwiczEiOiI4RkhuOU5ESGRxVXg4Yi9Ub21BTkdrK0tPaHpGNGdCMCIsInMyIjoiRXZhbWpiamxYK1ZvMWUzK3VvUTZEVnhjK2RMZ1BHdjQiLCJzMyI6IllscDVXRmR1YTAxR0wyZzVXVVJ6TTNCaE1tcEROMVZEWWtaMlFpdGlWM2RDUmtwNVUzWkpRVUVyVlZwU1FVWnJibkpGSzJaaFdqRmxiVkkxZEhSaVYzbzFNa05MWTBGdVNWcHFNVTAxT0ZRMVpXZ3ZZVm9yU2s0eWFHbERlVmszYjBGbWQzZFpVbXhwWWtkTUsxQnNSRlphZUN0Wk9UVk9lRVpqVlRCMFkzbEtPR05pYlZCUVpWUXlSbkY2VTNKTWFrNHdOa1Z3TVRWM2RuSllhWHBYYkRoSFVEYzVVblpSWmxkeFdWcGFWVVp4WWk5R2FWZFpXWGd6Y0RNd1NqQmhVazFVYVVWV1kxRlNlRkozZUdkSFZYa3pSa05rUjJFd09VdHhWMGhXVjNKTFJUTkNlUzlOTVN0R1ZsQkxVVWRJVmpSaU5YVlJaV05RUm5oTVVWb3lSRlZyYzBOYVN6VlNTWGgyUlZjMVNGVnhNbVZVUlVsbU1WUk9aMlJTYzBSMlNEazFWVE00V0RJemVFVllTMUk1YVVWc1FteHBVemh1YTJsekwybDJOVzFEYkVNNE5FTnZjREpGS3pZdmJrWkdhbEp1U1dsMUszQTRaR3BZUVhSQ05ucEVjSFJHYm1Wb05Ib3dQUW89IiwidiI6IjIiLCJpYXQiOjE3MzM1NjA1NzcsImV4cCI6MTczMzU2MTE3N30.kx-AQYw2qsz-UbZa0mVyQZaHclRYqPOWdfKqiE8ISYM",
          "deviceid": "87a5861c7c24d774319a8c0562bd1fe8",
          "pagename": "XID",
          "platform": "desktop",
          "priority": "u=1, i",
          "sec-ch-ua": "\"Google Chrome\";v=\"131\", \"Chromium\";v=\"131\", \"Not_A Brand\";v=\"24\"",
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": "\"Windows\"",
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "cookie": "99_ab=41; GOOGLE_SEARCH_ID=4700051733463237876; _gcl_au=1.1.515884953.1733463243; _gid=GA1.2.1773957881.1733463243; _hjSessionUser_3171461=eyJpZCI6IjY0NmU4NThkLWUyMWItNTljYS04NjI3LWNhOTRhNDVkNWM0NSIsImNyZWF0ZWQiOjE3MzM0NjMyNDMzODksImV4aXN0aW5nIjp0cnVlfQ==; xAB=SuperControlGroup%3D42%3AN%2CExperimentA%3D49%3AY%2CExperimentB%3D23%3AY%2CExperimentC%3D84%3AN%2CExperimentD%3D64%3AN%2CExperimentE%3D44%3AN; showCookieBanner=1; hp_bcf_data=; __utmc=267917265; __utmz=267917265.1733550874.3.2.utmgclid=Cj0KCQiA3sq6BhD2ARIsAJ8MRwUiwjFIHuySDqsjVRaWprz5BajsMnfGOCmLnCxdJc-40fyAPRh-9IwaAg4_EALw_wcB|utmccn=(not%20set)|utmcmd=(not%20set)|utmctr=(not%20provided); _gac_UA-224016-1=1.1733550874.Cj0KCQiA3sq6BhD2ARIsAJ8MRwUiwjFIHuySDqsjVRaWprz5BajsMnfGOCmLnCxdJc-40fyAPRh-9IwaAg4_EALw_wcB; _gcl_gs=2.1.k1$i1733550867$u145873660; landmark_toast=true; _clck=urco2z%7C2%7Cfri%7C0%7C1801; 99_ab=41; acceptedMobileDsiclaimer=true; _gcl_aw=GCL.1733551843.Cj0KCQiA3sq6BhD2ARIsAJ8MRwUiwjFIHuySDqsjVRaWprz5BajsMnfGOCmLnCxdJc-40fyAPRh-9IwaAg4_EALw_wcB; session_source=; __utma=267917265.1295335463.1733463243.1733550874.1733557042.4; _hjSession_3171461=eyJpZCI6ImI1ZjIxZGQyLWE1NWUtNDU2Yy04MGJkLWMzMzNhNWIyODI1YSIsImMiOjE3MzM1NTcwNDI5OTYsInMiOjAsInIiOjAsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; _sess_id=hkU6axVOGZ28UvprEvjp3MaG%2F3BqXyTFKLEX%2BNBt1dzODNSp2oppo4AlOiGLI35Z1oOs2A5blHu%2FR83G1PY3EQ%3D%3D; bm_mi=4B67B856DB529D7B5F56BBBFD4AC5699~YAAQfM8uF17ngzOTAQAABQAvoBoF1TyG1WyG4+FwDMpKtTtCNndxlDlrLzPCCIyT3Ln+yyJS9XsH7D2/58t5EOoD6agzesi7QxWM/7Knd5kQC2PXHEapHFh3lmdrVeSHrfiVm3TXB1ECtEzNHcBInAa1AtspZhZy1C5788oObqYrFITO5WmAra8SktLkCiCuScZpfIWDL8lR19WTSJ9EVNJqhMOKepx8cEOJDBFaZaHF7nuo4aA722sfbz3xRTyv4no0nxFOO8G4C2HKveTayeLpoBLepKjLHChTTkKhH+JTMOyLHa5C3FIi42KajgIrd3AimPfLpH1BAaafoLccWHrIwzWwbKfM3XFTzoUbKwPu0dwfxDLAkU31+dO4kLC/o2Q2uDpggucOIcbea9LEikLun/w=~1; ak_bmsc=A8F8C19FBC06EE32E31DEBC5847CC846~000000000000000000000000000000~YAAQfM8uF+/ngzOTAQAAzwYvoBpQepTn6beudE2q1QDG89CU3ewoRGy2oIobmhSAa7J7/cfV6Nei0sNh/BIZgO3CEECWpoFDs8BmIRzMmkwF6Kdt8tOXPFNzI3p4zdI7N14PDvmQxXRP7QBJJcaqn/JqHdenXuNkYncmOJTl67VVAASPs7O8+Ea05Aer2NVp57VR10KZ7ob2qGno5OAqFiRsRiTLXiQuKeLARuvWa41G8ZNkVJNgXvhDSIZ9OTYjxW+GbBqCG72+7gKCwUNvXb0mKSF64ZvX9d7AHuFjs98ZyclK5e4gpsAp2f5Qic98JDttFtjcxTn+ExtplZ1xy14B6B1lA9iyP27qnGu4Kz8BVcPzHT0Y59Hcl9IjOQ+bJe7GpKmDTvx5tzYfQ1WoUJTdYOUT/ZMTvyrhx8S5cdzy+T3WhF2w839W0trJL1rk52VEgKPXyoEEiG68a4AjQQJzbehmGGajNx0yH5bbYgVJWPK5vOJVlPfP1z4Z0Dy1+vGf48QXZMmgw2QvTPu/Su3dGyMKvgfjNKR+mL0y+cF4E57mLagY1W/lZbwnTziwzFPhYyg=; __utmb=267917265.9.10.1733557042; _ga=GA1.2.1295335463.1733463243; _uetsid=b4371310b39311ef9d423b9e1a70341f; _uetvid=b4373bc0b39311ef91548fa03a1ff8f8; _clsk=1um5568%7C1733560047062%7C11%7C0%7Cr.clarity.ms%2Fcollect; i_f_c=N; _ga_9QHC0XEKPS=GS1.1.1733556760.5.1.1733560595.60.0.0; bm_sv=EEC0CC7FEC92C76FFF2A761065A55F10~YAAQRV06F6nLOZyTAQAA7oZDoBrw102kpM74Kx8YUgW8XbpAyIhswfzrHzx1OlIgEAi3cPmosSH2H6oe7o+in8phDsQa5XFuvaHCK6HChznxD2CXll3oFqKe64McHk3d1QSvofJyVvbvxf3FFoQ1ZAH9E3iyCt5mHGednfIPBp95c/zQvRVte7qwKyfCqXQLYgdwMULSm8W01xg0Jx3aDiQWtvUxaZvG/Sp2a7cv+FLVJHFhyd92PxmEG1EY8a7mooY=~1",
          "Referer": "https://www.99acres.com/shapoorji-pallonji-joyville-gurugram-sector-102-gurgaon-npxid-r319819",
          "Referrer-Policy": "strict-origin-when-cross-origin"
        },
        "body": null,
        "method": "GET"
      });
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});



