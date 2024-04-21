<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API = "/api/v2/salaries-datasets";

    if (dev) API = "http://localhost:10000" + API;

    let errorMsg = "";
    let confMsg = "";

    onMount(() => {
        getData();
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
                createPackedBubbleChart(data);
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

    function createPackedBubbleChart(data) {
        const countries = [...new Set(data.map(item => item.country))];

        Highcharts.chart('container', {
            chart: {
                type: 'packedbubble'
            },
            title: {
                text: 'Promedio de salarios por país',
                align: 'center'
            },
            tooltip: {
                useHTML: true,
                pointFormat: '<b>{point.name}:</b> {point.value}'
            },
            plotOptions: {
                packedbubble: {
                    minSize: '13%',
                    maxSize: '35%',
                    zMin: 0,
                    zMax: 300,
                    layoutAlgorithm: {
                        gravitationalConstant: 0.05,
                        splitSeries: true,
                        seriesInteraction: false,
                        dragBetweenSeries: true,
                        parentNodeLimit: true
                    },
                    dataLabels: {
                        enabled: true,
                        format: '{point.name}',
                        filter: {
                            property: 'y',
                            operator: '>',
                            value: 0
                        },
                        style: {
                            color: 'black',
                            textOutline: 'none',
                            fontWeight: 'normal'
                        }
                    }
                }
            },
            series: countries.map(country => ({
                name: country,
                data: data.filter(item => item.country === country).map(item => ({
                    name: item.year,
                    value: parseFloat(item.average_salary)
                }))
            }))
        });
    }

    function createPyramidChart(data) {
        const sectors = [...new Set(data.map(item => item.sector))];

        const dataForPyramid = sectors.map(sector => {
            const count = data.filter(item => item.sector === sector).length;
            return { name: sector, y: count };
        });

        dataForPyramid.sort((a, b) => b.y - a.y); // Ordenar los datos por número de trabajos descendente

        Highcharts.chart('container', {
            chart: {
                type: 'pyramid'
            },
            title: {
                text: 'Número de trabajos por sector'
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
                name: 'Número de trabajos',
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
