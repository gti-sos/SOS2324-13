<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API = "/api/v1/wris-datasets";

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
                confirmation = "Accion realizada correctamente";
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
                confirmation = "Accion realizada correctamente";
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

Data details of {ldcountry} in year {ldyear}
<table>
    <thead>
        <tr>
            <th> Country </th>
            <th> WRI </th>
            <th> Exposure </th>
            <th> Vulnerability </th>
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
            <th> Susceptibility </th>
            <th> Lack of coping capability </th>
            <th> Lack of adaptive capacity </th>
            <th> Year </th>
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
            <th> Exposure Category </th>
            <th> WRI Category </th>
            <th> Vulnerability Category </th>
            <th> Susceptibility Category </th>
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
