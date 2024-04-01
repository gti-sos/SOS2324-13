<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API = "/api/v1/salaries-datasets";

    if (dev) API = "http://localhost:10000" + API;

    let dataset = [];
    let newData = {
        year: "",
        timestamp: "",
        salary: "",
        country: "",
        primary_database: "",
        time_with_this_database: "",
        employment_state: "",
        job_title: "",
        manage_staff: "",
        time_in_current_job: "",
        other_people_on_your_team: "",
        magnitude_of_company: "",
        sector: ""
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
            dataset = data;
            confirmation = "Datos obtenidos correctamente";
            errorMsg = "";
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
                confirmation = "Nuevo dato creado";
            } else {
                errorMsg = `Error ${status}: No se pudo crear el dato`;
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

    async function deleteData(year, country) {
        try {
            const response = await fetch(API + `/${encodeURIComponent(country)}/${year}`, { method: "DELETE" });
            const status = response.status;
            if (status === 200) {
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

<div class="container">
    <h1>Salaries Datasets</h1>

    <button on:click={loadData}>Cargar datos iniciales</button>
    <button on:click={getData}>Obtener todos los datos</button>
    <button on:click={createData}>Crear nuevo dato</button>
    <button on:click={deleteAllData}>Eliminar todos los datos</button>

    <ul class="data-list">
        {#each dataset as data}
            <li class="data-item">
                <span>{data.year}, {data.timestamp}, {data.salary}, {data.country}, {data.primary_database}, {data.time_with_this_database}, {data.employment_state}, {data.job_title}, {data.manage_staff}, {data.time_in_current_job}, {data.other_people_on_your_team}, {data.magnitude_of_company}, {data.sector}</span>
                <button on:click={() => deleteData(data.year, data.country)}>Eliminar</button>
            </li>
        {/each}
    </ul>

    {#if confirmation !== ""}
        <div class="confirmation">{confirmation}</div>
    {/if}
    {#if errorMsg !== ""}
        <div class="error">Error: {errorMsg}</div>
    {/if}

    <table class="data-table">
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
                <th> Acción </th>
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
                <td><button on:click={createData}>Crear</button></td>
            </tr>
        </tbody>
    </table>
</div>

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
        background-color: yellow;
        color: black;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 10px;
    }

    .data-list {
        list-style-type: none;
        padding: 0;
    }

    .data-item {
        margin-bottom: 10px;
        background-color: #f2f2f2;
        padding: 10px;
        border-radius: 4px;
    }

    .error {
        color: red;
    }

    .confirmation {
        color: yellow;
    }

    .data-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }

    .data-table th, .data-table td {
        border: 1px solid #dddddd;
        padding: 8px;
        text-align: left;
    }

    .data-table th {
        background-color: #f2f2f2;
    }

    .data-table input {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
    }
</style>
