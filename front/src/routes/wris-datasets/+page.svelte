<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API = "/api/v2/wris-datasets";

    if (dev) API = "http://localhost:10000" + API;

    let dataset = []; 

    //variables para la busqueda de campos
    let from = "";
    let to = "";
    let country = "";
    let wri = "";
    let exposure = "";
    let vulnerability = "";
    let susceptibility = "";
    let lack_of_coping_capability = "";
    let lack_of_adaptive_capacity = "";
    let year = "";
    let exposure_category = "";
    let wri_category = "";
    let vulnerability_category = "";
    let susceptibility_category = "";

    //datos a crear y por defecto en la tabla
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

    //mensajes
    let errorMsg = "";
    let confirmation = "";

    //offset
    let currentPage = 0;
    //limit
    const pageSize = 10;
    //estado de la tabla:
    let mostrarTabla = false;

    //cargar los datos cuando se cargue la pagina
    onMount(() => {
        mostrarTabla = false;
        toggleTabla();
        limpiarCampos();
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
                confirmation = "Datos cargados correctamente.";
            } else {
                errorMsg = "Ya se han cargado los datos de prueba.";
                confirmation = "";
            }
        } catch (e) {
            errorMsg = e;
        }
    }

    //Obtener todos los datos (GET de todos los recursos)
    async function getData() {
        try {
            let response;
            let parametros = `?limit=${pageSize}`;
            if (currentPage > 0) {
                // si estoy en una página distinta de la primera, calculamos el offset
                const offset = currentPage * pageSize;
                parametros += `&offset=${offset}`;
            }

            //compruebo si se han introducido parametros de busqueda
            if (from !== "") {
                let parsedFrom = parseInt(from);
                parametros += `&from=${parsedFrom}`;
            }
            if (to !== "") {
                let parsedTo = parseInt(to);
                parametros += `&to=${parsedTo}`;
            }
            if (country !== "") {
                parametros += `&country=${country}`;
            }
            if (wri !== "") {
                let parsedWri = parseFloat(wri);
                parametros += `&wri=${parsedWri}`;
            }
            if (exposure !== "") {
                let parsedExposure = parseFloat(exposure);
                parametros += `&exposure=${parsedExposure}`;
            }
            if (vulnerability !== "") {
                let parsedVulnerability = parseFloat(vulnerability);
                parametros += `&vulnerability=${parsedVulnerability}`;
            }
            if (susceptibility !== "") {
                let parsedSusceptibility = parseFloat(susceptibility);
                parametros += `&susceptibility=${parsedSusceptibility}`;
            }
            if (lack_of_coping_capability !== "") {
                let parsedLack_of_coping_capability = parseFloat(lack_of_coping_capability);
                parametros += `&lack_of_coping_capability=${parsedLack_of_coping_capability}`;
            }
            if (lack_of_adaptive_capacity !== "") {
                let parsedLack_of_adaptive_capacity = parseFloat(lack_of_adaptive_capacity);
                parametros += `&lack_of_adaptive_capacity=${parsedLack_of_adaptive_capacity}`;
            }
            if (year !== "") {
                let parsedYear = parseInt(year);
                parametros += `&year=${parsedYear}`;
            }
            if (exposure_category !== "") {
                parametros += `&exposure_category=${exposure_category}`;
            }
            if (wri_category !== "") {
                parametros += `&wri_category=${wri_category}`;
            }
            if (vulnerability_category !== "") {
                parametros += `&vulnerability_category=${vulnerability_category}`;
            }
            if (susceptibility_category !== "") {
                parametros += `&susceptibility_category=${susceptibility_category}`;
            }

            response = await fetch(API + parametros, {
                method: "GET",
            });

            let respData = await response.json();
            let status = await response.status;
            if (status == 200) {
                dataset = respData;
                errorMsg = "";
            } else if (status == 404) {
                errorMsg = "No hay datos existentes.";
                confirmation = "";
                dataset = [];
            }
        } catch (e) {
            errorMsg = e;
        }
    }

    // Función para ir a la página siguiente
    function nextPage() {
        currentPage++;
        getData();
    }

    // Función para ir a la página anterior
    function previousPage() {
        if (currentPage > 0) {
            currentPage--;
            getData();
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
                //aqui deberia establecer que el dataset ahora es dataset+newData
                dataset.push(newData);
                console.log("nuevo dataset");
                console.log(dataset);
                getData();
                errorMsg = "";
                confirmation = "Dato creado correctamente.";
            } else {
                if (status == 409) {
                    errorMsg = `Ya existe un dato para el país ${newData.country} para el año ${newData.year}.`;
                    confirmation = "";
                } else if (status == 400) {
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
                confirmation = "Datos eliminados correctamente.";
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
                confirmation = "Recurso eliminado correctamente.";
            } else {
                confirmation = "";
                errorMsg = `No existe un dato para el país ${country} para el año ${year}.`;
            }
        } catch (e) {
            errorMsg = e;
        }
    }

    //ocultamos y mostramos la tabla
    function toggleTabla() {
        mostrarTabla = !mostrarTabla;
    }

    //vaciar todos los campos de la tabla de filtrado
    function limpiarCampos() {
        from = "";
        to = "";
        country = "";
        wri = "";
        exposure = "";
        vulnerability = "";
        susceptibility = "";
        lack_of_coping_capability = "";
        lack_of_adaptive_capacity = "";
        year = "";
        exposure_category = "";
        wri_category = "";
        vulnerability_category = "";
        susceptibility_category = "";
        getData();
    }
