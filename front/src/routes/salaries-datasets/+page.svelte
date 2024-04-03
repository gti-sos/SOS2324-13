<script>
    import {onMount} from "svelte";
    import {dev} from "$app/environment";

    let API = "/api/v2/salaries-datasets";

    if(dev)
        API = "https://localhost:10000"+API;

    let salaries = []
    let newSalarie = {
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
    
     let errorMsg="";
     let confirmation="";

    onMount(()=>{
        getData();
    })

    async function getData(){
        try{
            let respone = await fetch(API,{
                                method: "GET"
                                });
        let data = await respone.json();
        salaries = salarie;
        console.log(salarie);
    }catch(e){
        errorMsg = e;                        
    }}

    async function loadData() {
        try {
            const response = await fetch(API + "/loadInitialData", { method: "GET" });
            const status = response.status;
            if (status === 201) {
                confirmation = "Datos cargados correctamente";
            } else {
                errorMsg = `Error ${status}: Los datos ya han sido cargados`;
            }
        } catch (error) {
            errorMsg = error.message;
        }
    }

    async function createData(){ 
        try{
            let response =  await   fetch(API,{
                                    method: "POST",
                                    headers:{
                                        "Content-Type": "application/json"
                                    },
                                    body: JSON.stringify(newSalarie)
                                });

            let status = await response.status;
            console.log(`Creation response status ${status}`);
            if(status == 201)
                getData();
            else
                errorMsg = "code:"+status;

    
        }catch(e){
            errorMsg = e;
        } 
    }

    async function deleteData(n){
        console.log(`Deleting contact with country ${n}`);
        try{
            let response =  await   fetch(API+"/"+n,{
                                    method: "DELETE"
                                    });
    
        if(response.status == 200)
        getContacts();
        else
            errorMsg = "code:"+response.status;
    
            }catch(e){
                    errorMsg = e;
            } 
} 

async function deleteAllData() {
        try {
            const response = await fetch(API, { method: "DELETE" });
            const status = response.status;
            if (status === 200) {
                salaries = [];
                confirmation = "Todos los datos eliminados";
            } else {
                errorMsg = `Error ${status}: No se pudieron eliminar los datos`;
            }
        } catch (error) {
            errorMsg = error.message;
        }
    }
</script>

<div class="container">
    <h1>Salaries Datasets</h1>

    <button on:click={loadData}>Cargar datos iniciales</button>
    <button on:click={getData}>Obtener todos los datos</button>
    <button on:click={createData}>Crear nuevo dato</button>
    <button on:click={deleteAllData}>Eliminar todos los datos</button>

    <ul class="data-list">
        {#each salaries as salarie}
            <li class="data-item">
                <span>{salarie.year}, {salarie.timestamp}, {salarie.salary}, {salarie.country}, {salarie.primary_database}, {salarie.time_with_this_database}, {salarie.employment_state}, {salarie.job_title}, {salarie.manage_staff}, {salarie.time_in_current_job}, {salarie.other_people_on_your_team}, {salarie.magnitude_of_company}, {salarie.sector}</span>
                <button on:click={() => deleteData(salarie.year, salarie.country)}>Eliminar</button>
            </li>
        {/each}
    </ul>

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
    <!-- Inputs para agregar nuevos datos -->
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
            <td><button on:click={createData}>Crear</button></td>
        </tr>
    </tbody>
</table>
</div>