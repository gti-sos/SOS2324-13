<svelte:head>
    <script src="https://cdn.zingchart.com/zingchart.min.js"></script>
</svelte:head>

<script>
    import { onMount } from "svelte";

    let data1 = [];

    onMount(async () => {
        data1 = await getData1();
        generateChart(data1); 
    });

    async function getData1() {
        const url = "https://api.api-ninjas.com/v1/cars?model=camry";
        const options = {
            method: "GET",
            headers: {
                "X-Api-Key": "GHE89hJhpa+HwvIeMM+qFg==4g61JJEy3roxAdRf",
            },
        };
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            return data;
        } catch (err) {
            console.log(err);
        }
    }

    function generateChart(data) {
        const chartData = {
            type: "bar",
            title: {
                text: "Gráfico de eficiencia en ciudad de Toyota Camry"
            },
            scaleX: {
                labels: data.map(car => `${car.transmission} (${car.cylinders} cyl, ${car.displacement}L)`)
            },
            series: [
                {
                    values: data.map(car => car.city_mpg),
                    text: "Eficiencia en ciudad (mpg)"
                }
            ]
        };

        zingchart.render({
            id: 'chart-container',
            data: chartData,
            height: '400',
            width: '100%'
        });
    }
</script>   

<h1>Gráfico de eficiencia en ciudad de Toyota Camry</h1>
<div id="chart-container"></div>

<p>Este gráfico muestra la eficiencia en ciudad de los Toyota Camry de acuerdo a la transmisión, el número de cilindros y la cilindrada del motor. Cada barra representa un tipo de transmisión (automática o manual) junto con el número de cilindros y la cilindrada del motor, y la altura de la barra indica la eficiencia en ciudad en millas por galón (mpg) para ese tipo de transmisión.</p>
