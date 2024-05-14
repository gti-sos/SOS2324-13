<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';

    let data1 = {};

    onMount(async () => {
        data1 = await getData1();
        generateChart(data1); 
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

    function generateChart(data) {
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

        const chart = new ApexCharts(document.querySelector("#chart-container"), chartData);
        chart.render();
    }

    function getNumericValue(str) {
        // Extraer el valor numérico de una cadena de texto en el formato "XX.X" o "XX.XX"
        return parseFloat(str.match(/\d+(\.\d+)?/)[0]);
    }
</script>   

<h1>Gráfico de tipo bar: Características de la motocicleta Kawasaki Ninja 650 (2022)</h1>
<div id="chart-container"></div>

<p>Este gráfico de tipo bar muestra algunas características clave de la motocicleta Kawasaki Ninja 650 del año 2022, como la potencia, el par motor, el peso total, la altura del asiento y la capacidad de combustible.</p>