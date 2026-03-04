const APIURL = "https://api.worldbank.org/v2/country/all/indicator/SL.UEM.TOTL.ZS?format=json&per_page=15000";
let globalData = [];
let myChart = null;

window.addEventListener("load", async () => {
    const response = await fetch(APIURL);
    const json = await response.json();
    globalData = json[1];
    
    // Filter out entries with no values and get unique countries
    const countries = getUniqueCountries(globalData.filter(d => d.value !== null));
    displayCountries(countries);
});

function getUniqueCountries(data) {
    const unique = [];
    const map = new Map();
    for (const item of data) {
        if (!map.has(item.country.id)) {
            map.set(item.country.id, true);
            unique.push(item.country);
        }
    }
    return unique.slice(48); // Skipping aggregate regions like your original code
}

function displayCountries(countries) {
    const tbody = $("#dataTableBody");
    countries.forEach(country => {
        const row = $(`<tr data-id="${country.id}">
            <td><strong>${country.id}</strong></td>
            <td>${country.value}</td>
        </tr>`);
        
        row.on('click', () => updateChart(country.id, country.value));
        tbody.append(row);
    });
}

function updateChart(countryId, countryName) {
    $("#countryTitle").text(countryName);
    
    // Filter data for the specific country and sort by year
    const countryData = globalData
        .filter(d => d.country.id === countryId && d.value !== null)
        .sort((a, b) => a.date - b.date);

    const labels = countryData.map(d => d.date);
    const values = countryData.map(d => d.value);

    if (myChart) myChart.destroy();

    const ctx = document.getElementById('unemploymentChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Unemployment Rate (%)',
                data: values,
                borderColor: '#2563eb',
                backgroundColor: 'rgba(37, 99, 235, 0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}