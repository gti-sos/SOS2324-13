<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";

    let API = "/api/v2/mentalhealth-datasets";

    if (dev) API = "http://localhost:10000" + API;

    let dataset = [];
    let newData = {
        country: "country",
        code: "code",
        schizophrenia: 0.0,
        bipolar_disorder: 0.0,
        eating_disorder: 0.0,
        anxiety_disorder: 0.0,
        drug_use_disorder: 0.0,
        depression: 0.0,
        alcoholism: 0.0,
        year: 0,
    };

    let errorMsg = "";
    let confirmation = "";
    let currentPage = 1;
    let pageSize = 10;

    // Variables para filtro
    let from = "";
    let to = "";
    let countryFilter = "";
    let codeFilter = "";
    let schizophreniaFilter = "";
    let bipolarDisorderFilter = "";
    let eatingDisorderFilter = "";
    let anxietyDisorderFilter = "";
    let drugUseDisorderFilter = "";
    let depressionFilter = "";
    let alcoholismFilter = "";
    let yearFilter = "";

    // Variable para controlar la visibilidad de la tabla de búsqueda
    let showSearchTable = false;

    onMount(() => {
        getData();
    });

    // Cargar datos iniciales
    async function loadData() {
        try {
            const response = await fetch(API + "/loadInitialData", { method: "GET" });
            const status = response.status;
            if (status === 201) {
                getData();
                confirmation = "Datos cargados correctamente";
                setTimeout(() => {
                    confirmation = "";
                }, 5000);
            } else {
                errorMsg = `Error: Los datos ya han sido cargados`;
                setTimeout(() => {
                    errorMsg = "";
                }, 5000);
            }
        } catch (error) {
            errorMsg = error.message;
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
        }
    }

    // Obtener datos
    async function getData() {
        try {
            const response = await fetch(API + `?limit=${pageSize}&offset=${(currentPage - 1) * pageSize}`, { method: "GET" });
            let data = await response.json();
            console.log(data);
            let status = await response.status;
            if (status == 200) {
                dataset = data;
                errorMsg = "";
            } else if (status == 404) {
                errorMsg = "No hay datos existentes.";
                setTimeout(() => {
                    errorMsg = "";
                }, 5000);
                confirmation = "";
                dataset = [];
            }
        } catch (error) {
            errorMsg = error.message;
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
        }
    }

    function nextPage() {
        if (dataset.length >= pageSize) {
            currentPage++;
            getData();
        } else {
            errorMsg = "No hay más datos disponibles en la página siguiente.";
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
        }
    }

    function prevPage() {
        if (currentPage > 1) {
            currentPage--;
            getData();
        } else {
            errorMsg = "Ya estás en la primera página.";
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
        }
    }

    // Crear datos
    async function createData() {
        try {
            const response = await fetch(API + "/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newData)
            });
            const status = response.status;
            if (status === 201) {
                getData();
                confirmation = "Nuevo dato creado";
                setTimeout(() => {
                    confirmation = "";
                }, 5000);
            } else {
                if (status == 409) {
                    errorMsg = `Ya existe un dato para el país ${newData.country} para el año ${newData.year}.`;
                    setTimeout(() => {
                        errorMsg = "";
                    }, 5000);
                    confirmation = "";
                } else if (status == 400) {
                    errorMsg = "No se han completado los campos de manera correcta.";
                    setTimeout(() => {
                        errorMsg = "";
                    }, 5000);
                    confirmation = "";
                } else {
                    errorMsg = "Error Servidor";
                    setTimeout(() => {
                        errorMsg = "";
                    }, 5000);
                    confirmation = "";
                }
            }
        } catch (error) {
            errorMsg = error.message;
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
        }
    }

    // Borrar todos los datos
    async function deleteAllData() {
        try {
            const response = await fetch(API, { method: "DELETE" });
            const status = response.status;
            if (status === 200) {
                dataset = [];
                confirmation = "Todos los datos eliminados";
                setTimeout(() => {
                    confirmation = "";
                }, 5000);
            } else {
                errorMsg = "Error: No se pudieron eliminar los datos";
                setTimeout(() => {
                    errorMsg = "";
                }, 5000);
            }
        } catch (error) {
            errorMsg = error.message;
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
        }
    }

    // Borrar dato concreto
    async function deleteData(country, year) {
        try {
            const response = await fetch(API + "/" + country + "/" + year, { method: "DELETE" });
            const status = response.status;
            if (status === 200) {
                // Eliminar el dato del conjunto de datos local
                getData();
                confirmation = "Dato eliminado correctamente";
                setTimeout(() => {
                    confirmation = "";
                }, 5000);
            } else if (status === 404) {
                errorMsg = `No existe un dato para el país ${country} para el año ${year}.`;
                setTimeout(() => {
                    errorMsg = "";
                }, 5000);
            } else {
                errorMsg = "Error : No se pudo eliminar el dato";
                setTimeout(() => {
                    errorMsg = "";
                }, 5000);
            }
        } catch (error) {
            errorMsg = error.message;
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
        }
    }

    async function search() {
    let parametros = "?"; // Inicializamos la cadena de parámetros con el símbolo de interrogación para el primer parámetro

    // Verificamos cada filtro y lo agregamos a la cadena de parámetros si está presente
    if (from !== "") {
        let parsedFrom = parseInt(from);
        parametros += `from=${parsedFrom}&`;
    }
    if (to !== "") {
        let parsedTo = parseInt(to);
        parametros += `to=${parsedTo}&`;
    }
    if (countryFilter !== "") {
        parametros += `country=${countryFilter}&`;
    }
    if (codeFilter !== "") {
        parametros += `code=${codeFilter}&`;
    }
    if (schizophreniaFilter !== "") {
        let parsedSchizophrenia = parseFloat(schizophreniaFilter);
        parametros += `schizophrenia=${parsedSchizophrenia}&`;
    }
    if (bipolarDisorderFilter !== "") {
        let parsedBipolarDisorder = parseFloat(bipolarDisorderFilter);
        parametros += `bipolar_disorder=${parsedBipolarDisorder}&`;
    }
    if (eatingDisorderFilter !== "") {
        let parsedEatingDisorder = parseFloat(eatingDisorderFilter);
        parametros += `eating_disorder=${parsedEatingDisorder}&`;
    }
    if (anxietyDisorderFilter !== "") {
        let parsedAnxietyDisorder = parseFloat(anxietyDisorderFilter);
        parametros += `anxiety_disorder=${parsedAnxietyDisorder}&`;
    }
    if (drugUseDisorderFilter !== "") {
        let parsedDrugUseDisorder = parseFloat(drugUseDisorderFilter);
        parametros += `drug_use_disorder=${parsedDrugUseDisorder}&`;
    }
    if (depressionFilter !== "") {
        let parsedDepression = parseFloat(depressionFilter);
        parametros += `depression=${parsedDepression}&`;
    }
    if (alcoholismFilter !== "") {
        let parsedAlcoholism = parseFloat(alcoholismFilter);
        parametros += `alcoholism=${parsedAlcoholism}&`;
    }
    if (yearFilter !== "") {
        let parsedYear = parseInt(yearFilter);
        parametros += `year=${parsedYear}&`;
    }

    try {
        // Eliminamos el último carácter '&' de la cadena de parámetros
        parametros = parametros.slice(0, -1);
        const response = await fetch(API + parametros, { method: "GET" });
        let data = await response.json();
        console.log(data);
        let status = await response.status;
        if (status == 200) {
            dataset = data;
            errorMsg = "";
        } else if (status == 404) {
            errorMsg = "No se encontraron resultados para la búsqueda.";
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
            confirmation = "";
            dataset = [];
        }
    } catch (error) {
        errorMsg = error.message;
        setTimeout(() => {
            errorMsg = "";
        }, 5000);
    }
}


