<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    let dataAvailable = false;

    let API = "/api/v2/salaries-datasets";

    async function getData() {
        try {
            const response = await fetch(API+"?limit=100&offset=0", { method: "GET" });
            const data = await res.json();

            if (data.length > 0) {
                dataAvailable = true; 
                createGraph1(data);
                createGraph2(data);
            }
        } catch (error) {
            console.log(`Error fetching data: ${error}`);
        }
    }

    async function loadData() {
        try {
            let response = await fetch(API + "/loadInitialData", {
                method: "GET",
            });

            let status = await response.status;

            if (status === 200) {
                await getData();
            } 
        } catch (e) {
            console.error(e);
        }
    }   

    function aggregateDataByCountry(data) {
        const aggregatedData = {};

        data.forEach(item => {
            if (aggregatedData[item.country]) {
                aggregatedData[item.country] += parseFloat(item.salary);
            } else {
                aggregatedData[item.country] = parseFloat(item.salary);
            }
        });

        return Object.keys(aggregatedData).map(country => ({
            name: country,
            y: aggregatedData[country]
        }));
    }

    function findHighestSalarySectors(data) {
        const sectors = [...new Set(data.map(item => item.sector))];
        const highestSalariesBySector = {};

        sectors.forEach(sector => {
            const maxSalary = Math.max(...data.filter(item => item.sector === sector).map(item => parseFloat(item.salary)));
            highestSalariesBySector[sector] = maxSalary;
        });

        return Object.keys(highestSalariesBySector).map(sector => ({
            name: sector,
            y: highestSalariesBySector[sector]
        }));
    }

    function createGraph1(data) {
        const processedData = aggregateDataByCountry(data);

        const splineChart = Highcharts.chart('pie-chart-container', {
            chart: {
                type: 'spline',
                height: 420, 
                width: 1580   
            },
            title: {
                text: 'Salarios por país'
            },
            xAxis: {
                type: 'category',
                title: {
                    text: 'País'
                }
            },
            yAxis: {
                title: {
                    text: 'Salario'
                }
            },
            series: [{
                name: 'Salario',
                data: processedData
            }]
        });
    }


    function createGraph2(data) {
        const processedData = findHighestSalarySectors(data);

        const colors = Highcharts.getOptions().colors; // Obtener una lista de colores predefinidos

        const barChart = Highcharts.chart('bar-chart-container', {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Sectores con los salarios más elevados'
            },
            xAxis: {
                categories: processedData.map(item => item.name),
                title: {
                    text: 'Sector'
                }
            },
            yAxis: {
                title: {
                    text: 'Salario más elevado'
                }
            },
            series: [{
                name: '',
                data: processedData.map((item, index) => ({
                    y: item.y,
                    color: colors[index % colors.length] // Asignar colores diferentes basados en el índice
                }))
            }],
            legend: {
                enabled: false 
            }
        });
    }



    onMount(() => {
        getData();
    });

</script>

<div>
    <button on:click={loadData}>Cargar los datos</button>
</div>

<div id="pie-chart-container"></div>
<div id="bar-chart-container"></div>
