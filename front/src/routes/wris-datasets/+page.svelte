<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API = "/api/v2/wris-datasets";

    if (dev) API = "http://localhost:10000" + API;

    let dataset = [];
    let newData = {
        country: "country",
        wri: 0.0,
        exposure: 0.0,
        vulnerability: 0.0,
        susceptibility: 0.0,
        lack_of_coping_capability: 0.0,
        lack_of_adaptive_capacity: 0.0,
        year: 0,
        exposure_category: "Very Low",
        wri_category: "Very Low",
        vulnerability_category: "Very Low",
        susceptibility_category: "Very Low",
    };
    let errorMsg = "";
    let confirmation = "";

    onMount(() => {
        getData();
    });

    //Cargar los datos en la base de datos
    async function loadData() {
        try {
            let response = await fetch(API + "/loadInitialData", {
                method: "GET",
            });

            //Devuelve mensaje con un estado
            let status = await response.status;
            console.log(`Status code: ${status}`);
            if (status == 201) {
                getData();
                errorMsg = "";
                confirmation = "Datos cargados correctamente";
            } else {
                errorMsg = "Ya se han cargado los datos de prueba";
                confirmation = "";
            }
        } catch (e) {
            errorMsg = e;
        }
    }

    //Hacer un GET de todos los datos (404)
    async function getData() {
        try {
            let response = await fetch(API, {
                method: "GET",
            });

            //Devuelve los datos
            let data = await response.json();
            console.log(data);
            let status = await response.status;
            if (status == 200) {
                dataset = data;
                confirmation = "Datos obtenidos correctamente";
                errorMsg = "";
            } else if (status == 404) {
                errorMsg = "No hay datos existentes";
                confirmation = "";
                dataset = [];
            }
        } catch (e) {
            errorMsg = e;
        }
    }

    //Hacer un POST (201, 400, 409, 500)
    async function createData() {
        try {
            let response = await fetch(API, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newData),
            });

            //Devuelve un mensaje con un estado
            let status = await response.status;
            console.log(`Status code: ${status}`);
            if (status == 201) {
                getData();
                errorMsg = "";
                confirmation = "Dato creado correctamente";
            } else {
                if (status == 409) {
                    errorMsg = "Ya existe un dato con este país y año";
                    confirmation = "";
                } else if (status == 400) {
                    errorMsg =
                        "No se han completado los campos de manera correcta";
                    confirmation = "";
                } else {
                    errorMsg = "Error " + status;
                    confirmation = "";
                }
            }
        } catch (e) {
            errorMsg = e;
        }
    }

    //DELETE - Borrar todos los recursos (200)
    async function deleteAllData() {
        try {
            let response = await fetch(API, {
                method: "DELETE",
            });

            //Devuelve mensaje con un estado
            let status = await response.status;
            console.log(`Status code: ${status}`);
            if (status == 200) {
                dataset = [];
                errorMsg = "";
                confirmation = "Datos eliminados correctamente";
            }
        } catch (e) {
            errorMsg = e;
        }
    }

    //DELETE - Borrar un recurso concreto (200, 404)
    async function deleteData(country, year) {
        try {
            let response = await fetch(API + "/" + country + "/" + year, {
                method: "DELETE",
            });

            //Devuelve mensaje con un estado
            let status = await response.status;
            console.log(`Status code: ${status}`);
            if (status == 200) {
                getData();
                errorMsg = "";
                confirmation = "Recurso eliminado correctamente";
            } else {
                confirmation = "";
                errorMsg = "El dato para este país y año ya no existe";
            }
        } catch (e) {
            errorMsg = e;
        }
    }

</script>

<table>
    <thead>
        <tr>
            <th> País </th>
            <th> Índice de Riesgo </th>
            <th> Exposición </th>
            <th> Vulnerabilidad </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <input bind:value={newData.country} />
            </td>
            <td>
                <input bind:value={newData.wri} />
            </td>
            <td>
                <input bind:value={newData.exposure} />
            </td>
            <td>
                <input bind:value={newData.vulnerability} />
            </td>
        </tr>
        <tr>
            <th> Susceptibilidad </th>
            <th> Falta de capacidad de afrontamiento </th>
            <th> Falta de capacidad adaptativa </th>
            <th> Año </th>
        </tr>
        <tr>
            <td>
                <input bind:value={newData.susceptibility} />
            </td>
            <td>
                <input bind:value={newData.lack_of_coping_capability} />
            </td>
            <td>
                <input bind:value={newData.lack_of_adaptive_capacity} />
            </td>
            <td>
                <input bind:value={newData.year} />
            </td>
        </tr>
        <tr>
            <th> Categoría de Exposición </th>
            <th> Categoría del Índice de Riesgo </th>
            <th> Categoría de Vulnerabilidad </th>
            <th> Categoría de Susceptibilidad </th>
        </tr>
        <tr>
            <td>
                <input bind:value={newData.exposure_category} />
            </td>
            <td>
                <input bind:value={newData.wri_category} />
            </td>
            <td>
                <input bind:value={newData.vulnerability_category} />
            </td>
            <td>
                <input bind:value={newData.susceptibility_category} />
            </td>
        </tr>
    </tbody>
</table>

<ul>
    {#each dataset as data}
        <li>
            <a href="/wris-datasets/{data.country}/{data.year}">{data.country}</a>
            {data.country}, {data.wri}, {data.exposure}, {data.vulnerability}, {data.susceptibility}, {data.lack_of_coping_capability}, {data.lack_of_adaptive_capacity}, {data.year}, {data.exposure_category}, {data.wri_category}, {data.vulnerability_category}, {data.susceptibility_category}
            <button on:click={deleteData(data.country, data.year)}
                >Eliminar</button
            >
        </li>
    {/each}
</ul>
<button on:click={loadData}>Cargar datos de prueba</button>
<button on:click={getData}>Obtener todos los datos</button>
<button on:click={createData}>Crear un nuevo dato</button>
<button on:click={deleteAllData}>Eliminar todos los datos</button>

{#if confirmation != ""}
    <hr />
    {confirmation}
{/if}

{#if errorMsg != ""}
    <hr />
    ERROR: {errorMsg}
{/if}
