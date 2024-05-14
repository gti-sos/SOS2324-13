<svelte:head>
    <script src="https://canvasjs.com/assets/script/canvasjs.min.js"></script>
</svelte:head>

<script>
    import { onMount } from 'svelte';

    let nutritionData = {};

    onMount(async () => {
        nutritionData = await getNutritionData();
        generateChart(nutritionData); 
    });

    async function getNutritionData() {
        const url = "https://api.api-ninjas.com/v1/nutrition?query=fries";
        const options = {
            method: "GET",
            headers: {
                "X-Api-Key": "GHE89hJhpa+HwvIeMM+qFg==4g61JJEy3roxAdRf",
            },
        };
        try {
            const response = await fetch(url, options);
            const data = await response.json();
            return data[0]; // Tomamos el primer elemento del array, ya que la API devuelve un array con un solo elemento
        } catch (err) {
            console.log(err);
        }
    }

    function generateChart(data) {
        const chartData = {
            animationEnabled: true,
            title: {
                text: "Información nutricional: Papas Fritas (Fries)"
            },
            axisX: {
                title: "Nutriente"
            },
            axisY: {
                title: "Cantidad"
            },
            data: [{
                type: "column",
                dataPoints: [
                    { label: "Calorías", y: data.calories },
                    { label: "Grasas totales (g)", y: data.fat_total_g },
                    { label: "Grasas saturadas (g)", y: data.fat_saturated_g },
                    { label: "Carbohidratos totales (g)", y: data.carbohydrates_total_g },
                    { label: "Proteínas (g)", y: data.protein_g },
                    { label: "Fibra dietética (g)", y: data.fiber_g },
                    { label: "Sodio (mg)", y: data.sodium_mg }
                ]
            }]
        };

        const chart = new CanvasJS.Chart("chartContainer", chartData);
        chart.render();
    }
</script>   

<h1>Gráfico de columnas: Información nutricional de Papas Fritas (Fries)</h1>
<div id="chartContainer" style="height: 370px; width: 100%;"></div>

<p>Este gráfico de columnas muestra información nutricional sobre Papas Fritas (Fries) obtenida de la API proporcionada.</p>
