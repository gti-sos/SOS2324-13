<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';

    let data1 = {};
    let data2 = {};
    let inflationData = [];
    let salaryData = [];

    onMount(async () => {
        data1 = await getData1();
        data2 = await getData2();
        generateBarChart(data1);
        generateRadarChart(data2);
        inflationData = await getInflationData();
        salaryData = await getSalaryData();
        generateAreaChart();

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
        const url = "https://api.api-ninjas.com/v1/dogs?name=golden retriever";
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


    async function getInflationData() {
        const url = "https://api.api-ninjas.com/v1/inflation?country=Austria";
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
        } catch (err) {
            console.log(err);
        }
    }

    async function getSalaryData() {
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

    function generateBarChart(data) {
        const chartData = {
            chart: {
                type: 'bar',
                height: 400
            },
            title: {
                text: 'Características de la motocicleta ${data.make} ${data.model} (${data.year})'
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

    function generateRadarChart(data) {
        const chartData = {
            series: [{
                name: 'Características',
                data: [
                    data[0].city_mpg,
                    data[0].combination_mpg,
                    data[0].highway_mpg,
                    data[0].cylinders,
                    data[0].displacement
                ]
            }],
            chart: {
                type: 'radar',
                height: 400
            },
            title: {
                text: 'Características del Toyota Camry (${data[0].year})'
            },
            labels: ['MPG en ciudad', 'MPG combinado', 'MPG en carretera', 'Cilindros', 'Desplazamiento (litros)']
        };

        const chart = new ApexCharts(document.querySelector("#radar-chart-container"), chartData);
        chart.render();
    }

    function combineData() {
        const combined = [];
        for (const inflationCountry of inflationData) {
            const salaryCountry = salaryData.find(item => item.country === inflationCountry.country);
            if (salaryCountry) {
                combined.push({
                    country: inflationCountry.country,
                    inflationRate: inflationCountry.yearly_rate_pct,
                    averageSalary: salaryCountry.salary
                });
            }
        }
        return combined;
    }

    function generateAreaChart() {
        const combinedData = combineData();

        const chartData = {
            series: [
                {
                    name: 'Tasa de inflación',
                    data: combinedData.map(item => item.inflationRate)
                },
                {
                    name: 'Salario promedio',
                    data: combinedData.map(item => item.averageSalary)
                }
            ],
            chart: {
                type: 'area',
                height: 400
            },
            title: {
                text: 'Comparación de tasa de inflación y salario promedio por país'
            },
            xaxis: {
                categories: combinedData.map(item => item.country)
            }
        };

        const chart = new ApexCharts(document.querySelector("#area-chart-container"), chartData);
        chart.render();
    }


    function getNumericValue(str) {
        // Extraer el valor numérico de una cadena de texto en el formato "XX.X" o "XX.XX"
        return parseFloat(str.match(/\d+(\.\d+)?/)[0]);
    }
</script>   

<h1>Gráfico de tipo bar: Características de la motocicleta Kawasaki Ninja 650 (2022)</h1>
<div id="bar-chart-container"></div>
<p>Datos clave de la motocicleta Kawasaki Ninja 650 del año 2022, como la potencia, el par motor, el peso total, la altura del asiento y la capacidad de combustible.</p>

<h1>Gráfico de tipo radar: Características del Toyota Camry</h1>
<div id="radar-chart-container"></div>
<p>El gráfico de radar muestra algunas características del Toyota Camry.</p>

<h1>Gráfico de área: Comparación de tasa de inflación y salario promedio por país</h1>
<div id="area-chart-container"></div>