</script>

<div>
    <h1>Mental Health Datasets</h1>

    <table>
        <thead>
            <tr>
                <th><label for="country">País</label></th>
                <th><label for="code">Código</label></th>
                <th><label for="schizophrenia">Esquizofrenia</label></th>
                <th><label for="bipolarDisorder">Trastorno bipolar</label></th>
                <th><label for="eatingDisorder">Trastorno alimentario</label></th>
                <th><label for="anxietyDisorder">Trastorno de ansiedad</label></th>
                <th><label for="drugUseDisorder">Trastorno por consumo de drogas</label></th>
                <th><label for="depression">Depresión</label></th>
                <th><label for="alcoholismF">Alcoholismo</label></th>
                <th><label for="yearFilter">Año</label></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                
                <td><input type="text" bind:value={newData.country} id="country" placeholder="País" /></td>
                <td><input type="text" bind:value={newData.code} id="code" placeholder="Código" /></td>
                <td><input type="text" bind:value={newData.schizophrenia} id="schizophrenia" placeholder="Esquizofrenia" /></td>
                <td><input type="text" bind:value={newData.bipolar_disorder} id="bipolarDisorder" placeholder="Trastorno bipolar" /></td>
                <td><input type="text" bind:value={newData.eating_disorder} id="eatingDisorder" placeholder="Trastorno alimentario" /></td>
                <td><input type="text" bind:value={newData.anxiety_disorder} id="anxietyDisorder" placeholder="Trastorno de ansiedad" /></td>
                <td><input type="text" bind:value={newData.drug_use_disorder} id="drugUseDisorder" placeholder="Trastorno por consumo de drogas" /></td>
                <td><input type="text" bind:value={newData.depression} id="depression" placeholder="Depresión" /></td>
                <td><input type="text" bind:value={newData.alcoholism} id="alcoholism" placeholder="Alcoholismo" /></td>
                <td><input type="text" bind:value={newData.year} id="year" placeholder="Año" /></td>
            </tr>
        </tbody>
    </table>

    <!-- Botones para realizar acciones -->
    <div>
        <button on:click={loadData}>Cargar datos iniciales</button>
        <button on:click={createData}>Crear un nuevo dato</button>
        <button on:click={deleteAllData}>Eliminar todos los datos</button>
        <!-- Botón para mostrar/ocultar tabla de búsqueda -->
        <button on:click={() => (showSearchTable = !showSearchTable)}>{showSearchTable ? "Ocultar tabla de búsqueda" : "Mostrar tabla de búsqueda"}</button>
    </div>



