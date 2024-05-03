<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    // VARIABLES PARA LA GRAFICA ECHARTS //
    import * as echarts from "echarts";
    // --------------------------------- //

    let API = "/api/v2/wris-datasets";

    if (dev) API = "http://localhost:10000" + API;

    let errorMsg = "";
    let confMsg = "";

    let myChart;
    var app = {};
    var option;

    onMount(() => {
        getData();

        var dom = document.getElementById("chart-container");
        myChart = echarts.init(dom, null, {
            renderer: "canvas",
            useDirtyRect: false,
        });
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
                getGraph3(dataset);
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
                text: "Gráfica de índices de vulnerabilidad por país y año según el reporte del World Risk Index",
            },
            xAxis: {
                categories: years,
            },
            yAxis: {
                title: {
                    text: "Índice de vulnerabilidad",
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
                text: "Distribución de Categoría de Vulnerabilidad de los datos",
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
                    name: "Porcentaje",
                    colorByPoint: true,
                    data: seriesData,
                },
            ],
        });
    }

    async function getGraph3(data) {
        // Filtramos los datos de España entre 2011 y 2014
        const dataSpaFiltered = data.filter(
            (item) =>
                item.country === "Spain" &&
                item.year >= 2011 &&
                item.year <= 2014,
        );
        // Filtramos los datos de Kiribati entre 2011 y 2014
        const dataKirFiltered = data.filter(
            (item) =>
                item.country === "Kiribati" &&
                item.year >= 2011 &&
                item.year <= 2014,
        );

        // Obtenemos los valores de wri para España
        const datosSpain = dataSpaFiltered.map((item) => ({
            year: item.year,
            value: item.wri || 0,
        }));

        // Obtenemos los valores de wri para Kiribati
        const datosKiribati = dataKirFiltered.map((item) => ({
            year: item.year,
            value: item.wri || 0,
        }));

        // Configuración de la gráfica
        const option = {
            tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "shadow",
                },
            },
            legend: {
                data: ["España", "Kiribati"],
            },
            toolbox: {
                show: true,
                orient: "vertical",
                left: "right",
                top: "center",
                feature: {
                    mark: { show: true },
                    dataView: { show: true, readOnly: false },
                    magicType: { show: true, type: ["line", "bar", "stack"] },
                    restore: { show: true },
                    saveAsImage: { show: true },
                },
            },
            xAxis: [
                {
                    type: "category",
                    axisTick: { show: false },
                    data: datosSpain.map((item) => item.year),
                },
            ],
            yAxis: [
                {
                    type: "value",
                },
            ],
            series: [
                {
                    name: "España",
                    type: "bar",
                    barGap: 0,
                    data: datosSpain.map((item) => item.value),
                },
                {
                    name: "Kiribati",
                    type: "bar",
                    data: datosKiribati.map((item) => item.value),
                },
            ],
        };

        // Si la opción es un objeto, asignamos la configuración a la gráfica
        if (option && typeof option === "object") {
            myChart.setOption(option);
        }

        // Hacemos que la gráfica se redimensione cuando se cambia el tamaño de la ventana
        window.addEventListener("resize", myChart.resize);
    }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script
        src="https://fastly.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"
    ></script>
</svelte:head>

<div class="titulo">
    <h2>Gráficas de la API: wri-datasets</h2>
</div>

<!-- DIV DE LA GRAFICA 1 -->
<figure class="highcharts-figure">
    <div id="container1"></div>
</figure>

<!-- DIV DE LA GRAFICA 2 -->
<figure class="highcharts-figure">
    <div id="container2"></div>
</figure>

<!-- DIV DE LA GRAFICA 3 (EXTERNA) -->
<h3 id="tituloCent">
    Comparación de Índice de Riesgo Mundial de España y Kiribati
</h3>
<div id="chart-container"></div>

<div class="botones">
    <button on:click={getInitialData}>Cargar datos de prueba</button>
</div>

<!-- MENSAJE DE ERROR -->
{#if errorMsg != ""}
    <hr />
    <div class="err">ERROR: {errorMsg}</div>
{/if}
<!-- MENSAJE DE CONFIRMACION-->
{#if confMsg != ""}
    <hr />
    <div class="conf">{confMsg}</div>
{/if}

<!-- ESTILO DE LAS GRAFICAS -->
<style>
    #tituloCent {
        text-align: center;
    }
    * {
        margin: 0;
        padding: 0;
    }
    #chart-container {
        position: relative;
        height: 400px;
        width: 800px;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
    }

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
