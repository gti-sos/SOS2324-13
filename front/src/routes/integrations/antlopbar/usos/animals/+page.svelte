<script>
    import { onMount } from "svelte";
    import { afterUpdate } from 'svelte';
    
    let animalData = {};
    let chartInitialized = false;
    
    onMount(async () => {
        await getData();
    });
    
    async function getData() {
        const url = 'https://api.api-ninjas.com/v1/animals';
        const options = {
            method: 'GET',
            headers: {
                'X-NinjaAPI-Key': '5GHE89hJhpa+HwvIeMM+qFg==4g61JJEy3roxAdRf',   
            }
        };
    
        const response = await fetch(url, options);
        const data = await response.json();
        // Procesar los datos para extraer la distribución de animales por ubicación
        animalData = processAnimalData(data);
    }
    
    function processAnimalData(data) {
        const distribution = {};
        data.forEach(animal => {
            animal.locations.forEach(location => {
                if (!distribution[location]) {
                    distribution[location] = 0;
                }
                distribution[location]++;
            });
        });
        return distribution;
    }
    
    $: if (Object.keys(animalData).length > 0 && !chartInitialized) {
        renderChart();
        chartInitialized = true;
    }
    
    function renderChart() {
        const labels = Object.keys(animalData);
        const dataValues = Object.values(animalData);
    
        const chartData = {
            labels,
            series: [dataValues]
        };
    
        const options = {
            seriesBarDistance: 10,
            axisX: {
                labelInterpolationFnc: function(value) {
                    return value;
                }
            }
        };
    
        new Chartist.Bar('.ct-chart', chartData, options);
    }
  </script>
    
  <svelte:head>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/chartist/dist/chartist.min.css">
      <script src="https://cdn.jsdelivr.net/npm/chartist/dist/chartist.min.js"></script>
  </svelte:head>
    
  <style>
    .ct-chart {
        height: 300px;
    }
  </style>
    
  <div class="ct-chart"></div>
  
  