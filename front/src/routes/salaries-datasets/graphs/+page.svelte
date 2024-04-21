<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import Highcharts from 'highcharts/highcharts';
    import HighchartsBubble from 'highcharts/modules/bubble';


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
        const countries = [...new Set(data.map(item => item.country))];

        Highcharts.chart('container', {
            chart: {
                type: 'bubble'
            },
            title: {
                text: 'Promedio de salarios por país',
                align: 'center'
            },
            xAxis: {
                title: {
                    text: 'Año'
                }
            },
            yAxis: {
                title: {
                    text: 'País'
                }
            },
            tooltip: {
                headerFormat: '<b>{series.name}</b><br>',
                pointFormat: '{point.x} año, {point.y} país: {point.value}'
            },
            series: countries.map(country => ({
                name: country,
                data: data.filter(item => item.country === country).map(item => ({
                    x: item.year,
                    y: Math.random() * 100, // Solo para propósitos de demostración
                    z: parseFloat(item.average_salary)
                }))
            }))
        });
    }

    HighchartsBubble(Highcharts);

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
