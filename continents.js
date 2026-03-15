const API_BASE = "https://api.worldbank.org/v2/country/";
const INDICATOR = "/indicator/SL.UEM.TOTL.ZS?format=json&per_page=50";

const continentGroups = {
    "NorthAmerica": ["USA", "CAN", "MEX"],
    "Europe": ["DEU", "FRA", "GBR", "ESP", "ITA", "NLD", "BEL"],
    "Asia": ["JPN", "CHN", "IND", "THA", "IDN"],
    "SouthAmerica": ["BRA", "ARG", "COL", "CHL", "PER", "ECU"],
    "Africa": ["ZAF", "NGA", "EGY", "KEN", "ETH", "MAR", "GHA"]
};

const colors = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#6366f1'];

window.addEventListener("load", () => {
    loadSummary();
    for (let continent in continentGroups) {
        loadContinentChart(continent, continentGroups[continent]);
    }
});

async function loadSummary() {
    const regions = { "North America": "NAC", "Europe": "EUU", "Asia": "EAS", "South America": "LCN", "Africa": "SSF" };
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
                data: values,
                backgroundColor: colors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        generateLabels: (chart) => {
                            return chart.data.labels.map((label, i) => ({
                                text: label,
                                fillStyle: chart.data.datasets[0].backgroundColor[i],
                                strokeStyle: chart.data.datasets[0].backgroundColor[i],
                                lineWidth: 0
                            }));
                        }
                    }
                }
            },
            scales: {
                x: { display: false },
                y: { beginAtZero: true }
            }
        }
    });
}

async function loadContinentChart(elementId, countryCodes) {
    const values = [];
    const labels = [];

    for (let code of countryCodes) {
        try {
            const res = await fetch(`${API_BASE}${code}${INDICATOR}`);
            const json = await res.json();
            const recent = json[1].find(d => d.value !== null);
            if (recent) {
                labels.push(recent.country.value);
                values.push(recent.value);
            }
        } catch (e) { console.error(e); }
    }

    new Chart(document.getElementById(`chart-${elementId}`), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: colors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        font: { size: 10 },
                        padding: 15,
                        generateLabels: (chart) => {
                            return chart.data.labels.map((label, i) => ({
                                text: label,
                                fillStyle: chart.data.datasets[0].backgroundColor[i],
                                strokeStyle: chart.data.datasets[0].backgroundColor[i],
                                lineWidth: 0
                            }));
                        }
                    }
                }
            },
            scales: {
                x: { display: false },
                y: { beginAtZero: true }
            }
        }
    });
}