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
            const response = await fetch(API + `/${country}/${year}`, { method: "DELETE" });
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
        background-color: #4CAF50;
        color: white;
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
        background-color: #f2f2f2; /* Tono grisáceo leve en el fondo */
        padding: 10px;
        border-radius: 4px;
    }

    .error {
        color: red;
    }

    .confirmation {
        color: green;
    }
</style>