</script>

<div class="contenedor">
    <div class="titulo">
        <h2>Datos de World Risk Index</h2>
    </div>

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
            <li class="objetoDeLista">
                <a
                    class="irDato"
                    href="/wris-datasets/{data.country}/{data.year}"
                    >Ir al dato</a
                >
                {data.country}, {data.wri}, {data.exposure}, {data.vulnerability},
                {data.susceptibility},
                {data.lack_of_coping_capability}, {data.lack_of_adaptive_capacity},
                {data.year},
                {data.exposure_category}, {data.wri_category}, {data.vulnerability_category},
                {data.susceptibility_category}
                <button
                    class="eliminarDato"
                    on:click={deleteData(data.country, data.year)}
                    >Eliminar</button
                >
            </li>
        {/each}
    </ul>

    <div class="botones">
        <button on:click={loadData}>Cargar datos de prueba</button>
        <button on:click={createData}>Crear un nuevo dato</button>
        <button on:click={toggleTabla}>Filtrar</button>
        <button on:click={deleteAllData}>Eliminar todos los datos</button>
        <button id="pagAv" on:click={previousPage}>Página anterior</button>
        <button id="pagNe" on:click={nextPage}>Página siguiente</button>
    </div>

    <table class:tabla={mostrarTabla}>
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
                    <input bind:value={country} />
                </td>
                <td>
                    <input bind:value={wri} />
                </td>
                <td>
                    <input bind:value={exposure} />
                </td>
                <td>
                    <input bind:value={vulnerability} />
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
                    <input bind:value={susceptibility} />
                </td>
                <td>
                    <input bind:value={lack_of_coping_capability} />
                </td>
                <td>
                    <input bind:value={lack_of_adaptive_capacity} />
                </td>
                <td>
                    <input bind:value={year} />
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
                    <input bind:value={exposure_category} />
                </td>
                <td>
                    <input bind:value={wri_category} />
                </td>
                <td>
                    <input bind:value={vulnerability_category} />
                </td>
                <td>
                    <input bind:value={susceptibility_category} />
                </td>
            </tr>
            <tr>
                <th> Datos desde el año: </th>
                <th> Datos hasta el año: </th>
            </tr>
            <tr>
                <td>
                    <input bind:value={from} />
                </td>
                <td>
                    <input bind:value={to} />
                </td>
            </tr>
            <tr>
                <td>
                    <button on:click={getData}>Buscar</button>
                </td>
                <td>
                    <button on:click={limpiarCampos}>Limpiar búsqueda</button>
                </td>
            </tr>
        </tbody>
    </table>

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
        margin-right: 10px;
    }

    .irDato {
        background-color: rgb(71, 64, 176);
        color: whitesmoke;
        align-content: center;
        border: none;
        border-radius: 6px;
        padding: 3px;
        cursor: pointer;
        margin-right: 10px;
    }

    .eliminarDato {
        background-color: rgb(139, 0, 0);
        color: whitesmoke;
        align-content: center;
        align-content: center;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-right: 10px;
    }

    #pagAv {
        background-color: rgb(63, 63, 63);
    }

    #pagNe {
        background-color: rgb(63, 63, 63);
    }

    .objetoDeLista {
        padding: 3px;
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

    .tabla {
        display: none;
    }
</style>
