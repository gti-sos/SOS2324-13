<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';

    let data1 = {};
    let data2 = {};
    let data3 = {};
    let data4 = {};
    let averageSalary = {};


    onMount(async () => {
        data1 = await getData1();
        data2 = await getData2();
        data3 = await getInflationData();
        data4 = await getLocalData();
        generateBarChart(data1);
        plotScatterChart(data2);
        plotRangeAreaChart(data3, data4);
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

    async function getInflationData() {
        const url = `https://api.api-ninjas.com/v1/inflation?country=Canada`;
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

    async function getLocalData() {
        const url = "https://sos2324-13.ew.r.appspot.com/api/v2/salaries-datasets";
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data;
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

    function getNumericValue(str) {
        // Extraer el valor numérico de una cadena de texto en el formato "XX.X" o "XX.XX"
        return parseFloat(str.match(/\d+(\.\d+)?/)[0]);
    }

    function plotRangeAreaChart(inflationData, localData) {
    console.log("Inflation Data:", inflationData);
    console.log("Local Data:", localData);

    // Verificar la estructura de los datos de inflación
    if (!Array.isArray(inflationData) || inflationData.length === 0) {
        console.error("Los datos de inflación no están en el formato esperado.");
        return;
    }

    // Verificar la estructura de los datos locales
    if (!Array.isArray(localData) || localData.length === 0) {
        console.error("Los datos locales no están en el formato esperado.");
        return;
    }

    // Filtrar los datos locales solo para el país "United States"
    const usData = localData.filter(entry => entry.country === "United States");
    if (usData.length === 0) {
        console.error("No se encontraron datos para el país 'United States'.");
        return;
    }

    // Calcular la media de los salarios para "United States"
    const salaries = usData.map(entry => entry.salary);
    const averageSalary1 = salaries.reduce((total, salary) => total + salary, 0) / salaries.length;
    const averageSalary2 = (averageSalary1/12);

    console.log("Salario Promedio (United States):", averageSalary2);

    // Encontrar la inflación anual para "United States"
    const usInflationEntry = inflationData.find(entry => entry.country === "Canada");
    if (!usInflationEntry) {
        console.error("No se encontró información de inflación para el país 'United States'.");
        return;
    }
    const inflationRate = usInflationEntry.yearly_rate_pct;

    console.log("Inflación Anual (United States):", inflationRate);

    const options = {
    chart: {
        type: 'bar',
        height: 400
    },
    series: [{
        name: 'Salario Promedio (United States)',
        data: [averageSalary2]
    }, {
        name: 'Inflación Anual (United States)',
        data: [inflationRate]
    }],
    xaxis: {
        categories: ['']
    },
    yaxis: {
        title: {
            text: 'Valor'
        },
        min: 0,
        max: 10000
    }
};

    const chart = new ApexCharts(document.querySelector("#range-area-chart"), options);
    chart.render();
}






</script>   

<h1>Gráfico de tipo bar: Características de la motocicleta Kawasaki Ninja 650 (2022)</h1>
<div id="bar-chart-container"></div>
<p>Datos clave de la motocicleta Kawasaki Ninja 650 del año 2022, como la potencia, el par motor, el peso total, la altura del asiento y la capacidad de combustible.</p>

<h1>Gráfico de dispersión: Eventos históricos del Imperio Romano</h1>
<div id="scatter-chart"></div>
<p>Eventos ocurridos al Imperio Romano a lo largo de los años</p>

<h1>Gráfico de Tipo Range Area: Inflación vs Salario Promedio Mensual</h1>
<div id="range-area-chart"></div>
