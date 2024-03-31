<script>
    import { page } from "$app/stores";
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    // URL base de la API
    let API = "/api/v2/datos-salud-mental";

    // Si estamos en entorno de desarrollo, cambiar la URL base
    if (dev) API = "http://localhost:10000" + API;

    // Variables para almacenar el país y el año
    let pais = $page.params.pais;
    let año = $page.params.año;

    // Al cargar el componente, obtener los datos
    onMount(() => {
        obtenerDatos();
    });

    // Datos iniciales cargados para mostrar en la tabla
    let datosCargados = {
        pais: pais,
        codigo: "",
        esquizofrenia: 0,
        trastorno_bipolar: 0,
        trastorno_alimentario: 0,
        trastorno_ansiedad: 0,
        trastorno_consumo_drogas: 0,
        depresion: 0,
        alcoholismo: 0,
        año: año,
    };

    let errorMsg = "";
    let confirmation = "";

    // Función para obtener los datos del país y año especificados
    async function obtenerDatos() {
        try {
            let response = await fetch(API + "/" + pais + "/" + año, {
                method: "GET",
            });

            // Obtener los datos de la respuesta
            let data = await response.json();
            console.log(data);
            let status = await response.status;
            if (status == 200) {
                datosCargados = data;
                confirmation = "Acción realizada correctamente";
                errorMsg = "";
            } else if (status == 404) {
                errorMsg = "No hay datos disponibles";
                confirmation = "";
            }
        } catch (e) {
            errorMsg = e;
        }
    }

    // Función para actualizar los datos mediante el método PUT
    async function actualizarDatos() {
        try {
            let newData = {
                pais: datosCargados.pais,
                esquizofrenia: datosCargados.esquizofrenia,
                trastorno_bipolar: datosCargados.trastorno_bipolar,
                trastorno_alimentario: datosCargados.trastorno_alimentario,
                trastorno_ansiedad: datosCargados.trastorno_ansiedad,
                trastorno_consumo_drogas: datosCargados.trastorno_consumo_drogas,
                depresion: datosCargados.depresion,
                alcoholismo: datosCargados.alcoholismo,
                año: datosCargados.año,
            };

            let response = await fetch(API + "/" + pais + "/" + año, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newData),
            });

            // Obtener el estado de la respuesta
            let status = await response.status;
            console.log(`Código de estado: ${status}`);
            if (status == 200) {
                obtenerDatos();
                errorMsg = "";
                confirmation = "Acción realizada correctamente";
            } else {
                if (status == 404) {
                    errorMsg = "No existe un dato para este país y año";
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

Detalles del dato del país: {pais} para el año {año}.
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
                <input bind:value={datosCargados.pais} />
            </td>
            <td>
                <input bind:value={datosCargados.codigo} />
            </td>
            <td>
                <input bind:value={datosCargados.esquizofrenia} />
            </td>
            <td>
                <input bind:value={datosCargados.trastorno_bipolar} />
            </td>
            <td>
                <input bind:value={datosCargados.trastorno_alimentario} />
            </td>
            <td>
                <input bind:value={datosCargados.trastorno_ansiedad} />
            </td>
            <td>
                <input bind:value={datosCargados.trastorno_consumo_drogas} />
            </td>
            <td>
                <input bind:value={datosCargados.depresion} />
            </td>
            <td>
                <input bind:value={datosCargados.alcoholismo} />
            </td>
            <td>
                <input bind:value={datosCargados.año} />
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
