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

    // Función para cargar los datos del país y año específicos
    async function fetchData() {
        try {
            let response = await fetch(API + "/" + country + "/" + year, {
                method: "GET",
            });

            let data = await response.json();

            // Verificar si se encontraron datos para el país y año especificados
            if (response.ok) {
                loadedSalarie = salarie;
            } else if (response.status === 404) {
                console.log("No hay datos disponibles");
            }
        } catch (e) {
            console.error(e);
        }
    }

    // Función para actualizar los datos
    async function updateData() {
        try {
            let response = await fetch(API + "/" + country + "/" + year, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(loadedSalarie),
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
            <td><input bind:value={loadedSalarie.country} /></td>
            <td><input bind:value={loadedSalarie.code} /></td>
            <td><input bind:value={loadedSalarie.schizophrenia} /></td>
            <td><input bind:value={loadedSalarie.bipolar_disorder} /></td>
            <td><input bind:value={loadedSalarie.eating_disorder} /></td>
            <td><input bind:value={loadedSalarie.anxiety_disorder} /></td>
            <td><input bind:value={loadedSalarie.drug_use_disorder} /></td>
            <td><input bind:value={loadedSalarie.depression} /></td>
            <td><input bind:value={loadedSalarie.alcoholism} /></td>
            <td><input bind:value={loadedSalarie.year} /></td>
        </tr>
    </tbody>
</table>

<button on:click={updateData}>Actualizar dato </button>

{#if confirmationMessage}
    <p class="message confirmation">{confirmationMessage}</p>
{/if}