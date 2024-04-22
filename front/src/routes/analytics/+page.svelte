<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    // Obtenemos las direcciones de las 3 APIs
    let API_RRG = "/api/v2/wris-datasets";
    let API_ALL = "/api/v2/salaries-datasets";
    let API_ALB = "/api/v2/mentalhealth-datasets";

    if (dev) {
        API_RRG = "http://localhost:10000" + API_RRG;
        API_ALL = "http://localhost:10000" + API_ALL;
        API_ALB = "http://localhost:10000" + API_ALB;
    }

    let errorMsg = "";
    let confMsg = "";

    let dataset1 = [];
    let dataset2 = [];
    let dataset3 = [];

    onMount(() => {
        getData();
    });

    async function getInitialData() {
        //Llamamos a cargar los datos a las 3 APIs
        let response1 = await fetch(API_RRG + "/loadInitialData", {
            method: "GET",
        });
        let response2 = await fetch(API_ALL + "/loadInitialData", {
            method: "GET",
        });
        let response3 = await fetch(API_ALB + "/loadInitialData", {
            method: "GET",
        });

        const status1 = await response1.status;
        const status2 = await response2.status;
        const status3 = await response3.status;

        if (status1 == 201 && status2 == 201 && status3 == 201) {
            confMsg = "Datos creados en la base de datos correctamente";
            errorMsg = "";
            getData();
        } else if (status1 == 409 || status2 == 409 || status3 == 409) {
            confMsg = "";
            errorMsg = "Ya se han creado los datos en la base de datos";
        } else {
            confMsg = "";
            errorMsg = "Error al cargar los datos";
        }
    }

    async function getData() {
        const response1 = await fetch(API_RRG, {
            method: "GET",
        });
        const response2 = await fetch(API_ALL+"?limit=100&offset=0", {
            method: "GET",
        });
        const response3 = await fetch(API_ALB+"?limit=100&offset=0", {
            method: "GET",
        });

        const status1 = await response1.status;
        const status2 = await response2.status;
        const status3 = await response3.status;

        try {
            if (status1 == 200 && status2 == 200 && status3 == 200) {
                const data1 = await response1.json();
                const data2 = await response2.json();
                const data3 = await response3.json();
                dataset1 = data1;
                dataset2 = data2;
                dataset3 = data3;
                errorMsg = "";
                confMsg = "Gráfica construida correctamente";
                getGraph();
            } else {
                confMsg = "";
                errorMsg = "No hay datos para construir la gráfica";
                console.log(`Codigo estado 1: ${status1}`);
                console.log(`Codigo estado 2: ${status2}`);
                console.log(`Codigo estado 3: ${status3}`);
            }
        } catch (err) {
            confMsg = "";
            errorMsg = "";
            console.log(`Error: ${err}`);
        }
    }

    async function getGraph() {
        console.log(dataset1);
        console.log(dataset2);
        console.log(dataset3);
        // Filtrar los datos del año 2012
        const data2012 = dataset1.filter((item) => item.year === 2012);

        // Obtener una lista única de países
        const countries = [...new Set(data2012.map((item) => item.country))];

        // Obtener los valores de salary, anxiety_disorder y vulnerability para cada país
        const salaryData = countries.map((country) => {
            const value =
                (dataset2.find((item) => item.country === country)?.salary ||
                    0) / 1000;
            return {
                name: country,
                value,
            };
        });

        const anxietyData = countries.map((country) => {
            const value =
                dataset3.find((item) => item.country === country)
                    ?.anxiety_disorder || 0;
            return {
                name: country,
                value,
            };
        });

        const vulnerabilityData = countries.map((country) => {
            const value =
                data2012.find((item) => item.country === country)
                    ?.vulnerability || 0;
            return {
                name: country,
                value,
            };
        });

        const chart = Highcharts.chart("container", {
            chart: {
                type: "bar",
            },
            title: {
                text: "Datos del 2012 por país (salario medio en puestos de IT, trastornos de ansiedad y vulnerabilidad a desastres)",
            },
            xAxis: {
                categories: countries,
                title: {
                    text: null,
                },
                gridLineWidth: 1,
                lineWidth: 0,
            },
            yAxis: {
                min: 0,
                title: {
                    text: "Valor",
                    align: "high",
                },
                labels: {
                    overflow: "justify",
                },
                gridLineWidth: 0,
            },
            tooltip: {
                valueSuffix: "",
            },
            plotOptions: {
                bar: {
                    borderRadius: "50%",
                    dataLabels: {
                        enabled: true,
                    },
                    groupPadding: 0.1,
                },
            },
            legend: {
                layout: "vertical",
                align: "right",
                verticalAlign: "top",
                x: -40,
                y: 80,
                floating: true,
                borderWidth: 1,
                backgroundColor:
                    Highcharts.defaultOptions.legend.backgroundColor ||
                    "#FFFFFF",
                shadow: true,
            },
            credits: {
                enabled: false,
            },
            series: [
                {
                    name: "Salarios (en miles de €)",
                    data: salaryData.map((item) => item.value),
                },
                {
                    name: "Personas con ansiedad (%)",
                    data: anxietyData.map((item) => item.value),
                },
                {
                    name: "Índice de Vulnerabilidad del país",
                    data: vulnerabilityData.map((item) => item.value),
                },
            ],
        });
    }
</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<div class="titulo">
    <h2>Gráfica de grupo</h2>
</div>

<!-- DIV DE LA GRAFICA -->
<figure class="highcharts-figure">
    <div id="container"></div>
</figure>

<div class="botones">
    <button on:click={getInitialData}>Cargar datos de prueba</button>
</div>

<!-- MENSAJE DE ERROR -->
{#if errorMsg != ""}
    <hr />
    <div class="err">ERROR: {errorMsg}</div>
{/if}
<!-- MENSAJE DE CONFIRMACION -->
{#if confMsg != ""}
    <hr />
    <div class="conf">{confMsg}</div>
{/if}

<!-- ESTILO DE LA GRAFICA -->
<style>
    #container {
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