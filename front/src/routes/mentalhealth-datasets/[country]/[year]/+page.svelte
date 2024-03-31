<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import { page } from "$app/stores";

    let API = "/api/v1/mentalhealth-datasets";

    if (dev) API = "http://localhost:10000" + API;

    let country = $page.params.country;
    let year = $page.params.year;

    // Definir los datos cargados como un objeto reactiva
    let loadedData = {
        country: "",
        code: "",
        schizophrenia: 0,
        bipolar_disorder: 0,
        eating_disorder: 0,
        anxiety_disorder: 0,
        drug_use_disorder: 0,
        depression: 0,
        alcoholism: 0,
        year: ""
    };

    // Función para cargar los datos del país y año específicos
    async function fetchData() {
        try {
            let response = await fetch(`${API}/${country}/${year}`, {
                method: "GET",
            });

            let data = await response.json();

            // Verificar si se encontraron datos para el país y año especificados
            if (response.ok) {
                loadedData = data;
            } else if (response.status === 404) {
                console.log("No hay datos disponibles");
            }
        } catch (e) {
            console.error(e);
        }
    }

    // Función para actualizar los datos
    async function updateData() {
        try {
            let response = await fetch(`${API}/${country}/${year}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loadedData),
            });

            // Verificar el estado de la respuesta
            if (response.ok) {
                fetchData(); // Recargar los datos después de la actualización
                console.log("Operación completada correctamente");
            } else if (response.status === 404) {
                console.log("No existe un dato para este país y año");
            } else if (response.status === 400) {
                console.log("Campos incompletos o incorrectos");
            } else {
                console.log(`Error ${response.status}`);
            }
        } catch (e) {
            console.error(e);
        }
    }

    // Cargar los datos al montar el componente
    onMount(() => {
        fetchData();
    });
</script>

<p>Detalles del dato del país: {country} para el año {year}.</p>

<table>
    <thead>
        <tr>
            <th> País </th>
            <th> Código </th>
            <th> Esquizofrenia </th>
            <th> Trastorno bipolar </th>
            <th> Trastorno alimentario </th>
            <th> Trastorno de ansiedad </th>
            <th> Trastorno por consumo de drogas </th>
            <th> Depresión </th>
            <th> Alcoholismo </th>
            <th> Año </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><input bind:value={loadedData.country} /></td>
            <td><input bind:value={loadedData.code} /></td>
            <td><input bind:value={loadedData.schizophrenia} /></td>
            <td><input bind:value={loadedData.bipolar_disorder} /></td>
            <td><input bind:value={loadedData.eating_disorder} /></td>
            <td><input bind:value={loadedData.anxiety_disorder} /></td>
            <td><input bind:value={loadedData.drug_use_disorder} /></td>
            <td><input bind:value={loadedData.depression} /></td>
            <td><input bind:value={loadedData.alcoholism} /></td>
            <td><input bind:value={loadedData.year} /></td>
        </tr>
    </tbody>
</table>

<button on:click={updateData}>Actualizar dato</button>
