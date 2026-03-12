const API_BASE = "https://api.worldbank.org/v2/country/";
const INDICATOR = "/indicator/SL.UEM.TOTL.ZS?format=json&per_page=50";

const continentGroups = {
    "NorthAmerica": ["USA", "CAN", "MEX"],
    "Europe": ["DEU", "FRA", "GBR", "ESP", "ITA", "NLD", "BEL"],
    "Asia": ["JPN", "CHN", "IND", "KOR", "VNM", "THA", "IDN"],
    "SouthAmerica": ["BRA", "ARG", "COL", "CHL", "PER", "ECU"],
    "Africa": ["ZAF", "NGA", "EGY", "KEN", "ETH", "MAR", "GHA"]
};

const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#6366f1'];

window.addEventListener("load", () => {
    loadSummary();
    for (let continent in continentGroups) {
        loadContinentPieChart(continent, continentGroups[continent]);
    }
});

async function loadSummary() {
    const regions = { "N. America": "NAC", "EU": "EUU", "Asia": "EAS", "LatAm": "LCN", "Africa": "SSF" };
    const values = [];
    const labels = Object.keys(regions);

    for (let r in regions) {
        const res = await fetch(`${API_BASE}${regions[r]}${INDICATOR}`);
        const json = await res.json();
        const recent = json[1].find(d => d.value !== null);
        values.push(recent ? recent.value : 0);
    }

    new Chart(document.getElementById('summaryChart'), {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: "Percentage",
                data: values,
                backgroundColor: colors,
                hoverOffset: 15
            }]
        },
        options: {
            maintainAspectRatio: false,
            plugins: { legend: { position: 'right' } }
        }
    });
}

// NEW PIE CHARTS FOR CONTINENTS
async function loadContinentPieChart(elementId, countryCodes) {
    const values = [];
    const labels = [];

    for (let code of countryCodes) {
        try {
            const res = await fetch(`${API_BASE}${code}${INDICATOR}`);
            const json = await res.json();
            // Get only the most recent value
            const recent = json[1].find(d => d.value !== null);
            if (recent) {
                labels.push(code); // Using Country Code as label
                values.push(recent.value);
            }
        } catch (e) { console.error("Error fetching " + code, e); }
    }

    new Chart(document.getElementById(`chart-${elementId}`), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: "Percentage",
                data: values,
                backgroundColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { boxWidth: 12, font: { size: 10 } }
                }
            }
        }
    });
}