<script>
    import { onMount } from 'svelte';
    
    let employees = [];

onMount(() => {
    parseCSV(csvData);
});

function parseCSV(data) {
    employees = data.split('\n').slice(1).map(row => {
        const [
            year,
            timestamp,
            salary,
            country,
            primary_database,
            time_with_this_database,
            employment_state,
            job_title,
            manage_staff,
            time_in_current_job,
            other_people_on_your_team,
            magnitude_of_company,
            sector
        ] = row.split(',');
        return {
            year,
            timestamp,
            salary: parseInt(salary),
            country,
            primary_database,
            time_with_this_database: parseInt(time_with_this_database),
            employment_state,
            job_title,
            manage_staff,
            time_in_current_job: parseInt(time_in_current_job),
            other_people_on_your_team: parseInt(other_people_on_your_team),
            magnitude_of_company: parseInt(magnitude_of_company),
            sector
        };
    });
}

function deleteEmployee(index) {
    employees.splice(index, 1);
}

function deleteAllEmployees() {
    employees = [];
}
</script>

<table>
<thead>
    <tr>
        <th>Year</th>
        <th>Timestamp</th>
        <th>Salary</th>
        <th>Country</th>
        <th>Primary Database</th>
        <th>Time with this Database</th>
        <th>Employment State</th>
        <th>Job Title</th>
        <th>Manage Staff</th>
        <th>Time in Current Job</th>
        <th>Other People on Your Team</th>
        <th>Magnitude of Company</th>
        <th>Sector</th>
        <th>Actions</th>
    </tr>
</thead>
<tbody>
    {#each employees as employee, index}
        <tr>
            <td>{employee.year}</td>
            <td>{employee.timestamp}</td>
            <td>{employee.salary}</td>
            <td>{employee.country}</td>
            <td>{employee.primary_database}</td>
            <td>{employee.time_with_this_database}</td>
            <td>{employee.employment_state}</td>
            <td>{employee.job_title}</td>
            <td>{employee.manage_staff}</td>
            <td>{employee.time_in_current_job}</td>
            <td>{employee.other_people_on_your_team}</td>
            <td>{employee.magnitude_of_company}</td>
            <td>{employee.sector}</td>
            <td><button on:click={() => deleteEmployee(index)}>Delete</button></td>
        </tr>
    {/each}
</tbody>
</table>

<button on:click="{deleteAllEmployees}">Delete All Employees</button>