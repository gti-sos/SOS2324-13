<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API = "/api/v1/mentalhealth-datasets";

    if (dev) API = "http://localhost:10000" + API;

    // Cargamos los datos 
    let country = $page.params.country;
    let year = $page.params.year;

    onMount(() => {
        getThisData();
    });

    // Datos iniciales cargados para ver en la tabla
    let datosCargados = {
        country: country,
        code:"",
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

    async function obtenerEsteDato() {
        try {
            let response = await fetch(API + "/" + country + "/" + year, {
                method: "GET",
            });

            // Devuelve los datos
            let data = await response.json();
            console.log(data);
            let status = await response.status;
            if (status == 200) {
                datosCargados = data;
                confirmation = "Acción realizada correctamente";
                errorMsg = "";
            } else if (status == 404) {
                errorMsg = "No hay datos existentes";
                confirmation = "";
            }
        } catch (e) {
            errorMsg = e;
        }
    }

    // Método PUT DINAMICO
    async function actualizarDatos() {
        try {
            let newData = {
                country: datosCargados.country,
                schizophrenia: datosCargados.schizophrenia,
                bipolar_disorder: datosCargados.bipolar_disorder,
                eating_disorder: datosCargados.eating_disorder,
                anxiety_disorder: datosCargados.anxiety_disorder,
                drug_use_disorder: datosCargados.drug_use_disorder,
                depression: datosCargados.depression,
                alcoholism: datosCargados.alcoholism,
                year: datosCargados.year,
            };

            let response = await fetch(API + "/" + country + "/" + year, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newData),
            });

            
            let status = await response.status;
            console.log(`Status code: ${status}`);
            if (status == 200) {
                obtenerEsteDato();
                errorMsg = "";
                confirmation = "Acción realizada correctamente";
            } else {
                if (status == 404) {
                    errorMsg = "No existe un dato con este país y año";
                    confirmation = "";
                } else if (status == 400) {
                    errorMsg = "No se han completado los campos de manera correcta";
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

Detalles del dato del país: {country} para el año {year}.
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
                <input bind:value={datosCargados.country} />
            </td>
            <td>
                <input bind:value={datosCargados.code} />
            </td>
            <td>
                <input bind:value={datosCargados.schizophrenia} />
            </td>
            <td>
                <input bind:value={datosCargados.bipolar_disorder} />
            </td>
            <td>
                <input bind:value={datosCargados.eating_disorder} />
            </td>
            <td>
                <input bind:value={datosCargados.anxiety_disorder} />
            </td>
            <td>
                <input bind:value={datosCargados.drug_use_disorder} />
            </td>
            <td>
                <input bind:value={datosCargados.depression} />
            </td>
            <td>
                <input bind:value={datosCargados.alcoholism} />
            </td>
            <td>
                <input bind:value={datosCargados.year} />
            </td>
        </tr>
    </tbody>
</table>

<button on:click={actualizarDatos}>Actualizar el dato</button>

{#if confirmation != ""}
    <hr />
    {confirmation}
{/if}

{#if errorMsg != ""}
    <hr />
    ERROR: {errorMsg}
{/if}
