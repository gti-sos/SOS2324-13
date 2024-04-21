<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API = "/api/v2/wris-datasets";

    if (dev) API = "http://localhost:10000" + API;

    let errorMsg = "";
    let confMsg = "";

    onMount(() => {
        getData();
    });

    async function getInitialData() {
        let response = await fetch(API + "/loadInitialData", {
            method: "GET",
        });
        const status = await response.status;
        if (status == 201) {
            confMsg = "Datos creados en la base de datos correctamente";
            errorMsg = "";
            getData();
        } else if (status == 409) {
            confMsg = "";
            errorMsg = "Ya se han creado los datos en la base de datos";
        } else {
            confMsg = "";
            errorMsg = "Error al cargar los datos";
        }
    }

    async function getData() {
        let dataset = [];
        const response = await fetch(API, {
            method: "GET",
        });

        const status = await response.status;

        try {
            if (status == 200) {
                const data = await response.json();
                dataset = data;
                errorMsg = "";
                confMsg = "Gráfica construida correctamente";
                getGraph1(dataset);
                getGraph2(dataset);
            } else {
                confMsg = "";
                errorMsg = "No hay datos para construir la gráfica";
                console.log(`Error: ${status}`);
            }
        } catch (err) {
            confMsg = "";
            errorMsg = "";
            console.log(`Error: ${err}`);
        }
    }

    async function getGraph1(data) {
        const years = ["2011", "2012", "2013", "2014"];
        const countries = [...new Set(data.map((item) => item.country))];
        const seriesData = countries.map((country) => ({
            name: country,
            data: years.map((year) => {
                const entry = data.find(
                    (item) =>
                        item.country === country &&
                        item.year.toString() === year,
                );
                return entry ? entry.vulnerability : null;
            }),
        }));

        const chart = Highcharts.chart("container1", {
            chart: {
                type: "area",
            },
            title: {
                text: "Vulnerability index by Country according to World Risk Index",
            },
            xAxis: {
                categories: years,
            },
            yAxis: {
                title: {
                    text: "Vulnerability Index",
                },
            },
            plotOptions: {
                series: {
                    marker: {
                        enabled: true,
                    },
                },
            },
            credits: {
                enabled: false,
            },
            series: seriesData,
            colors: [
                "#7cb5ec",
                "#434348",
                "#90ed7d",
                "#f7a35c",
                "#8085e9",
                "#f15c80",
                "#e4d354",
                "#2b908f",
                "#f45b5b",
                "#91e8e1",
            ],
        });
    }

    async function getGraph2(data) {
        const categories = [
            ...new Set(data.map((item) => item.vulnerability_category)),
        ];
        const categoryCounts = categories.map((category) => ({
            name: category,
            count: data.filter(
                (item) => item.vulnerability_category === category,
            ).length,
        }));

        const totalDataCount = data.length;
        const seriesData = categoryCounts.map((category) => ({
            name: category.name,
            y: (category.count / totalDataCount) * 100,
        }));

        const chart = Highcharts.chart("container2", {
            chart: {
                type: "pie",
            },
            title: {
                text: "Vulnerability Category Distribution",
            },
            tooltip: {
                pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: "pointer",
                    dataLabels: {
                        enabled: true,
                        format: "<b>{point.name}</b>: {point.percentage:.1f} %",
                        distance: -30,
                    },
                    showInLegend: true,
                },
            },
            series: [
                {
                    name: "Percentage",
                    colorByPoint: true,
                    data: seriesData,
                },
            ],
        });
    }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<div class="titulo">
    <h2>Gráficas de la API: wri-datasets</h2>
</div>

<div class="botones">
    <button on:click={getInitialData}>Cargar datos de prueba</button>
</div>

<!-- DIV DE LA GRAFICA 1 -->
<figure class="highcharts-figure">
    <div id="container1"></div>
</figure>

<!-- DIV DE LA GRAFICA 2 -->
<figure class="highcharts-figure">
    <div id="container2"></div>
</figure>

<!-- MENSAJE DE ERROR -->
{#if errorMsg != ""}
    <hr />
    <div class="err">ERROR: {errorMsg}</div>
{/if}
{#if confMsg != ""}
    <hr />
    <div class="conf">{confMsg}</div>
{/if}

<!-- ESTILO DE LA GRAFICA -->
<style>
    #container1 {
        height: 400px;
    }

    .highcharts-figure {
        min-width: 310px;
        max-width: 800px;
        margin: 1em auto;
    }

    .botones button {
        background-color: rgb(6, 0, 88);
        color: whitesmoke;
        align-content: center;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin: 10px;
    }

    .highcharts-figure {
        min-width: 320px;
        max-width: 800px;
        margin: 1em auto;
    }

    .titulo {
        text-align: center;
        margin-bottom: 20px;
    }
</style>
