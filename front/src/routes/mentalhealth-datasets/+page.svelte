<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API = "/api/v1/mentalhealth-datasets";

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
                getData();
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
            const status = response.status;
            if (status === 200) {
                dataset = await response.json();
                confirmation = "Datos obtenidos correctamente";
            } else {
                errorMsg = `Error ${status}: No hay datos disponibles`;
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

    async function deleteData(country, year) {
        try {
            const response = await fetch(API + API + "/" + country + "/" + year, { method: "DELETE" });
            const status = response.status;
            if (status === 200) {
                getData();
                confirmation = "Dato eliminado correctamente";
            } else {
                errorMsg = `Error ${status}: No se pudo eliminar el dato`;
            }
        } catch (error) {
            errorMsg = error.message;
        }
    }
</script>

<div>
    <table>
        <!-- Inputs para agregar nuevos datos -->
        <tbody>
            <tr>
                <td><input bind:value={newData.country} /></td>
                <td><input bind:value={newData.code} /></td>
                <td><input bind:value={newData.schizophrenia} /></td>
                <td><input bind:value={newData.bipolar_disorder} /></td>
                <td><input bind:value={newData.eating_disorder} /></td>
                <td><input bind:value={newData.anxiety_disorder} /></td>
                <td><input bind:value={newData.drug_use_disorder} /></td>
                <td><input bind:value={newData.depression} /></td>
                <td><input bind:value={newData.alcoholism} /></td>
                <td><input bind:value={newData.year} /></td>
            </tr>
        </tbody>
    </table>

    <ul>
        <!-- Lista para mostrar los datos existentes -->
        {#each dataset as data}
            <li>
                <a href="/mentalhealth-datasets/{data.country}/{data.year}">{data.country}</a>
                <span>{data.country}, {data.code}, {data.schizophrenia}, {data.bipolar_disorder}, {data.eating_disorder}, {data.anxiety_disorder}, {data.drug_use_disorder}, {data.depression}, {data.alcoholism}, {data.year}</span>
                <button on:click={() => deleteData(data.country, data.year)}>Eliminar</button>
            </li>
        {/each}
    </ul>

    <!-- Botones para realizar acciones -->
    <div>
        <button on:click={loadData}>Cargar datos</button>
        <button on:click={getData}>Obtener todos los datos</button>
        <button on:click={createData}>Crear un nuevo dato</button>
        <button on:click={deleteAllData}>Eliminar todos los datos </button>
    </div>

    <!-- Sección para mostrar mensajes -->
    {#if confirmation != ""}
        <div>{confirmation}</div>
    {/if}
    {#if errorMsg != ""}
        <div>Error: {errorMsg}</div>
    {/if}
</div>