<!-- Tabla de búsqueda -->
{#if showSearchTable}
    <h2>Búsqueda</h2>
    <table>
        <thead>
            <tr>
                <th><label for="from">From</label></th>
                <th><label for="to">To</label></th>
                <th><label for="countryFilter">País</label></th>
                <th><label for="codeFilter">Código</label></th>
                <th><label for="schizophreniaFilter">Esquizofrenia</label></th>
                <th><label for="bipolarDisorderFilter">Trastorno bipolar</label></th>
                <th><label for="eatingDisorderFilter">Trastorno alimentario</label></th>
                <th><label for="anxietyDisorderFilter">Trastorno de ansiedad</label></th>
                <th><label for="drugUseDisorderFilter">Trastorno por consumo de drogas</label></th>
                <th><label for="depressionFilter">Depresión</label></th>
                <th><label for="alcoholismFilter">Alcoholismo</label></th>
                <th><label for="yearFilter">Año</label></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><input type="text" bind:value={from} id="from" placeholder="From" /></td>
                <td><input type="text" bind:value={to} id="to" placeholder="To" /></td>
                <td><input type="text" bind:value={countryFilter} id="countryFilter" placeholder="País" /></td>
                <td><input type="text" bind:value={codeFilter} id="codeFilter" placeholder="Código" /></td>
                <td><input type="text" bind:value={schizophreniaFilter} id="schizophreniaFilter" placeholder="Esquizofrenia" /></td>
                <td><input type="text" bind:value={bipolarDisorderFilter} id="bipolarDisorderFilter" placeholder="Trastorno bipolar" /></td>
                <td><input type="text" bind:value={eatingDisorderFilter} id="eatingDisorderFilter" placeholder="Trastorno alimentario" /></td>
                <td><input type="text" bind:value={anxietyDisorderFilter} id="anxietyDisorderFilter" placeholder="Trastorno de ansiedad" /></td>
                <td><input type="text" bind:value={drugUseDisorderFilter} id="drugUseDisorderFilter" placeholder="Trastorno por consumo de drogas" /></td>
                <td><input type="text" bind:value={depressionFilter} id="depressionFilter" placeholder="Depresión" /></td>
                <td><input type="text" bind:value={alcoholismFilter} id="alcoholismFilter" placeholder="Alcoholismo" /></td>
                <td><input type="text" bind:value={yearFilter} id="yearFilter" placeholder="Año" /></td>
            </tr>
        </tbody>
    </table>
    <button on:click={search}>Buscar</button>
{/if}



    <!-- Lista de resultados -->
    <ul>
        {#each dataset as data}
            <li>
                <a href="/mentalhealth-datasets/{data.country}/{data.year}">Ir al dato</a>
                <span>{data.country}, {data.code}, {data.schizophrenia}, {data.bipolar_disorder}, {data.eating_disorder}, {data.anxiety_disorder}, {data.drug_use_disorder}, {data.depression}, {data.alcoholism}, {data.year}</span>
                <button on:click={() => deleteData(data.country, data.year)}>Eliminar</button>
            </li>
        {/each}
    </ul>


    <div>
        <button on:click={prevPage}>Página anterior</button>
        <button on:click={nextPage}>Página siguiente</button>
    </div>


    <!-- Mensajes de confirmación y error -->
    {#if confirmation != ""}
        <div class="message confirmation">{confirmation}</div>
    {/if}
    {#if errorMsg != ""}
        <div class="message error">Error: {errorMsg}</div>
    {/if}




 <!-- Estilos -->
 <style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f3f3f3;
        color: #333;
        margin: 0;
        padding: 0;
    }

    h1 {
        text-align: center;
        margin-bottom: 20px;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
    }

    th, td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    th {
        background-color: #f2f2f2;
    }

    tbody tr:nth-child(even) {
        background-color: #f9f9f9;
    }

    input[type="text"] {
        width: 100%;
        padding: 8px;
        box-sizing: border-box;
    }

    button {
        background-color: #4caf50;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background-color: #45a049;
    }

    .message {
        margin-top: 10px;
        padding: 10px;
        border-radius: 4px;
    }

    .confirmation {
        background-color: #d4edda;
        color: #155724;
        border: 1px solid #c3e6cb;
    }

    .error {
        background-color: #f8d7da;
        color: #721c24;
        border: 1px solid #f5c6cb;
    }
</style>
</div>

