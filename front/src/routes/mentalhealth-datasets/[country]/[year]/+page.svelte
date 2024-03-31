<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import { page } from "$app/stores";

    let API = "/api/v1/mentalhealth-datasets";

    if (dev) API = "http://localhost:10000" + API;

    let country = $page.params.country;
    let year = $page.params.year;

    onMount(() => {
        fetchData();
    });

    let loadedData = {
        country: country,
        code: "",
        schizophrenia: 0,
        bipolar_disorder: 0,
        eating_disorder: 0,
        anxiety_disorder: 0,
        drug_use_disorder: 0,
        depression: 0,
        alcoholism: 0,
        year: year,
    };

    let errorMsg = "";
    let confirmation = "";

    async function fetchData() {
        try {
            let response = await fetch(API + "/" + country + "/" + year, {
                method: "GET",
            });

            let data = await response.json();
            console.log(data);
            let status = await response.status;
            if (status === 200) {
                loadedData = data;
                confirmation = "Operación completada correctamente";
                errorMsg = "";
            } else if (status === 404) {
                errorMsg = "No hay datos disponibles";
                confirmation = "";
            }
        } catch (e) {
            errorMsg = e;
        }
    }

    async function updateData() {
        try {
            let newData = {
                country: loadedData.country,
                schizophrenia: loadedData.schizophrenia,
                bipolar_disorder: loadedData.bipolar_disorder,
                eating_disorder: loadedData.eating_disorder,
                anxiety_disorder: loadedData.anxiety_disorder,
                drug_use_disorder: loadedData.drug_use_disorder,
                depression: loadedData.depression,
                alcoholism: loadedData.alcoholism,
                year: loadedData.year,
            };

            let response = await fetch(API + "/" + country + "/" + year, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newData),
            });

            let status = await response.status;
            console.log(`Código de estado: ${status}`);
            if (status === 200) {
                fetchData();
                errorMsg = "";
                confirmation = "Operación completada correctamente";
            } else {
                if (status === 404) {
                    errorMsg = "No existe un dato para este país y año";
                    confirmation = "";
                } else if (status === 400) {
                    errorMsg = "Campos incompletos o incorrectos";
                    confirmation = "";
                } else {
                    errorMsg = `Error ${status}`;
                    confirmation = "";
                }
            }
        } catch (e) {
            errorMsg = e;
        }
    }
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

{#if confirmation != ""}
    <p>{confirmation}</p>
{/if}

{#if errorMsg != ""}
    <p>ERROR: {errorMsg}</p>
{/if}