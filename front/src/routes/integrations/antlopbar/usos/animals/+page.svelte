<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/chartist/dist/chartist.min.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/chartist/dist/chartist.min.css">
</svelte:head>

<script>
    import { onMount } from "svelte";

    let animalData = {};

    onMount(async () => {
        await getData();
    });

    async function getData() {
        const url = 'https://api.api-ninjas.com/v1/animals';
        
        const options = {
            method: 'GET',
            headers: {
                'X-NinjaAPI-Key': 'GHE89hJhpa+HwvIeMM+qFg==4g61JJEy3roxAdRf',
            }
        };

        try {
            const response = await fetch(url, options);
            animalData = await response.json();
            createGraph(animalData);
        } catch (error) {
            console.error(error);
        }
    }

    function createGraph(animalData) {
        const data = {
            labels: animalData.map(animal => animal.name),
            series: [animalData.map(animal => animal.locations.length)]
        };

        const options = {
            axisX: {
                offset: 60
            },
            axisY: {
                offset: 80
            }
        };

        new Chartist.Bar('.ct-chart', data, options);
    }
</script>

<style>
    .ct-chart {
        width: 100%;
        height: 360px;
        margin-bottom: 20px;
    }

    h1 {
        font-family: '';
        font-size: 60px;
        color: #290ef5;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
    }
</style>

<br>
<h1>Cantidad de ubicaciones por animal</h1>
<div class="ct-chart"></div>
