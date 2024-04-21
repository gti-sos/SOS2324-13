<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import Highcharts from 'highcharts';

    let API = "/api/v2/salaries-datasets";

    if (dev) API = "http://localhost:10000" + API;

    let errorMsg = "";
    let confMsg = "";

    onMount(() => {
        // Cargar automáticamente la primera gráfica al inicio
        loadSalariesByCountry();
    });

    async function loadData() {
        try {
            const response = await fetch(API + "/loadInitialData", { method: "GET" });
            const status = response.status;
            if (status === 201) {
                getData();
                confMsg = "Datos cargados";
                setTimeout(() => {
                    confMsg = "";
                }, 5000);
            } else {
                errorMsg = `Error: Los datos ya han sido cargados`;
                setTimeout(() => {
                    errorMsg = "";
                }, 5000);
            }
        } catch (error) {
            errorMsg = error.message;
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
        }
    }

    async function getData() {
        try {
            const response = await fetch(API, { method: "GET" });
            const data = await response.json();
            const status = response.status;
            if (status === 200) {
                createChart(data);
                errorMsg = "";
            } else if (status === 404) {
                errorMsg = "No hay datos.";
                setTimeout(() => {
                    errorMsg = "";
                }, 5000);
                confMsg = "";
            }
        } catch (error) {
            errorMsg = error.message;
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
        }
    }

    async function loadSalariesByCountry() {
        // Llamar a la función para cargar la gráfica de pirámide
        try {
            const response = await fetch(API, { method: "GET" });
            const data = await response.json();
            const status = response.status;
            if (status === 200) {
                createPyramidChart(data);
                errorMsg = "";
            } else if (status === 404) {
                errorMsg = "No hay datos.";
                setTimeout(() => {
                    errorMsg = "";
                }, 5000);
                confMsg = "";
            }
        } catch (error) {
            errorMsg = error.message;
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
        }
    }

    async function loadSalariesBySector() {
        // Llamar a la función para cargar la gráfica de líneas
        try {
            const response = await fetch(API, { method: "GET" });
            const data = await response.json();
            const status = response.status;
            if (status === 200) {
                createChart(data);
                errorMsg = "";
            } else if (status === 404) {
                errorMsg = "No hay datos.";
                setTimeout(() => {
                    errorMsg = "";
                }, 5000);
                confMsg = "";
            }
        } catch (error) {
            errorMsg = error.message;
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
        }
    }

    function createChart(data) {
        function createChart(data) {
    // Filtrar los sectores únicos
    const sectors = [...new Set(data.map(item => item.sector))];
    // Filtrar los años únicos
    const years = [...new Set(data.map(item => item.year))];

    // Crear los datos de la serie para cada sector
    const seriesData = sectors.map(sector => {
        return {
            name: sector,
            data: years.map(year => {
                // Encontrar el salario correspondiente para el sector y el año actual
                const salary = data.find(item => item.sector === sector && item.year === year);
                // Retornar el salario o null si no se encuentra
                return salary ? parseFloat(salary.average_salary) : null;
            })
        };
    });

    // Crear la gráfica de líneas
    Highcharts.chart('container', {
        chart: {
            polar: true,
            type: 'line'
        },
        title: {
            text: 'Comparación de salarios por sector',
            x: -80
        },
        xAxis: {
            categories: years.map(String),
            tickmarkPlacement: 'on',
            lineWidth: 0
        },
        yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 0,
            min: 0
        },
        tooltip: {
            shared: true,
            pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y}</b><br/>'
        },
        series: seriesData
    });
}
    }

    function createPyramidChart(data) {
    // Filtrar los países únicos
    const countries = [...new Set(data.map(item => item.country))];

    // Crear los datos para la gráfica de pirámide
    const dataForPyramid = countries.map(country => {
        // Contar la cantidad de salarios para cada país
        const count = data.filter(item => item.country === country).length;
        // Retornar un objeto con el nombre del país y la cantidad de salarios
        return { name: country, y: count };
    });

    // Ordenar los datos por número de salarios de manera descendente
    dataForPyramid.sort((a, b) => b.y - a.y);

    // Crear la gráfica de pirámide
    Highcharts.chart('container', {
        chart: {
            type: 'pyramid'
        },
        title: {
            text: 'Número de salarios por país'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b> ({point.y})',
                    color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
                    softConnector: true
                },
                center: ['50%', '50%'],
                width: '50%',
                height: '80%'
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Número de salarios',
            data: dataForPyramid
        }]
    });
}
    
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<div class="titulo">
    <h2>Gráficas salaries-datasets</h2>
</div>

<div class="botones">
    <button on:click={loadData}>Cargar datos iniciales</button>
    <button on:click={loadSalariesByCountry}>Cargar gráfica de pirámide (salarios por país)</button>
    <button on:click={loadSalariesBySector}>Cargar gráfica de líneas (salarios por sector)</button>
</div>

<figure class="highcharts-figure">
    <div id="container"></div>
</figure>

{#if errorMsg != ""}
    <hr />
    <div class="err">ERROR: {errorMsg}</div>
{/if}
{#if confMsg != ""}
    <hr />
    <div class="conf">{confMsg}</div>
{/if}
