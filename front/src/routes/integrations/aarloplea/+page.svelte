<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';
    import { dev } from "$app/environment";

    let API = "/api/v2/salaries-datasets";
    let APIproxy = "/proxyALL";

    if (dev) {
        API = "http://localhost:10000" + API;
        APIproxy = "http://localhost:10000" + APIproxy;
    }

    let data1 = {};
    let data2 = [];
    let salaryData = [];
    let exchangeRates = {};
    let exerciseData = [];
    let stockData = {};

    onMount(async () => {
        data1 = await getData1();
        data2 = await getData2();
        console.log("Data 1:", data1);
        console.log("Data 2:", data2);

        salaryData = await getSalaryData();
        exchangeRates = await getExchangeRates();
        console.log("Salary Data:", salaryData);
        console.log("Exchange Rates:", exchangeRates);

        exerciseData = await getDataProxy();
        console.log("Exercise Data:", exerciseData);

        stockData = await getStockData('AAPL');
        console.log("Stock Data:", stockData);

        if (data1) generateBarChart(data1);
        if (Array.isArray(data2)) plotScatterChart(data2);
        if (Array.isArray(salaryData) && exchangeRates) generateRadarChart(salaryData, exchangeRates);
        if (Array.isArray(exerciseData)) generateColumnChart(exerciseData);
        if (Array.isArray(salaryData) && stockData) generateBubbleChart(salaryData, stockData);
    });

    async function getData1() {
        const url = "https://api.api-ninjas.com/v1/motorcycles?make=Kawasaki&model=Ninja";
        const options = {
            method: "GET",
            headers: {
                "X-Api-Key": "BoZ7aGNrvqoVxf92RrE15Q==XD7zepsgjfNgVN5I",
            },
        };
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            return data[0]; 
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    async function getData2() {
        const url = "https://api.api-ninjas.com/v1/historicalevents?text=roman empire";
        const options = {
            method: "GET",
            headers: {
                "X-Api-Key": "BoZ7aGNrvqoVxf92RrE15Q==XD7zepsgjfNgVN5I",
            },
        };
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            return data;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async function getSalaryData() {
        const url = "https://sos2324-13.ew.r.appspot.com/api/v2/salaries-datasets"; 
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log("Salary Data Response:", data);
            return data;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async function getExchangeRates() {
        const url = "https://v6.exchangerate-api.com/v6/30323d8e62e86ef3e389553e/latest/USD";
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log("Exchange Rates Response:", data);
            return data.conversion_rates;
        } catch (err) {
            console.log(err);
            return {};
        }
    }

    async function getDataProxy() {
        try {
            const options = {
                method: "GET",
                headers: {
                    "X-Api-Key": "BoZ7aGNrvqoVxf92RrE15Q==XD7zepsgjfNgVN5I",
                },
            };
            const response = await fetch("/proxyALL", options);
            const data = await response.json();
            return data;
        } catch (err) {
            console.log(err);
            return [];
        }
    }

    async function getStockData(ticker) {
        const url = `https://api.api-ninjas.com/v1/stockprice?ticker=${ticker}`;
        const options = {
            method: "GET",
            headers: {
                "X-Api-Key": "BoZ7aGNrvqoVxf92RrE15Q==XD7zepsgjfNgVN5I",
            },
        };
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            return data;
        } catch (err) {
            console.log(err);
            return null;
        }
    }

    function plotScatterChart(data) {
        const events = data.map(event => ({
            x: parseInt(event.year),
            y: parseInt(event.month),
            event: event.event
        }));

        const options = {
            chart: {
                height: 350,
                type: 'scatter',
                zoom: {
                    enabled: true,
                    type: 'xy'
                }
            },
            series: [{
                name: 'Events',
                data: events
            }],
            xaxis: {
                type: 'numeric',
                title: {
                    text: 'Año'
                }
            },
            yaxis: {
                type: 'numeric',
                min: 1,
                max: 12,
                title: {
                    text: 'Mes'
                }
            },
            tooltip: {
                custom: function({ series, seriesIndex, dataPointIndex, w }) {
                    if (seriesIndex !== undefined && dataPointIndex !== undefined) {
                        const event = series[seriesIndex][dataPointIndex].event;
                        const year = series[seriesIndex][dataPointIndex].x;
                        const month = series[seriesIndex][dataPointIndex].y;
                        return '<div class="apexcharts-tooltip">' + 'Year: ' + year + '<br>' + 'Month: ' + month + '<br>' + 'Event: ' + event + '</div>';
                    }
                    return '';
                }
            }
        };

        const chart = new ApexCharts(document.querySelector("#scatter-chart"), options);
        chart.render();
    }

    function generateBarChart(data) {
        const chartData = {
            chart: {
                type: 'bar',
                height: 400
            },
            title: {
                text: `Características de la motocicleta ${data.make} ${data.model} (${data.year})`
            },
            series: [{
                name: 'Valor',
                data: [
                    getNumericValue(data.power),
                    getNumericValue(data.torque),
                    getNumericValue(data.total_weight),
                    parseInt(data.seat_height),
                    parseFloat(data.fuel_capacity)
                ]
            }],
            xaxis: {
                categories: ['Potencia (HP)', 'Par Motor (Nm)', 'Peso Total (kg)', 'Altura del Asiento (mm)', 'Capacidad de Combustible (litros)']
            }
        };

        const chart = new ApexCharts(document.querySelector("#bar-chart-container"), chartData);
        chart.render();
    }

    function getNumericValue(str) {
        return parseFloat(str.match(/\d+(\.\d+)?/)[0]);
    }

    function generateRadarChart(salaryData, exchangeRates) {
        if (salaryData && exchangeRates) {
            const salariesUSD = salaryData.map(salary => salary.salary);
            const salariesEUR = salariesUSD.map(salaryUSD => salaryUSD * exchangeRates.EUR);

            const options = {
                chart: {
                    height: 350,
                    type: 'radar'
                },
                series: [{
                    name: 'Salario en USD',
                    data: salariesUSD
                }, {
                    name: 'Salario en EUR',
                    data: salariesEUR
                }],
                xaxis: {
                    categories: salaryData.map((_, index) => `Salario ${index + 1}`)
                }
                
            };

            const chart = new ApexCharts(document.querySelector("#radar-chart"), options);
            chart.render();
        } else {
            console.error("Error: No se pudo obtener el salario o los datos del salario están vacíos.");
        }
    }

    function generateColumnChart(data) {
        const bicepsExercises = data.filter(exercise => exercise.muscle === "biceps");

        const difficultyLevels = {};
        bicepsExercises.forEach(exercise => {
            difficultyLevels[exercise.difficulty] = true;
        });

        const difficulties = Object.keys(difficultyLevels);

        const exerciseCounts = {};
        difficulties.forEach(difficulty => {
            exerciseCounts[difficulty] = bicepsExercises.filter(exercise => exercise.difficulty === difficulty).length;
        });

        const seriesData = [];
        difficulties.forEach(difficulty => {
            seriesData.push({
                name: difficulty,
                data: [exerciseCounts[difficulty]]
            });
        });

        const options = {
            chart: {
                type: 'bar',
                height: 600,
                toolbar: {
                    show: false
                }
            },
            series: seriesData,
            title: {
                text: 'Relación entre Ejercicios de Bíceps y Dificultad'
            },
            xaxis: {
                categories: ['Ejercicios de Bíceps']
            },
            yaxis: {
                title: {
                    text: 'Cantidad de Ejercicios'
                }
            }
        };

        const chart = new ApexCharts(document.querySelector("#column-chart"), options);
        chart.render();
    }

    function generateBubbleChart(salaryData, stockData) {
        if (Array.isArray(salaryData) && stockData) {
            const salarySeries = salaryData.map(salary => ({
                x: salary.country,
                y: salary.salary,
                z: 10,
                name: "Salary"
            }));

            const stockSeries = [{
                x: stockData.ticker,
                y: stockData.price,
                z: 10,
                name: "Stock Price"
            }];

            const options = {
                chart: {
                    height: 400,
                    type: 'bubble'
                },
                series: [
                    {
                        name: "Salary",
                        data: salarySeries
                    },
                    {
                        name: "Stock Price",
                        data: stockSeries
                    }
                ],
                xaxis: {
                    title: {
                        text: 'País'
                    }
                },
                yaxis: {
                    title: {
                        text: 'Precio'
                    },
                    min: 0,
                    max: 60000
                },
                title: {
                    text: 'Bubble Chart de salarios y precios en las acciones'
                }
            };

            const chart = new ApexCharts(document.querySelector("#bubble-chart"), options);
            chart.render();
        } else {
            console.error("Error: Los datos de salario o de precios de acciones no son arrays.");
        }
    }
</script>

<h1>Gráfico de tipo bar: Características de la motocicleta Kawasaki Ninja 650 (2022)</h1>
<div id="bar-chart-container"></div>
<p>Datos clave de la motocicleta Kawasaki Ninja 650 del año 2022, como la potencia, el par motor, el peso total, la altura del asiento y la capacidad de combustible.</p>

<h1>Gráfico de dispersión: Eventos históricos del Imperio Romano</h1>
<div id="scatter-chart"></div>
<p>Eventos ocurridos al Imperio Romano a lo largo de los años</p>

<h1>Gráfico Radar de Salarios en USD y EUR</h1>
<div id="radar-chart"></div>
<p>Distintos salarios de programadores, tanto en Euros como en Dólares</p>

<h1>Gráfico de Pendiente: Relación entre Ejercicios de Bíceps y Dificultad</h1>
<div id="column-chart"></div>
<p>Número de ejercicios físicos diferenciados por dificultad</p>

<h1>Gráfico Bubble: Salarios y Precios de Acciones</h1>
<div id="bubble-chart"></div>
<p>Comparación de los salarios de diferentes países y los precios de las acciones de AAPL.</p>
