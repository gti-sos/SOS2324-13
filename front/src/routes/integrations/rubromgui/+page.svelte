<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API = "/api/v2/wris-datasets";
    let APIproxy = "/proxyRRG";

    if (dev) {
        API = "http://localhost:10000" + API;
        APIproxy = "http://localhost:10000" + APIproxy;
    }

    let backData = [];
    let data1 = [];
    let data2 = [];
    let data3 = [];
    let data4 = [];
    // VARIABLES PARA LA GRAFICA DE ECHARTS
    let myChart;
    var app = {};
    var option;

    // Mensajes
    let errorMsg = "";
    let confirmation = "";

    // Cargar los datos cuando se cargue la pagina
    onMount(async () => {
        backData = await getData();
        data1 = await getData1();
        data2 = await getData2();
        data3 = await getData3();
        data4 = await getData4();
        getGraph1();
        getGraph2();
        getGraph3();
        var dom = document.getElementById("chart-container");
        myChart = echarts.init(dom, null, {
            renderer: "canvas",
            useDirtyRect: false,
        });
        getGraph4();
    });

    // Mi API, para la integración
    async function getData() {
        try {
            const response = await fetch(API);
            const status = await response.status;
            if (status == 200) {
                confirmation = "";
                errorMsg = "";
                const data = await response.json();
                //console.log(data);
                return data;
            } else {
                confirmation = "";
                errorMsg =
                    "No hay datos en el backend para construir la gráfica";
                console.log(`Error: ${status}`);
            }
        } catch (error) {
            confirmation = "";
            errorMsg = "";
            console.error(error);
        }
    }

    // API externa 1, con proxy
    async function getData1() {
        try {
            const options = {
                method: "GET",
                headers: {
                    "X-Api-Key": "jHej/uBsT4gBENm3TtFEOA==gn7ENOczOs6oDiKM",
                },
            };
            const response = await fetch(APIproxy, options);
            const data = await response.json();
            //console.log(data);
            return data;
        } catch (err) {
            console.log(err);
        }
    }

    // API externa 2
    async function getData2() {
        const url = "https://api.api-ninjas.com/v1/country?name=Guatemala";
        const options = {
            method: "GET",
            headers: {
                "X-Api-Key": "jHej/uBsT4gBENm3TtFEOA==gn7ENOczOs6oDiKM",
            },
        };
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            //console.log(data);
            return data;
        } catch (err) {
            console.log(err);
        }
    }

    // API externa 3
    async function getData3() {
        const url =
            "https://currency-exchange.p.rapidapi.com/exchange?from=EUR&to=AUD&q=10";
        const options = {
            method: "GET",
            headers: {
                "X-RapidAPI-Key":
                    "e58c859225mshd3e3a25a799ba8fp19238fjsn784d0977673e",
                "X-RapidAPI-Host": "currency-exchange.p.rapidapi.com",
            },
        };
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            //console.log(data);
            return data;
        } catch (err) {
            console.log(err);
        }
    }

    // API externa 4
    async function getData4() {
        const url = "https://covid-19-statistics.p.rapidapi.com/regions";
        const options = {
            method: "GET",
            headers: {
                "X-RapidAPI-Key":
                    "e58c859225mshd3e3a25a799ba8fp19238fjsn784d0977673e",
                "X-RapidAPI-Host": "covid-19-statistics.p.rapidapi.com",
            },
        };
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            //console.log(data);
            return data;
        } catch (err) {
            console.log(err);
        }
    }

    // Gráfica 1
    async function getGraph1() {
        // Filtramos los datos de España entre 2011 y 2014
        const kiribati2011 = backData.filter(
            (item) => item.country === "Kiribati" && item.year === 2011,
        );

        // Obtenemos el valor del tipo de interes
        const ratePct = data1.central_bank_rates[0].rate_pct;

        const ctx = document.getElementById("polarArea-chart").getContext("2d");

        const labels = [
            "Tipo de interés",
            "Índice de riesgo",
            "Índice de susceptibilidad (/10)",
            "Índice de exposición",
        ];
        const datasets = [
            {
                label: "Datos",
                data: [
                    ratePct,
                    kiribati2011[0].wri,
                    kiribati2011[0].susceptibility / 10,
                    kiribati2011[0].exposure,
                ],
                backgroundColor: [
                    "rgb(255, 99, 132, 0.8)",
                    "rgb(221, 226, 67, 0.8)",
                    "rgb(79, 226, 67, 0.8)",
                    "rgb(65, 68, 255, 0.8)",
                ],
            },
        ];

        const data = {
            labels: labels,
            datasets: datasets,
        };

        const options = {};

        new Chart(ctx, {
            type: "polarArea",
            data: data,
            options: options,
        });
    }

    // Gráfica 2
    async function getGraph2() {
        // const backdata --> datos del backend
        // const data 2 --> datos de la api 2
        const guatemalaData = backData.filter(
            (item) => item.country === "Guatemala" && item.year === 2014,
        );
        //console.log(guatemalaData);

        const ctx = document.getElementById("bar-chart").getContext("2d");

        const labels = [
            "Índice de riesgo",
            "Índice de exposición",
            "Índice de vulnerabilidad",
            "PIB (en miles de millones de €)",
            "% de homicidio",
            "% de mortalidad infantil",
        ];
        const datasets = [
            {
                label: "Datos de mi API",
                backgroundColor: [
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(255, 99, 132, 0.2)",
                    "rgba(255, 99, 132, 0.2)",
                    "rgb(54, 162, 235, 0.2)",
                    "rgb(54, 162, 235, 0.2)",
                    "rgb(54, 162, 235, 0.2)",
                ],
                borderColor: [
                    "rgb(255, 99, 132)",
                    "rgb(255, 99, 132)",
                    "rgb(255, 99, 132)",
                    "rgb(54, 162, 235)",
                    "rgb(54, 162, 235)",
                    "rgb(54, 162, 235)",
                ],
                borderWidth: 1,
                data: [
                    guatemalaData[0].wri,
                    guatemalaData[0].exposure,
                    guatemalaData[0].vulnerability,
                    0,
                    0,
                    0,
                ],
            },
            {
                label: "Datos de la API externa",
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgb(54, 162, 235)",
                borderWidth: 1,
                data: [
                    0,
                    0,
                    0,
                    data2[0].internet_users,
                    data2[0].homicide_rate,
                    data2[0].infant_mortality,
                ],
            },
        ];

        const data = {
            labels: labels,
            datasets: datasets,
        };

        const options = {};

        new Chart(ctx, {
            type: "bar",
            data: data,
            options: options,
        });
    }

    // Gráfica 3
    async function getGraph3() {
        // const backdata --> datos del backend
        // const data 3 --> datos de la api 3
        const spainData = backData.filter(
            (item) => item.country === "Spain" && item.year === 2013,
        );
        const kiribatiData = backData.filter(
            (item) => item.country === "Kiribati" && item.year === 2013,
        );
        //console.log(spainData);
        //console.log(kiribatiData);
        let data3Value = data3;

        const ctx = document.getElementById("radar-chart").getContext("2d");

        const labels = [
            "Índice de riesgo",
            "Índice de falta de adaptabilidad",
            "Índice de vulnerabilidad",
            "Índice de susceptibilidad",
            "Moneda (equivalente a 10 EUR)",
        ];
        const datasets = [
            {
                label: "Datos de España",
                data: [
                    spainData[0].wri,
                    spainData[0].lack_of_adaptive_capacity,
                    spainData[0].vulnerability,
                    spainData[0].susceptibility,
                    10,
                ],
                fill: true,
                backgroundColor: ["rgba(255, 99, 132, 0.2)"],
                borderColor: ["rgb(255, 99, 132)"],
                pointBackgroundColor: "rgb(255, 99, 132)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgb(255, 99, 132)",
            },
            {
                label: "Datos de Kiribati",
                data: [
                    kiribatiData[0].wri,
                    kiribatiData[0].lack_of_adaptive_capacity,
                    kiribatiData[0].vulnerability,
                    kiribatiData[0].susceptibility,
                    data3Value * 10,
                ],
                fill: true,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderColor: "rgb(54, 162, 235)",
                pointBackgroundColor: "rgb(54, 162, 235)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgb(54, 162, 235)",
            },
        ];

        const data = {
            labels: labels,
            datasets: datasets,
        };

        const options = {
            elements: {
                line: {
                    borderWidth: 3,
                },
            },
            scales: {
                r: {
                    angleLines: {
                        display: false,
                    },
                    suggestedMin: 50,
                    suggestedMax: 60,
                },
            },
        };

        new Chart(ctx, {
            type: "radar",
            data: data,
            options: options,
        });
    }

    // Gráfica 4
    async function getGraph4() {
        // Normalizar nombres de países en backData
        const normalizedBackData = backData.map((item) => {
            if (item.country === "Katar") {
                return { ...item, country: "Qatar" };
            }
            return item;
        });

        // Contar el número de ocurrencias por 'country' en normalizedBackData
        const countryCount = normalizedBackData.reduce((acc, item) => {
            acc[item.country] = (acc[item.country] || 0) + 1;
            return acc;
        }, {});

        // Contar el número de ocurrencias por 'name' en data4
        const nameCount = data4.data.reduce((acc, item) => {
            acc[item.name] = (acc[item.name] || 0) + 1;
            return acc;
        }, {});

        // Combinar ambos conteos en un solo arreglo de datos para la gráfica
        const chartData = [];

        for (const [country, count] of Object.entries(countryCount)) {
            chartData.push({ value: count, name: country });
        }

        for (const [name, count] of Object.entries(nameCount)) {
            chartData.push({ value: count, name });
        }

        // Configuración de la gráfica
        const option = {
            tooltip: {
                trigger: "item",
            },
            legend: {
                top: "5%",
                left: "center",
                show: false,
            },
            series: [
                {
                    name: "Datos recogidos",
                    type: "pie",
                    radius: ["40%", "70%"],
                    avoidLabelOverlap: false,
                    label: {
                        show: false,
                        position: "center",
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: "40",
                            fontWeight: "bold",
                        },
                    },
                    labelLine: {
                        show: false,
                    },
                    data: chartData,
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
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script
        src="https://fastly.jsdelivr.net/npm/echarts@5.5.0/dist/echarts.min.js"
    ></script>
</svelte:head>
<div id="body">
    <h2>Integraciones de rubromgui</h2>
    <!-- API 1 -->
    <h3>Integración con proxy de API de tipo de interés</h3>
    <div class="texto">Datos sobre Kiribati para el año 2011</div>
    <div class="chart-container">
        <canvas id="polarArea-chart" width="400" height="400"></canvas>
    </div>

    <!-- API 2 -->
    <h3>Integración con API de Países</h3>
    <div class="texto">Datos sobre Guatemala para el año 2014</div>
    <div class="chart-container">
        <canvas id="bar-chart" width="400" height="400"></canvas>
    </div>

    <!-- API 3 -->
    <h3>Integración con API de Conversión de Monedas</h3>
    <div class="texto">Datos sobre Kiribati y España para el año 2013</div>
    <div class="chart-container">
        <canvas id="radar-chart" width="400" height="400"></canvas>
    </div>

    <!-- API 4 -->
    <h3>Integración con API Covid-19 (Lista de Regiones)</h3>
    <div class="texto">Número de datos recibidos de cada país</div>
    <div id="chart-container"></div>

    <!-- MENSAJE DE ERROR -->
    {#if errorMsg != ""}
        <hr />
        <div class="err">ERROR: {errorMsg}</div>
    {/if}
    <!-- MENSAJE DE CONFIRMACION-->
    {#if confirmation != ""}
        <hr />
        <div class="conf">{confirmation}</div>
    {/if}
</div>

<style>
    * {
        margin: 0;
        padding: 0;
    }

    #chart-container {
        position: relative;
        height: 100vh;
        overflow: hidden;
    }

    #body {
        text-align: center;
    }

    .chart-container {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 20px 0;
    }

    #polarArea-chart {
        max-height: 500px;
        max-width: 600px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #bar-chart {
        max-height: 500px;
        max-width: 600px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    #radar-chart {
        max-height: 500px;
        max-width: 600px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .texto {
        padding: 15px;
        font-size: 20px;
    }
</style>
