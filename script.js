const APIURL = "https://api.worldbank.org/v2/country/all/indicator/SL.UEM.TOTL.ZS?format=json&per_page=17556";
window.addEventListener("load", async () => {
    console.log("Dom Loaded");
    let response = await fetch(APIURL);
    let data = await response.json();
    console.log(data);
})