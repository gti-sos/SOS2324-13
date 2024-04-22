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
                errorMsg = "";
            } else if (status == 404) {
                errorMsg = `No existe un dato para el país ${ldcountry} para el año ${ldyear}.`;
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
                wri: parseInt(loadedData.wri),
                exposure: parseInt(loadedData.exposure),
                vulnerability: parseInt(loadedData.vulnerability),
                susceptibility: parseInt(loadedData.susceptibility),
                lack_of_coping_capability: parseInt(loadedData.lack_of_coping_capability),
                lack_of_adaptive_capacity: parseInt(loadedData.lack_of_adaptive_capacity),
                year: parseInt(loadedData.year),
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
                confirmation = "Dato actualizado correctamente.";
            } else {
                if (status == 404) {
                    errorMsg = `No existe un dato para el país ${ldcountry} para el año ${ldyear}.`;
                    confirmation = "";
                } else if (status == 400) {
                    console.log(newData);
                    errorMsg =
                        "No se han completado los campos de manera correcta.";
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

<div class="contenedor">
    <div class="titulo">
        <h2>Detalles del dato del país: {ldcountry} para el año {ldyear}.</h2>
    </div>
    <br />

    <table class="tablaCampos">
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
                    <input id="updCountry" bind:value={loadedData.country} />
                </td>
                <td>
                    <input id="updWri" bind:value={loadedData.wri} />
                </td>
                <td>
                    <input id="updExposure" bind:value={loadedData.exposure} />
                </td>
                <td>
                    <input id="updVulnerability" bind:value={loadedData.vulnerability} />
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
                    <input id="updSusceptibility" bind:value={loadedData.susceptibility} />
                </td>
                <td>
                    <input id="updLack_of_coping_capability" bind:value={loadedData.lack_of_coping_capability} />
                </td>
                <td>
                    <input id="updLack_of_adaptive_capacity" bind:value={loadedData.lack_of_adaptive_capacity} />
                </td>
                <td>
                    <input id="updYear" bind:value={loadedData.year} />
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
                    <input id="updExposure_category" bind:value={loadedData.exposure_category} />
                </td>
                <td>
                    <input id="updWri_category" bind:value={loadedData.wri_category} />
                </td>
                <td>
                    <input id="updVulnerability_category" bind:value={loadedData.vulnerability_category} />
                </td>
                <td>
                    <input id="updSusceptibility_category" bind:value={loadedData.susceptibility_category} />
                </td>
            </tr>
        </tbody>
    </table>

    <div class="botones">
        <button on:click={updateData}>Actualizar el dato</button>
    </div>

    {#if confirmation != ""}
        <hr />
        <div class="conf">{confirmation}</div>
    {/if}

    {#if errorMsg != ""}
        <hr />
        <div class="err">ERROR: {errorMsg}</div>
    {/if}
</div>

<style>
    .contenedor {
        font-family: Arial, sans-serif;
        padding: 20px;
    }

    .titulo {
        text-align: center;
        margin-bottom: 20px;
    }

    .botones button {
        background-color: rgb(6, 0, 88);
        color: whitesmoke;
        align-content: center;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 15px;
        margin-right: 10px;
    }

    .tablaCampos {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }

    .tablaCampos th,
    .tablaCampos td {
        border: 1px solid #dddddd;
        padding: 8px;
        text-align: left;
    }

    .tablaCampos th {
        background-color: #f2f2f2f5;
    }

    .tablaCampos input {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
    }

    .conf {
        color: #3b8834;
    }

    .err {
        color: red;
    }
</style>
