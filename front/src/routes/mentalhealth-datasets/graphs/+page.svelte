<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    let dataAvailable = false;

    let API = "/api/v2/mentalhealth-datasets";

    async function getData() {
        try {
            const res = await fetch(API);
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

        const pieChart = Highcharts.chart('pie-chart-container', {
            chart: {
                type: 'pie',
                height: 420, 
                width: 1580   
            },
            title: {
                text: 'Salario total por país'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        formatter: function() {
                            return this.point.name;
                        }
                    }
                }
            },
            series: [{
                name: 'Salario total',
                data: processedData
            }]
        });
    }

    function createGraph2(data) {
        const processedData = findHighestSalarySectors(data);

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
                name: 'Salario más elevado',
                data: processedData.map(item => item.y)
            }]
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
