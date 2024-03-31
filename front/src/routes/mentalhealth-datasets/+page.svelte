<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API = "/api/v1/mentalhealth-datasets";

    if (dev) API = "http://localhost:10000" + API;

    let dataset = [];
    let newData = {
        country: "country",
        code:"code",
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

    //Cargar los datos en la base de datos
    async function loadData() {
        try {
            let response = await fetch(API + "/loadInitialData", {
                method: "GET",
            });

           
            let status = await response.status;
            console.log(`Código de estado: ${status}`);
            if (status == 201) {
                getData();
                errorMsg = "";
                confirmation = "Accion realizada correctamente";
            } else {
                errorMsg = "Ya se han cargado los datos";
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
                confirmation = "Accion realizada correctamente";
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
                confirmation = "Accion realizada correctamente";
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

    //DELETE - Borrar todos los datos (200)
    async function deleteAllData() {
        try {
            let response = await fetch(API, {
                method: "DELETE",
            });

            let status = await response.status;
            console.log(`Status code: ${status}`);
            if (status == 200) {
                dataset = [];
                errorMsg = "";
                confirmation = "Accion realizada correctamente";
            }
        } catch (e) {
            errorMsg = e;
        }
    }

    //DELETE - Borrar un dato concreto (200, 404)
    async function deleteData(country, year) {
        try {
            let response = await fetch(API + "/" + country + "/" + year, {
                method: "DELETE",
            });

           
            let status = await response.status;
            console.log(`Status code: ${status}`);
            if (status == 200) {
                getData();
                errorMsg = "";
                confirmation = "Accion realizada correctamente";
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
            <td>
                <input bind:value={newData.country} />
            </td>
            <td>
                <input bind:value={newData.code} />
            </td>
            <td>
                <input bind:value={newData.schizophrenia} />
            </td>
            <td>
                <input bind:value={newData.bipolar_disorder} />
            </td>
            <td>
                <input bind:value={newData.eating_disorder} />
            </td>
            <td>
                <input bind:value={newData.anxiety_disorder} />
            </td>
            <td>
                <input bind:value={newData.drug_use_disorder} />
            </td>
            <td>
                <input bind:value={newData.depression} />
            </td>
            <td>
                <input bind:value={newData.alcoholism} />
            </td>
            <td>
                <input bind:value={newData.year} />
            </td>
        </tr>
    </tbody>
</table>

<ul>
    {#each dataset as data}
        <li>
            <a href="/mentalhealth-datasets/{data.country}/{data.year}">{data.country}</a>
            {data.country}, {data.code}, {data.schizophrenia}, {data.bipolar_disorder}, {data.eating_disorder}, {data.anxiety_disorder}, {data.drug_use_disorder}, {data.depression}, {data.alcoholism}, {data.year},
            <button on:click={deleteData(data.country, data.year)}
                >Eliminar</button
            >
        </li>
    {/each}
</ul>
<button on:click={loadData}>Cargar datos</button>
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
