<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/data.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/chartist/dist/chartist.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chartist/dist/chartist.min.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API = "/api/v2/salaries-datasets";
    let APIproxy = "/proxyALL";
    let metalPrices = [];

    if (dev) API = "http://localhost:10000" + API;

    

    async function fetchMetalPrices() {
    const url = 'https://live-metal-prices.p.rapidapi.com/v1/latest/XAU,XAG,PA,PL,GBP,EUR/EUR';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '9e8ab8c42bmsh8e20b25b9d62171p1aa1d2jsn26e4918af5b7',
        'X-RapidAPI-Host': 'live-metal-prices.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      // Aquí procesamos los datos para obtener los precios de las distintas monedas
      metalPrices = Object.entries(result.rates).map(([currency, rate]) => ({ currency, rate }));
      console.log(metalPrices);
      createChart();
    } catch (error) {
      console.error(error);
    }
  }

  function createChart() {
    const labels = metalPrices.map(item => item.currency);
    const series = metalPrices.map(item => item.rate);

    new Chartist.Bar('.ct-chart', {
      labels: labels,
      series: [series]
    });
  }

  onMount(() => {
    fetchMetalPrices();
  });
</script>

<div class="ct-chart"></div>