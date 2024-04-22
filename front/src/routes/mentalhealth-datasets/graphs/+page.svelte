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

        // Agregar el país solo si tiene datos para al menos un año
        if (countryData.some((value) => value !== 0)) {
            allSeriesData.push({
                name: country,
                data: countryData
            });
        }
    });

     console.log(allSeriesData);

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
            y: 0,
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








</script>

<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
</svelte:head>

<div class="titulo">
    <h2>Gráficas mentalhealth-datasets</h2>
</div>

<div class="botones">
    <button on:click={loadData}>Cargar datos iniciales</button>
</div>

<figure class="highcharts-figure">
    <div id="container-bar"></div>
</figure>

{#if errorMsg != ""}
    <hr />
    <div class="err">ERROR: {errorMsg}</div>
{/if}
{#if confMsg != ""}
    <hr />
    <div class="conf">{confMsg}</div>
{/if}