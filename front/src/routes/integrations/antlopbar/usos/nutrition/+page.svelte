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
        // Datos específicos para las papas fritas
        return {
            "name": "fries",
            "calories": 317.7,
            "fat_total_g": 14.8,
            "fat_saturated_g": 2.3,
            "protein_g": 3.4,
            "sodium_mg": 212,
            "carbohydrates_total_g": 41.1,
            "fiber_g": 3.8,
            "sugar_g": 0.3
        };
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
                    { label: "Proteínas (g)", y: data.protein_g },
                    { label: "Sodio (mg)", y: data.sodium_mg },
                    { label: "Carbohidratos totales (g)", y: data.carbohydrates_total_g },
                    { label: "Fibra (g)", y: data.fiber_g },
                    { label: "Azúcares (g)", y: data.sugar_g }
                ]
            }]
        };

        const chart = new CanvasJS.Chart("chartContainer", chartData);
        chart.render();
    }
</script>   

<h1>Gráfico de columnas: Información nutricional de Papas Fritas (Fries)</h1>
<div id="chartContainer" style="height: 370px; width: 100%;"></div>

<p>Este gráfico de columnas muestra información nutricional sobre Papas Fritas (Fries) basada en los datos proporcionados.</p>
