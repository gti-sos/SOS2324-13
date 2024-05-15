<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';

    let data1 = {};
    let data2 = {};
    let salaryData = [];
    let exchangeRates = {};

    onMount(async () => {
        data1 = await getData1();
        data2 = await getData2();
        console.log("Data 1:", data1);
        console.log("Data 2:", data2);
        
        salaryData = await getSalaryData();
        exchangeRates = await getExchangeRates();
        console.log("Salary Data:", salaryData);
        console.log("Exchange Rates:", exchangeRates);
        
        generateBarChart(data1);
        plotScatterChart(data2);
        generateRadarChart(salaryData, exchangeRates);
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
            return data[0]; // Tomamos solo el primer resultado ya que la API devuelve un solo objeto
        } catch (err) {
            console.log(err);
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
            return data; // Devolvemos todos los resultados
        } catch (err) {
            console.log(err);
        }
    }

    async function getSalaryData() {
        const url = "https://sos2324-13.ew.r.appspot.com/api/v2/salaries-datasets/United%20States"; // Reemplaza con la URL de tu API
        try {
            const response = await fetch(url);
            const data = await response.json();
            console.log("Salary Data Response:", data);
            return data; // No es necesario tomar solo el primer resultado
        } catch (err) {
            console.log(err);
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
                    text: 'Year'
                }
            },
            yaxis: {
                type: 'numeric',
                min: 1,
                max: 12,
                title: {
                    text: 'Month'
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
        // Extraer el valor numérico de una cadena de texto en el formato "XX.X" o "XX.XX"
        return parseFloat(str.match(/\d+(\.\d+)?/)[0]);
    }

    function generateRadarChart(salaryData, exchangeRates) {
        // Verificar si salaryData está definido
        if (salaryData) {
            // Tomar los valores de los salarios en USD
            const salariesUSD = salaryData.map(salary => salary.salary);

            // Convertir los salarios de USD a EUR
            const salariesEUR = salariesUSD.map(salaryUSD => salaryUSD * exchangeRates.EUR);

            // Configurar las opciones del gráfico radar
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

            // Renderizar el gráfico
            const chart = new ApexCharts(document.querySelector("#radar-chart"), options);
            chart.render();
        } else {
            console.error("Error: No se pudo obtener el salario o los datos del salario están vacíos.");
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
