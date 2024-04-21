<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import Highcharts from 'highcharts';

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
        const sectors = [...new Set(data.map(item => item.sector))];
        const years = [...new Set(data.map(item => item.year))];

        const seriesData = sectors.map(sector => {
            return {
                name: sector,
                data: years.map(year => {
                    const salary = data.find(item => item.sector === sector && item.year === year);
                    return salary ? parseFloat(salary.average_salary) : null;
                })
            };
        });

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
