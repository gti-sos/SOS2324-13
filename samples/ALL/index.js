let dataset3 = [
    { year: 2021, timestamp: "12/10/2020 8:22:42", salary: 65000, country: "Sweden", primary_database: "Microsoft SQL Server", time_with_this_database: 4, employment_state: "Full time employee", job_title: "Developer: Business Intelligence (SSRS, PowerBI, etc)", manage_staff: "Yes", time_in_current_job: 4, other_people_on_your_team: "None", magnitude_of_company: 2, sector: "Private business" },
    { year: 2021, timestamp: "12/10/2020 8:23:22", salary: 145000, country: "United States", primary_database: "Microsoft SQL Server", time_with_this_database: 15, employment_state: "Full time employee", job_title: "DBA (Production Focus - build & troubleshoot servers, HA/DR)", manage_staff: "No", time_in_current_job: 25, other_people_on_your_team: "None", magnitude_of_company: 74, sector: "Private business" },
    { year: 2021, timestamp: "12/10/2020 8:23:37", salary: 105000, country: "United States", primary_database: "Microsoft SQL Server", time_with_this_database: 12, employment_state: "Full time employee", job_title: "DBA (General - splits time evenly between writing & tuning queries AND building & troubleshooting servers)", manage_staff: "Yes", time_in_current_job: 6, other_people_on_your_team: "1", magnitude_of_company: 500, sector: "Private business" },
    { year: 2021, timestamp: "12/10/2020 8:23:48", salary: 46482, country: "United Kingdom", primary_database: "Microsoft SQL Server", time_with_this_database: 10, employment_state: "Full time employee", job_title: "DBA (Production Focus - build & troubleshoot servers, HA/DR)", manage_staff: "No", time_in_current_job: 5, other_people_on_your_team: "None", magnitude_of_company: 35, sector: "Education (K-12, college, university)" },
    { year: 2021, timestamp: "12/10/2020 8:24:03", salary: 98800, country: "United States", primary_database: "Microsoft SQL Server", time_with_this_database: 5, employment_state: "Full time employee", job_title: "Developer: Business Intelligence (SSRS, PowerBI, etc)", manage_staff: "No", time_in_current_job: 5, other_people_on_your_team: "None", magnitude_of_company: 50, sector: "Private business" },
    { year: 2021, timestamp: "12/10/2020 8:24:39", salary: 2500, country: "Pakistan", primary_database: "Microsoft SQL Server", time_with_this_database: 14, employment_state: "Full time employee", job_title: "Manager", manage_staff: "Yes", time_in_current_job: 14, other_people_on_your_team: "1", magnitude_of_company: 20, sector: "Private business" },
    { year: 2021, timestamp: "12/10/2020 8:24:45", salary: 100800, country: "United States", primary_database: "Microsoft SQL Server", time_with_this_database: 14, employment_state: "Full time employee", job_title: "Developer: App code (C#, JS, etc)", manage_staff: "No", time_in_current_job: 14, other_people_on_your_team: "More than 5", magnitude_of_company: 5, sector: "Private business" },
    { year: 2021, timestamp: "12/10/2020 8:24:46", salary: 160000, country: "United States", primary_database: "PostgreSQL", time_with_this_database: 2, employment_state: "Full time employee of a consulting/contracting company", job_title: "Manager", manage_staff: "Yes", time_in_current_job: 9, other_people_on_your_team: "1", magnitude_of_company: 1000, sector: "Private business" },
    { year: 2021, timestamp: "12/10/2020 8:25:12", salary: 105000, country: "United States", primary_database: "Microsoft SQL Server", time_with_this_database: 10, employment_state: "Full time employee", job_title: "DBA (General - splits time evenly between writing & tuning queries AND building & troubleshooting servers)", manage_staff: "No", time_in_current_job: 2, other_people_on_your_team: "4", magnitude_of_company: 50, sector: "Private business" },
    { year: 2021, timestamp: "12/10/2020 8:25:36", salary: 61100, country: "United Kingdom", primary_database: "Microsoft SQL Server", time_with_this_database: 10, employment_state: "Full time employee", job_title: "Developer: T-SQL", manage_staff: "Yes", time_in_current_job: 10, other_people_on_your_team: "None", magnitude_of_company: 7, sector: "Private business" },
    { year: 2021, timestamp: "12/10/2020 8:25:51", salary: 18000, country: "Paraguay", primary_database: "Microsoft SQL Server", time_with_this_database: 5, employment_state: "Full time employee", job_title: "DBA (General - splits time evenly between writing & tuning queries AND building & troubleshooting servers)", manage_staff: "No", time_in_current_job: 5, other_people_on_your_team: "None", magnitude_of_company: 20, sector: "Private business" },
  ];


let suma3 = 0;
let contador3 = 0;

dataset3
  .filter((data) => data.country === "United States")
  .map((data) => data.salary)
  .forEach((valor) => {
      suma += valor;
      contador++;
  });

let mediaCalculada3 = suma3 / contador3;

console.log("Media calculada para United States - Salary: ", mediaCalculada3);

module.exports = (app) => {
    app.get(API_BASE+"/ALL", (req,res)=>{
        res.send(`<html><body><h1>${mediaCalculada3}</h1></body></html>`);
    });
};