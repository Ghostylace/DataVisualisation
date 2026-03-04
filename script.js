const APIURL = "https://api.worldbank.org/v2/country/all/indicator/SL.UEM.TOTL.ZS?format=json&per_page=17556";
window.addEventListener("load", async () => {
    console.log("Dom Loaded");
    let response = await fetch(APIURL);
    let data = await response.json();
    console.log(data);
    FilterData(data[1]);
})
function FilterData (data){
    console.log(data);
    var dataFilter = [];
    for(let i = 0; i < data.length; i++){
        if(data[i].value){
            dataFilter.push(data[i]);
        }
    }
    console.log(dataFilter);
    SortDataByCountry(dataFilter);
}
function SortDataByCountry(data){
    var dataCountry = [];
    for(var i = 0; i < data.length; i++){
        if(dataCountry.length){
            var j = dataCountry.length -1;  
            if(dataCountry[j].id != data[i].country.id){
                dataCountry.push(data[i].country);
            }
        }
        else{
            dataCountry.push(data[i].country);
        }
    }
    dataCountry.splice(0, 48);
    console.log(dataCountry)
    DisplayCountries(dataCountry);
}
function DisplayCountries(countries){
    var dataHTML = $("#dataTableBody");
    for(var i = 0; i < countries.length; i++){
        var tEl = document.createElement("tr");
        var tIdEl = document.createElement("td");
        var tValEl = document.createElement("td");
        tIdEl.innerHTML = countries[i].id;
        tValEl.innerHTML = countries[i].value;
        tEl.appendChild(tIdEl);
        tEl.appendChild(tValEl);
        dataHTML[0].appendChild(tEl);
    }
}