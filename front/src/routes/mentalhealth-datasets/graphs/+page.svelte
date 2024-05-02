<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API = "/api/v2/mentalhealth-datasets";

    if (dev) API = "http://localhost:10000" + API;

    let errorMsg = "";
    let confMsg = "";

    onMount(() => {
        getData();
    });

    async function loadData() {
        try {
            const response = await fetch(API + "/loadInitialData", { method: "GET" });
            const status = response.status;
            if (status === 201) {
                getData();
                confMsg = "Datos cargados correctamente";
                setTimeout(() => {
                    confMsg = "";
                }, 5000);
            } else {
                errorMsg = `Error: Los datos ya han sido cargados`;
                setTimeout(() => {
                    errorMsg = "";
                }, 5000);
            }
        } catch (error) {
            errorMsg = error.message;
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
        }
    }

    async function getData() {
    try {
        const response = await fetch(API+"?limit=100&offset=0", { method: "GET" });
        const data = await response.json();
        const status = response.status;
        if (status === 200) {
            getGraficoColumnas(data);
            drawScatterPlot(data);
            drawDonutChart(data);
            errorMsg = "";
        } else if (status === 404) {
            errorMsg = "No hay datos existentes.";
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
            confMsg = "";
        }
    } catch (error) {
        errorMsg = error.message;
        setTimeout(() => {
            errorMsg = "";
        }, 5000);
    }
}

//GRAFICO COLUMNAS
function getGraficoColumnas(data) {
    let years = [...new Set(data.map((item) => item.year))];
    let countries = [...new Set(data.map((item) => item.country))];

    years = years.sort();

    let allSeriesData = [];

    countries.forEach((country) => {
        let countryData = [];

        years.forEach((year) => {
            const item = data.find((d) => d.country === country && d.year === year);

            if (item) {
                countryData.push(parseFloat(item.alcoholism));
            } else {
                // Agregar un valor predeterminado para los años sin datos
                countryData.push(0);
            }
        });

        if (countryData.some((value) => value !== 0)) {
            allSeriesData.push({
                name: country,
                data: countryData
            });
        }
    });

    Highcharts.chart('container-bar', {
        chart: {
            type: 'column', 
            backgroundColor: '#f4f4f4', 
        },
        title: {
            text: 'Nivel de Alcoholismo por País y Año', 
            align: 'left',
            style: {
                color: '#333', 
                fontSize: '18px', 
                fontWeight: 'bold', 
            }
        },
        xAxis: {
            categories: years.map(String),
            title: {
                text: 'Año',
                style: {
                    color: '#333', 
                }
            },
            gridLineWidth: 1,
            lineWidth: 0,
            labels: {
                style: {
                    color: '#333', 
                }
            }
        },
        yAxis: {
            title: {
                text: 'Índice de Alcoholismo',
                style: {
                    color: '#333', 
                }
            },
            gridLineWidth: 1,
            lineWidth: 0,
            labels: {
                style: {
                    color: '#333', 
                }
            }
        },
        tooltip: {
            headerFormat: '<b>{point.x}</b><br/>',
            pointFormat: '{series.name}: {point.y}',
            backgroundColor: '#fff', 
            borderColor: '#333', 
            style: {
                color: '#333', 
            }
        },
        plotOptions: {
            column: { 
                borderRadius: 5,
                dataLabels: {
                    enabled: true,
                    style: {
                        color: '#333', 
                    }
                },
                borderWidth: 0, 
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            x: -40,
            y: -10,
            floating: true,
            borderWidth: 1,
            backgroundColor: '#fff', 
            shadow: true,
            itemStyle: {
                color: '#333', 
            }
        },
        credits: {
            enabled: false
        },
        series: allSeriesData
    });
}

//GRAFICO SCATTER
function drawScatterPlot(data) {
    const chartData = data.map(item => ({
        country: item.country, 
        year: item.year, 
        x: parseFloat(item.alcoholism), 
        y: parseFloat(item.bipolar_disorder), 
    }));

    Highcharts.chart('container-scatter', {
        chart: {
            type: 'scatter',
            backgroundColor: '#f4f4f4'
        },
        title: {
            text: 'Nivel de Alcoholismo vs Nivel de Bipolarismo',
            align: 'left',
            style: {
                color: '#333',
                fontSize: '18px',
                fontWeight: 'bold'
            }
        },
        xAxis: {
            title: {
                text: 'Nivel de Alcoholismo',
                style: {
                    color: '#333'
                }
            },
            labels: {
                style: {
                    color: '#333'
                }
            }
        },
        yAxis: {
            title: {
                text: 'Nivel de Bipolarismo',
                style: {
                    color: '#333'
                }
            },
            labels: {
                style: {
                    color: '#333'
                }
            }
        },
        tooltip: {
            formatter: function() {
                return `<b>${this.point.country}</b><br/>Año: ${this.point.year}<br/>Alcoholismo: ${this.point.x}<br/>Bipolarismo: ${this.point.y}`;
            },
            backgroundColor: '#fff',
            borderColor: '#333',
            style: {
                color: '#333'
            }
        },
        plotOptions: {
            scatter: {
                marker: {
                    symbol: 'circle',
                    fillColor: '#333' 
                }
            }
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        series: [{
            data: chartData
        }]
    });
}

//FUNCION DONUT CHART 

let donutChart = null; 

function drawDonutChart(data) {
    const years = [...new Set(data.map(item => item.year))];
    const depressionData = years.map(year => {
        const yearData = data.filter(item => item.year === year);
        const totalDepression = yearData.reduce((acc, cur) => acc + parseFloat(cur.depression), 0);
        const averageDepression = totalDepression / yearData.length; 
        return averageDepression;
    });

    const ctx = document.getElementById('donut-chart').getContext('2d');

    
    if (donutChart) {
        donutChart.destroy();
    }

    
    donutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: years.map(String),
            datasets: [{
                data: depressionData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top', 
                align: 'center', 
                labels: {
                    boxWidth: 20, 
                    padding: 20 
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true
            }
        }
    });
}





</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</svelte:head>

<div class="titulo">
    <h2>Gráficas mentalhealth-datasets</h2>
</div>

<div class="botones">
    <button on:click={loadData}>Cargar datos iniciales</button>
</div>

<figure class="highcharts-figure">
    <div id="container-bar"></div>
    <div id="container-scatter"></div>
    
</figure>

<div class="titulo2">
    <h2>Media depresion por año</h2>
</div>

<div><canvas id="donut-chart" width="400" height="400"></canvas></div>

{#if errorMsg != ""}
    <hr />
    <div class="err">ERROR: {errorMsg}</div>
{/if}
{#if confMsg != ""}
    <hr />
    <div class="conf">{confMsg}</div>
{/if}
