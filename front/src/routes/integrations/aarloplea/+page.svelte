<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/data.js"></script>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/chartist/dist/chartist.min.css">
    <script src="https://cdn.jsdelivr.net/npm/chartist/dist/chartist.min.js"></script>
</svelte:head>

<script>
        import { onMount } from 'svelte';
    

    const url = 'https://free-nba.p.rapidapi.com/players?page=0&per_page=25';
const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Key': '9e8ab8c42bmsh8e20b25b9d62171p1aa1d2jsn26e4918af5b7',
    'X-RapidAPI-Host': 'free-nba.p.rapidapi.com'
  }
};

onMount(async () => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();

    // Procesar los datos para contar el número de jugadores por nacionalidad
    const nationalityCounts = {};
    data.data.forEach(player => {
      const nationality = player.country;
      nationalityCounts[nationality] = (nationalityCounts[nationality] || 0) + 1;
    });

    // Preparar los datos para la gráfica de barras
    const labels = Object.keys(nationalityCounts);
    const series = labels.map(label => nationalityCounts[label]);

    // Crear la gráfica de barras con Chart.js
    new Chartist.Bar('.ct-chart', {
      labels,
      series: [series]
    });
  } catch (error) {
    console.error(error);
  }
});
</script>
