<script>
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import { page } from "$app/stores";

    let API = "/api/v2/salaries-datasets";

    if (dev) API = "http://localhost:10000" + API;

    let country = $page.params.country;
    let year = $page.params.year;

    // Definir los datos cargados
    let loadedSalarie = {
        year: "",
        timestamp: "",
        salary: "",
        country: "",
        primary_database: "",
        time_with_this_database: "",
        employment_state: "",
        job_title: "",
        manage_staff: "",
        time_in_current_job: "",
        other_people_on_your_team: "",
        magnitude_of_company: "",
        sector: ""
    };

    let confirmationMessage = ""; // Mensaje de confirmación
    let errorMessage = "Error al cargar los datos";

    // Función para cargar los datos del país y año específicos
    async function fetchData() {
        try {
            let response = await fetch(API + "/" + country + "/" + year, {
                method: "GET",
            });

            let data = await response.json();

            // Verificar si se encontraron datos para el país y año especificados
            if (response.ok) {
                loadedSalarie = data;
            } else if (response.status === 404) {
                errorMessage = "No hay datos disponibles";
            }
        } catch (e) {
            console.error(e);
            errorMessage = "Error al cargar los datos";
        }
    }

    // Función para actualizar los datos
    async function updateData() {
        try {
            let response = await fetch(`${API}/country/${country}/year/${year}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loadedSalarie), // Incluir los datos actualizados
            });

            // Verificar el estado de la respuesta
            if (response.ok) {
                fetchData(); // Recargar los datos después de la actualización
                confirmationMessage = "Datos actualizados correctamente"; // Actualizar el mensaje de confirmación
            } else if (response.status === 404) {
                console.log("No existe un dato para este país y año");
            } else if (response.status === 400) {
                console.log("Campos incompletos o incorrectos");
            } else {
                console.log(`Error ${response.status}`);
            }
        } catch (e) {
            console.error(e);
        }
    }

    // Cargar los datos al montar el componente
    onMount(() => {
        fetchData();
    });
</script>


<p>Detalles del dato del país: {country} para el año {year}.</p>

<table>
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
                <td><input bind:value={loadedSalarie.year} /></td>
                <td><input bind:value={loadedSalarie.timestamp} /></td>
                <td><input bind:value={loadedSalarie.salary} /></td>
                <td><input bind:value={loadedSalarie.country} /></td>
                <td><input bind:value={loadedSalarie.primary_database} /></td>
                <td><input bind:value={loadedSalarie.time_with_this_database} /></td>
                <td><input bind:value={loadedSalarie.employment_state} /></td>
                <td><input bind:value={loadedSalarie.job_title} /></td>
                <td><input bind:value={loadedSalarie.manage_staff} /></td>
                <td><input bind:value={loadedSalarie.time_in_current_job} /></td>
                <td><input bind:value={loadedSalarie.other_people_on_your_team} /></td>
                <td><input bind:value={loadedSalarie.magnitude_of_company} /></td>
                <td><input bind:value={loadedSalarie.sector} /></td>
            
        </tr>
    </tbody>
</table>

<button on:click={updateData}>Actualizar dato </button>

{#if confirmationMessage}
    <p class="message confirmation">{confirmationMessage}</p>
{/if}