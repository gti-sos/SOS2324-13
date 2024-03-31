<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API = "/api/v1/salaries-datasets/";

    if (dev) API = "http://localhost:10000" + API;

    let dataset = [];
    let newData = {
        country: "country ",
        code: "code",
        schizophrenia: 0,
        bipolar_disorder: 0,
        eating_disorder: 0,
        anxiety_disorder: 0,
        drug_use_disorder: 0,
        depression: 0,
        alcoholism: 0,
        year: 0,
    };

    let errorMsg = "";
    let confirmation = "";

    onMount(() => {
        getData();
    });

    async function loadData() {
        try {
            const response = await fetch(API + "/loadInitialData", { method: "GET" });
            const status = response.status;
            if (status === 201) {
                confirmation = "Datos cargados correctamente";
            } else {
                errorMsg = `Error ${status}: Los datos ya han sido cargados`;
            }
        } catch (error) {
            errorMsg = error.message;
        }
    }

    async function getData() {
        try {
            const response = await fetch(API, { method: "GET" });
            let data = await response.json();
            let status = await response.status;
            if (status == 200) {
                dataset = data;
                confirmation = "Datos obtenidos";
                errorMsg = "";
            } else if (status == 404) {
                errorMsg = "No hay datos";
                confirmation = "";
                dataset = [];
            }
        } catch (error) {
            errorMsg = error.message;
        }
    }

    async function createData() {
        try {
            const response = await fetch(API, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newData)
            });
            const status = response.status;
            if (status === 201) {
                getData();
                confirmation = "Nuevo dato añadido";
            } else {
                errorMsg = `Error ${status}: No se pueden crear el dato`;
            }
        } catch (error) {
            errorMsg = error.message;
        }
    }

    async function deleteAllData() {
        try {
            const response = await fetch(API, { method: "DELETE" });
            const status = response.status;
            if (status === 200) {
                dataset = [];
                confirmation = "Todos los datos eliminados";
            } else {
                errorMsg = `Error ${status}: No se pudieron eliminar los datos`;
            }
        } catch (error) {
            errorMsg = error.message;
        }
    }

    async function deleteData(country, year) {
        try {
            const response = await fetch(API + "/" + country + "/" + year, { method: "DELETE" });
            const status = response.status;
            if (status === 200) {
                // Eliminar el dato del conjunto de datos local
                dataset = dataset.filter(data => data.country !== country || data.year !== year);
                confirmation = "Dato eliminado correctamente";
            } else if (status === 404) {
                errorMsg = `Error ${status}: No se encontró el dato a eliminar`;
            } else {
                errorMsg = `Error ${status}: No se pudo eliminar el dato`;
            }
        } catch (error) {
            errorMsg = error.message;
        }
    }
</script>

<table>
    <thead>
        <tr>
            <th> Año </th>
            <th> Timestamp </th>
            <th> Salario </th>
            <th> País </th>
            <th> Base de datos primaria </th>
            <th> Tiempo con esta base de datos </th>
            <th> Estado de empleo </th>
            <th> Título del trabajo </th>
            <th> Gestionar personal </th>
            <th> Tiempo en el trabajo actual </th>
            <th> Otras personas en tu equipo </th>
            <th> Magnitud de la empresa </th>
            <th> Sector </th>
        </tr>
    </thead>
    <!-- Inputs para agregar nuevos datos -->
    <tbody>
        <tr>
            <td><input bind:value={newData.year} /></td>
            <td><input bind:value={newData.timestamp} /></td>
            <td><input bind:value={newData.salary} /></td>
            <td><input bind:value={newData.country} /></td>
            <td><input bind:value={newData.primary_database} /></td>
            <td><input bind:value={newData.time_with_this_database} /></td>
            <td><input bind:value={newData.employment_state} /></td>
            <td><input bind:value={newData.job_title} /></td>
            <td><input bind:value={newData.manage_staff} /></td>
            <td><input bind:value={newData.time_in_current_job} /></td>
            <td><input bind:value={newData.other_people_on_your_team} /></td>
            <td><input bind:value={newData.magnitude_of_company} /></td>
            <td><input bind:value={newData.sector} /></td>
        </tr>
    </tbody>
</table>

<ul>
    {#each dataset as data}
        <li>
            <a href="/salaries-datasets/{data.country}/{data.year}">{data.country}</a>
            <span>{data.year}, {data.timestamp}, {data.salary}, {data.country}, {data.primary_database}, {data.time_with_this_database}, {data.employment_state}, {data.job_title}, {data.manage_staff}, {data.time_in_current_job}, {data.other_people_on_your_team}, {data.magnitude_of_company}, {data.sector}</span>
            <button on:click={() => deleteData(data.country, data.year)}>Eliminar</button>
        </li>
    {/each}
</ul>

<!-- Botones para realizar acciones -->
<div>
    <button on:click={loadData}>Cargar datos</button>
    <button on:click={getData}>Obtener todos los datos</button>
    <button on:click={createData}>Crear un nuevo dato</button>
    <button on:click={deleteAllData}>Eliminar todos los datos</button>
</div>

<!-- Sección para mostrar mensajes -->
{#if confirmation != ""}
    <div class="Mensaje confirmacion">{confirmation}</div>
{/if}
{#if errorMsg != ""}
    <div class="Mensaje error">Error: {errorMsg}</div>
{/if}

<style>
    .container {
        font-family: Arial, sans-serif;
        padding: 20px;
    }

    h1 {
        text-align: center;
        margin-bottom: 20px;
    }

    button {
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 10px;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        margin-bottom: 10px;
    }

    .data-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .error {
        color: red;
    }

    .confirmation {
        color: green;
    }
</style>