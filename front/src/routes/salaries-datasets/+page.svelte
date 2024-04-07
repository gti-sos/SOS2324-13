<script>
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

    async function getData() {
        loading = true;
        try {
            const response = await fetch(API, { method: "GET" });
            const data = await response.json();
            console.log(data);
            if (response.ok) {
                setData(data);
                confirmation = "Datos obtenidos correctamente";
            } else {
                setError(`Error ${response.status}: Los datos no se han podido obtener`);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            loading = false;
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
</script>

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

<div class="container">
    <h1>Salaries Datasets</h1>

    <button on:click={getData} disabled={loading}>Obtener todos los datos</button>
    <button on:click={createData} disabled={loading}>Crear nuevo dato</button>
    <button on:click={deleteAllData} disabled={loading}>Eliminar todos los datos</button>

    {#if loading}
        <p>Cargando...</p>
    {:else}
        <ul class="data-list">
            {#each data as item}
                <li class="data-item">
                    <span>{item.year}, {item.timestamp}, {item.salary}, {item.country}, {item.primary_database}, {item.time_with_this_database}, {item.employment_state}, {item.job_title}, {item.manage_staff}, {item.time_in_current_job}, {item.other_people_on_your_team}, {item.magnitude_of_company}, {item.sector}</span>
                    <button on:click={() => deleteData(item.country, item.year)} disabled={loading}>Eliminar</button>
                </li>
            {/each}
        </ul>
    {/if}

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
</div>
