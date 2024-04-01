<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API = "/api/v2/wris-datasets";

    if (dev) API = "http://localhost:10000" + API;

    //Cargamos los datos en las variables
    let ldcountry = $page.params.country;
    let ldyear = $page.params.year;

    //Cargamos el dato concreto
    onMount(() => {
        getThisData();
    });

    //estos son los datos que cargo para verlos en la tabla
    let loadedData = {
        country: ldcountry,
        wri: 0,
        exposure: 0,
        vulnerability: 0,
        susceptibility: 0,
        lack_of_coping_capability: 0,
        lack_of_adaptive_capacity: 0,
        year: ldyear,
        exposure_category: "Low",
        wri_category: "Low",
        vulnerability_category: "Low",
        susceptibility_category: "Low",
    };

    let errorMsg = "";
    let confirmation = "";

    async function getThisData() {
        try {
            let response = await fetch(API + "/" + ldcountry + "/" + ldyear, {
                method: "GET",
            });

            //Devuelve los datos
            let data = await response.json();
            console.log(data);
            let status = await response.status;
            if (status == 200) {
                loadedData = data;
                confirmation = "Datos obtenidos correctamente";
                errorMsg = "";
            } else if (status == 404) {
                errorMsg = "No hay datos existentes";
                confirmation = "";
            }
        } catch (e) {
            errorMsg = e;
        }
    }

    //METODO PUT - Actualizar un dato de forma dinamica (una tabla igual a la pagina principal en la que pueda cargar)
    async function updateData() {
        try {
            let newData = {
                country: loadedData.country,
                wri: loadedData.wri,
                exposure: loadedData.exposure,
                vulnerability: loadedData.vulnerability,
                susceptibility: loadedData.susceptibility,
                lack_of_coping_capability: loadedData.lack_of_coping_capability,
                lack_of_adaptive_capacity: loadedData.lack_of_adaptive_capacity,
                year: loadedData.year,
                exposure_category: loadedData.exposure_category,
                wri_category: loadedData.wri_category,
                vulnerability_category: loadedData.vulnerability_category,
                susceptibility_category: loadedData.susceptibility_category,
            };

            let response = await fetch(API + "/" + ldcountry + "/" + ldyear, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newData),
            });

            //Devuelve un mensaje con un estado
            let status = await response.status;
            console.log(`Status code: ${status}`);
            if (status == 200) {
                getThisData();
                errorMsg = "";
                confirmation = "Datos actualizados correctamente";
            } else {
                if (status == 404) {
                    errorMsg = "No existe un dato con este país y año";
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
</script>

<h3>Detalles del dato del país: {ldcountry} para el año {ldyear}.</h3>
<br />
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
                <input bind:value={loadedData.country} />
            </td>
            <td>
                <input bind:value={loadedData.wri} />
            </td>
            <td>
                <input bind:value={loadedData.exposure} />
            </td>
            <td>
                <input bind:value={loadedData.vulnerability} />
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
                <input bind:value={loadedData.susceptibility} />
            </td>
            <td>
                <input bind:value={loadedData.lack_of_coping_capability} />
            </td>
            <td>
                <input bind:value={loadedData.lack_of_adaptive_capacity} />
            </td>
            <td>
                <input bind:value={loadedData.year} />
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
                <input bind:value={loadedData.exposure_category} />
            </td>
            <td>
                <input bind:value={loadedData.wri_category} />
            </td>
            <td>
                <input bind:value={loadedData.vulnerability_category} />
            </td>
            <td>
                <input bind:value={loadedData.susceptibility_category} />
            </td>
        </tr>
    </tbody>
</table>

<button on:click={updateData}>Actualizar el dato</button>

{#if confirmation != ""}
    <hr />
    {confirmation}
{/if}

{#if errorMsg != ""}
    <hr />
    ERROR: {errorMsg}
{/if}
