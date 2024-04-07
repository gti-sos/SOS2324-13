<script>
    import { onMount } from "svelte";

    import { dev } from "$app/environment";

    let API = "/api/v2/salaries-datasets";
    if (dev) API = "https://localhost:10000" + API;

    let data = [];
    let newSalarie = {
        year: 0,
        timestamp: "",
        salary: 0,
        country: "",
        primary_database: "",
        time_with_this_database: 0,
        employment_state: "",
        job_title: "",
        manage_staff: "",
        time_in_current_job: 0,
        other_people_on_your_team: "",
        magnitude_of_company: 0,
        sector: ""
    };
    let errorMsg = "";
    let confirmation = "";
    let loading = false;
    let currentPage = 1;
    let pageSize = 10;

// Variables para filtro
    let from = "";
    let to = "";
    let yearFilter = "";
    let timestampFilter = "";
    let salaryFilter = "";
    let countryFilter = "";
    let primary_databaseFilter = "";
    let time_with_this_databaseFilter = "";
    let employment_stateFilter = "";
    let job_titleFilter = "";
    let manage_staffFilter = "";
    let time_in_current_jobFilter = "";
    let other_people_on_your_teamFilter = "";
    let magnitude_of_companyFilter = "";
    let sectorFilter = "";

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
            let dataset = await response.json();
            console.log(data);
            let status = await response.status;
            if (status == 200) {
                data = dataset;
                errorMsg = "";
            } else if (status == 404) {
                errorMsg = "No hay datos existentes.";
                setTimeout(() => {
                    errorMsg = "";
                }, 5000);
                confirmation = "";
                data = [];
            }
        } catch (error) {
            errorMsg = error.message;
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
        }
    }

    async function createData() {
        try {
            const response = await fetch(API + "/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSalarie)
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
                    errorMsg = `Ya existe un dato para el país ${newSalarie.country} para el año ${newSalarie.year}.`;
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
    
    function nextPage() {
        if (data.length >= pageSize) {
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

    async function deleteAllData() {
        try {
            const response = await fetch(API, { method: "DELETE" });
            if (response.ok) {
                setData([]);
                confirmation = "Todos los datos eliminados";
            } else {
                setError(`Error ${response.status}: No se pudieron eliminar los datos`);
            }
        } catch (error) {
            setError(error.message);
        }
    }

    function setError(message) {
        errorMsg = message;
        setTimeout(() => {
            errorMsg = "";
        }, 5000);
    }

    function setData(newData) {
        data = newData;
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
    if (yearFilter !== "") {
        parametros += `year=${yearFilter}&`;
    }
    if (timestampFilter !== "") {
        parametros += `timestamp=${timestampFilter}&`;
    }
    if (salaryFilter !== "") {
            parametros += `salary=${salaryFilter}&`;
    }
    if (countryFilter !== "") {
            parametros += `country=${countryFilter}&`;
    }
    if (primary_databaseFilter !== "") {
            parametros += `primary_database=${primary_databaseFilter}&`;
    }
    if (time_with_this_databaseFilter !== "") {
            parametros += `time_with_this_database=${time_with_this_databaseFilter}&`;
    }
    if (employment_stateFilter !== "") {
            parametros += `employment_state=${employment_stateFilter}&`;
    }
    if (job_titleFilter !== "") {
            parametros += `job_title=${job_titleFilter}&`;
    }
    if (manage_staffFilter !== "") {
            parametros += `manage_staff=${manage_staffFilter}&`;
    }
    if (time_in_current_jobFilter !== "") {
            parametros += `time_in_current_job=${time_in_current_jobFilter}&`;
    }
    if (other_people_on_your_teamFilter !== "") {
            parametros += `other_people_on_your_team=${other_people_on_your_teamFilter}&`;
    }
    if (magnitude_of_companyFilter !== "") {
            parametros += `magnitude_of_company=${magnitude_of_companyFilter}&`;
    }
    if (sectorFilter !== "") {
            parametros += `sector=${sectorFilter}&`;
    }

    try {
        // Eliminamos el último carácter '&' de la cadena de parámetros
        parametros = parametros.slice(0, -1);
        const response = await fetch(API + parametros, { method: "GET" });
        let datas = await response.json();
        console.log(datas);
        let status = await response.status;
        if (status == 200) {
            data = datas;
            errorMsg = "";
        } else if (status == 404) {
            errorMsg = "No se encontraron resultados para la búsqueda.";
            setTimeout(() => {
                errorMsg = "";
            }, 5000);
            confirmation = "";
            data = [];
        }
    } catch (error) {
        errorMsg = error.message;
        setTimeout(() => {
            errorMsg = "";
        }, 5000);
    }
}
</script>



<div class="container">
    <h1>Salaries Datasets</h1>

    <button on:click={loadData} disabled={loading}>Obtener todos los datos</button>
    <button on:click={createData} disabled={loading}>Crear nuevo dato</button>
    <button on:click={deleteAllData} disabled={loading}>Eliminar todos los datos</button>
    <button on:click={() => (showSearchTable = !showSearchTable)}>{showSearchTable ? "Ocultar tabla de búsqueda" : "Mostrar tabla de búsqueda"}</button>
    {#if loading}
        <p>Cargando...</p>
    {:else}
        <ul class="data-list">
            {#each data as item}
                <li class="data-item">
                    <a href="/salaries-datasets/{item.country}/{item.year}">Editar dato</a>
                    <span>{item.year}, {item.timestamp}, {item.salary}, {item.country}, {item.primary_database}, {item.time_with_this_database}, {item.employment_state}, {item.job_title}, {item.manage_staff}, {item.time_in_current_job}, {item.other_people_on_your_team}, {item.magnitude_of_company}, {item.sector}</span>
                    <button on:click={() => deleteData(item.country, item.year)} disabled={loading}>Eliminar</button>
                </li>
            {/each}
        </ul>
    {/if}
    
    <button on:click={prevPage} disabled={loading}>Página anterior</button>
    <button on:click={nextPage} >Página posterior</button>

    {#if confirmation !== ""}
        <div class="confirmation">{confirmation}</div>
    {/if}
    {#if errorMsg !== ""}
        <div class="error">Error: {errorMsg}</div>
    {/if}

    <table class="data-table">
        <thead>
            <tr>
                <th> Año </th>
                <th> Timestamp </th>
                <th> Salario </th>
                <th> País </th>
                <th> Base de datos primaria </th>
                <th> Tiempo con esta base de datos </th>
                <th> Estado de empleo </th>
                <th> Título del trabajo </th>
                <th> Gestionar personal </th>
                <th> Tiempo en el trabajo actual </th>
                <th> Otras personas en tu equipo </th>
                <th> Magnitud de la empresa </th>
                <th> Sector </th>
                <th> Acción </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><input bind:value={newSalarie.year} /></td>
                <td><input bind:value={newSalarie.timestamp} /></td>
                <td><input bind:value={newSalarie.salary} /></td>
                <td><input bind:value={newSalarie.country} /></td>
                <td><input bind:value={newSalarie.primary_database} /></td>
                <td><input bind:value={newSalarie.time_with_this_database} /></td>
                <td><input bind:value={newSalarie.employment_state} /></td>
                <td><input bind:value={newSalarie.job_title} /></td>
                <td><input bind:value={newSalarie.manage_staff} /></td>
                <td><input bind:value={newSalarie.time_in_current_job} /></td>
                <td><input bind:value={newSalarie.other_people_on_your_team} /></td>
                <td><input bind:value={newSalarie.magnitude_of_company} /></td>
                <td><input bind:value={newSalarie.sector} /></td>
                <td><button on:click={createData} disabled={loading}>Crear</button></td>
            </tr>
        </tbody>
    </table>

    <!-- Tabla de búsqueda -->
    {#if showSearchTable}
    <h2>Búsqueda</h2>
    <table>
    <thead>
        <tr>
            <th><label for="from">From</label></th>
            <th><label for="to">To</label></th>
            <th><label for="yearFilter">Año</label></th>
            <th><label for="timestampFilter">Timestamp</label></th>
            <th><label for="salaryFilter">Salario</label></th>
            <th><label for="countryFilter">País</label></th>
            <th><label for="primary_databaseFilter">Base de datos primaria</label></th>
            <th><label for="time_with_this_databaseFilter">Tiempo con esta base de datos</label></th>
            <th><label for="employment_stateFilter">Estado del empleo</label></th>
            <th><label for="job_titleFilter">Trabajo</label></th>
            <th><label for="manage_staffFilter">Gestionar personal</label></th>
            <th><label for="time_in_current_jobFilter">Tiempo en el trabajo actual</label></th>
            <th><label for="other_people_on_your_teamFilter">Otras personas en tu equipo</label></th>
            <th><label for="magnitude_of_companyFilter">Magnitud de la empresa</label></th>
            <th><label for="sectorFilter">Sector</label></th>

        </tr>
    </thead>
    <tbody>
        <tr>
            <td><input type="text" bind:value={from} id="from" placeholder="From" /></td>
            <td><input type="text" bind:value={to} id="to" placeholder="To" /></td>
            <td><input type="text" bind:value={yearFilter} id="yearFilter" placeholder="Año" /></td>
            <td><input type="text" bind:value={timestampFilter} id="timestampFilter" placeholder="Timestamp" /></td>
            <td><input type="text" bind:value={salaryFilter} id="salaryFilter" placeholder="Salario" /></td>
            <td><input type="text" bind:value={countryFilter} id="countryFilter" placeholder="País" /></td>
            <td><input type="text" bind:value={primary_databaseFilter} id="primary_databaseFilter" placeholder="Base de datos primaria" /></td>
            <td><input type="text" bind:value={time_with_this_databaseFilter} id="time_with_this_databaseFilter" placeholder="Tiempo con esta base de datos" /></td>
            <td><input type="text" bind:value={employment_stateFilter} id="employment_stateFilter" placeholder="Estado del empleo" /></td>
            <td><input type="text" bind:value={job_titleFilter} id="job_titleFilter" placeholder="Trabajo" /></td>
            <td><input type="text" bind:value={manage_staffFilter} id="manage_staffFilter" placeholder="Gestionar personal" /></td>
            <td><input type="text" bind:value={time_in_current_jobFilter} id="time_in_current_jobFilter" placeholder="Tiempo en el trabajo actual" /></td>
            <td><input type="text" bind:value={other_people_on_your_teamFilter} id="other_people_on_your_teamFilter" placeholder="Otras personas en tu equipo" /></td>
            <td><input type="text" bind:value={magnitude_of_companyFilter} id="magnitude_of_companyFilter" placeholder="Magnitud de la empresa" /></td>
            <td><input type="text" bind:value={sectorFilter} id="sectorFilter" placeholder="Sector" /></td>

        </tr>
     </tbody>
    </table>
    <button on:click={search}>Buscar</button>
    {/if}
</div>

<style>
    .container {
        padding: 20px;
        background-color: #f0f0f0;
        border-radius: 5px;
        margin: 20px auto;
        width: 80%;
    }

    .data-list {
        list-style: none;
        padding: 0;
    }

    .data-item {
        margin-bottom: 10px;
        background-color: #fff;
        padding: 10px;
        border-radius: 5px;
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    }

    .data-item span {
        display: block;
        margin-bottom: 5px;
    }

    .data-table {
        width: 100%;
        margin-top: 20px;
        border-collapse: collapse;
    }

    .data-table th, .data-table td {
        padding: 8px;
        text-align: left;
        border-bottom: 1px solid #ddd;
    }

    .data-table th {
        background-color: #f2f2f2;
    }

    .data-table input {
        width: 100%;
        padding: 5px;
        border-radius: 3px;
        border: 1px solid #ccc;
    }

    .data-table button {
        padding: 5px 10px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 3px;
        cursor: pointer;
    }

    .data-table button:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    .confirmation, .error {
        margin-top: 10px;
        padding: 10px;
        border-radius: 5px;
    }

    .confirmation {
        background-color: #d4edda;
        color: #155724;
    }

    .error {
        background-color: #f8d7da;
        color: #721c24;
    }
</style>
