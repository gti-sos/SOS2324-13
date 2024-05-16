<svelte:head>
    <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';

    let data1;
    let data2;

    onMount(async () => {
        data1 = await getMentalHealthData();
        data2 = await getDataProxy();
        google.charts.load('current', {'packages':['corechart']});
        google.charts.setOnLoadCallback(generateChart);
    });

    async function getMentalHealthData() {
        const url = "https://sos2324-13.ew.r.appspot.com/api/v2/mentalhealth-datasets/Spain"; 
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data; 
        } catch (err) {
            console.log(err);
        }
    }

    async function getDataProxy() {
        try {
            const options = {
                method: "GET",
                headers: {
                    "X-Api-Key": "GHE89hJhpa+HwvIeMM+qFg==4g61JJEy3roxAdRf",
                },
            };
            const response = await fetch("/proxyALB", options);
            const data = await response.json();
            return data;
        } catch (err) {
            console.log(err);
        }
    }

    function generateChart() {
        const alcoholism = data1[0].alcoholism;
        const bipolar_disorder = data1[0].bipolar_disorder;
        const temperature = data2.temp;

        var data = google.visualization.arrayToDataTable([
            ['Categoria', 'Valor'],
            ['Alcoholismo', alcoholism],
            ['Bipolarismo', bipolar_disorder],
            ['Temperatura (°C)', temperature]
        ]);

        var options = {
            title: 'Alcoholismo, Bipolaridad, y temperatura en España',
            hAxis: {
                title: 'Value'
            },
            vAxis: {
                title: 'Category'
            }
        };

        var chart = new google.visualization.BarChart(document.getElementById('chart-container'));
        chart.draw(data, options);
    }
</script>

<h1>Alcoholismo, Bipolaridad, y temperatura en España</h1>
<div id="chart-container" style="width: 100%; height: 400px;"></div>
