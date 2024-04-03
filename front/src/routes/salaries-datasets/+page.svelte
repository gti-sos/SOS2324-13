<script>
    import {onMount} from "svelte";
    import {dev} from "$app/enviroment";

    let API = "/api/v1/salaries-datasets";

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

    async function deleteContact(n){
        console.log(`Deleting contact with name ${n}`);
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

</script>

<ul>
    {#each salaries as salarie}
        <li>{salarie.country}</li>
    {/each}
</ul>

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