<svelte:head>
    <script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";
    let data1;
    let data2;

    onMount(async () => {
        data1 = await getMentalHealthData();
        data2 = await getCovidData();
        generateChart(); 
    });

    async function getMentalHealthData() {
        const url = "https://sos2324-13.ew.r.appspot.com/api/v2/mentalhealth-datasets/Kiribati"; 
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data; 
        } catch (err) {
            console.log(err);
        }
    }

    async function getCovidData() {
        const url = "https://covid-19.dataflowkit.com/v1/Kiribati";
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (err) {
            console.log(err);
        }
    }

    async function generateChart() {
        const mentalHealthData = data1[0];
        const covidData = data2;

        // Eliminar comas y convertir a número
        const totalDeaths = parseFloat(covidData["Total Deaths_text"].replace(/,/g, ""));
        const depression = mentalHealthData.depression;
        const schizophrenia = mentalHealthData.schizophrenia;

        const data = [
            {
                x: ["Total Deaths of COVID-19", "Depression", "Schizophrenia"],
                y: [totalDeaths, depression, schizophrenia],
                type: "bar",
                marker: {
                    color: ["blue", "green", "red"]
                }
            }
        ];

        const layout = {
            title: "Total muertes de COVID-19, depresion, y esquizofrenia en Kiribati",
            xaxis: {
                title: "Attribute"
            },
            yaxis: {
                title: "Value"
            }
        };

        Plotly.newPlot("chart-container", data, layout);
    }
</script>

<h1>Total muertes de COVID-19, depresion, y esquizofrenia en Kiribati</h1>
<div id="chart-container"></div>
