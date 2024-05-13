<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API = "/api/v2/wris-datasets";
    let APIproxy = "/proxyRRG";

    if (dev) API = "http://localhost:10000" + API;

    let backData = [];
    let data1 = [];
    let data2 = [];
    let data3 = [];
    let data4 = [];

    // Mensajes
    let errorMsg = "";
    let confirmation = "";

    // Cargar los datos cuando se cargue la pagina
    onMount(async () => {
        backData = await getData(); //terminada
        //data1 = await getData1(); --> proxy
        //data2 = await getData2(); //terminada
        //data3 = await getData3(); //terminada
        //data4 = await getData4();
        //getGraph1();
        //getGraph2(); //terminada
        //getGraph3(); //terminada
        //getGraph4();
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
    /*
    async function getData1() {
        try {
            const res = await fetch(APIproxy, {
                headers: {
                    "X-Api-Key": "rellenar",
                },
            });
            return await res.json();
        } catch (err) {
            console.error(err);
        }
    }
    */

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
            console.error(err);
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
            console.error(err);
        }
    }

    // API externa 4
    async function getData4() {
        const url = "rellenar";
        const options = {
            method: "GET",
            headers: {
                "X-Api-Key": "rellenar",
            },
        };
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            //console.log(data);
            return data;
        } catch (err) {
            console.error(err);
        }
    }

    // Gráfica 1

    // Gráfica 2
    async function getGraph2() {
        // const backdata --> datos del backend
        // const data 2 --> datos de la api 2
        const guatemalaData = backData.filter(
            (item) => item.country === "Guatemala" && item.year === 2014,
        );
        //console.log(guatemalaData);

        const ctx = document.getElementById("radar-chart").getContext("2d");

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
                    data3Value*10,
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
</script>

<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</svelte:head>
<div id="body">
    <h2>Integraciones de rubromgui</h2>
    <!-- API 1 -->
    <h3>Integración con proxy de API ""nombre1""</h3>
    Gráfica 1

    <!-- API 2 -->
    <h3>Integración con API de Países</h3>
    Datos sobre Guatemala para el año 2014
    <div>
        <canvas id="bar-chart" width="400" height="400"></canvas>
    </div>

    <!-- API 3 -->
    <h3>Integración con API de Conversión de Monedas</h3>
    Datos sobre Kiribati y España para el año 2013
    <div>
        <canvas id="radar-chart" width="400" height="400"></canvas>
    </div>

    <!-- API 4 -->
    <h3>Integración con API ""nombre4""</h3>
    Gráfica 4

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
    #body {
        text-align: center;
    }

    #bar-chart {
        max-height: 500px;
        max-width: 600px;
        justify-content: center;
        align-items: center;
    }

    #radar-chart {
        max-height: 500px;
        max-width: 600px;
        justify-content: center;
        align-items: center;
    }
</style>
