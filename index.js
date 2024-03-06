//CODIGO GENERAL DEL SERVIDOR -- NO TOCAR
let cool = require("cool-ascii-faces");
let express = require("express");
let bodyParser = require("body-parser");
let dataStore = require("nedb"); 
let dbMental = new dataStore();

let wris_datasetsAPI = require("./api-wris-datasets");
let mentalhealth_datasetsAPI = require("./api-mentalhealth-datasets")

//inicio del servidor
let app = express();
// Configuracion del puerto
const PORT = (process.env.PORT || 10000);

app.use(bodyParser.json());

wris_datasetsAPI(app);
mentalhealth_datasetsAPI(app,dbMental);

app.listen(PORT);
console.log(`Server listening on port ${PORT}.`);

// Ruta raíz "/"
app.use("/", express.static("./home"));

// Ruta "/cool"
app.get("/cool", (req,res)=>{
    res.send(`<html><body><h1>${cool()}</h1></body></html>`);
});

//CODIGO RUBROMGUI F03
let dataset = 
    [{ country: "Kiribati", wri: 1.88, exposure: 3.31, vulnerability: 56.87, susceptibility: 41.52, lack_of_coping_capability: 83.54, lack_of_adaptive_capacity: 45.56, year: 2011, exposure_category: "Very Low", wri_category: "Very Low", vulnerability_category: "High", susceptibility_category: "High"},
     { country: "Kiribati", wri: 1.78, exposure: 3.05, vulnerability: 58.48, susceptibility: 42.90, lack_of_coping_capability: 82.49, lack_of_adaptive_capacity: 50.06, year: 2013, exposure_category: "Very Low", wri_category: "Very Low", vulnerability_category: "High", susceptibility_category: "High"},
     { country: "Kiribati", wri: 1.73, exposure: 3.05, vulnerability: 56.68, susceptibility: 41.19, lack_of_coping_capability: 83.69, lack_of_adaptive_capacity: 45.17, year: 2015, exposure_category: "Very Low", wri_category: "Very Low", vulnerability_category: "High", susceptibility_category: "High"},
     { country: "Malta", wri: 0.62, exposure: 1.65, vulnerability: 37.76, susceptibility: 15.25, lack_of_coping_capability: 59.94, lack_of_adaptive_capacity: 38.08, year: 2015, exposure_category: "Very Low", wri_category: "Very Low", vulnerability_category: "Low", susceptibility_category: "Very Low"},
     { country: "Malta", wri: 0.72, exposure: 2.15, vulnerability: 33.34, susceptibility: 15.21, lack_of_coping_capability: 50.13, lack_of_adaptive_capacity: 34.67, year: 2011, exposure_category: "Very Low", wri_category: "Very Low", vulnerability_category: "Very Low", susceptibility_category: "Very Low"},
     { country: "Katar", wri: 0.02, exposure: 0.05, vulnerability: 33.18, susceptibility: 9.40, lack_of_coping_capability: 52.12, lack_of_adaptive_capacity: 38.03, year: 2011, exposure_category: "Very Low", wri_category: "Very Low", vulnerability_category: "Very Low", susceptibility_category: "Very Low"},
     { country: "Vanuatu", wri: 36.43, exposure: 63.66, vulnerability: 57.23, susceptibility: 34.66, lack_of_coping_capability: 81.27, lack_of_adaptive_capacity: 55.77, year: 2013, exposure_category: "Very High", wri_category: "Very High", vulnerability_category: "High", susceptibility_category: "High"},
     { country: "France", wri: 2.69, exposure: 9.25, vulnerability: 29.08, susceptibility: 16.13, lack_of_coping_capability: 43.29, lack_of_adaptive_capacity: 27.83, year: 2014, exposure_category: "Very Low", wri_category: "Very Low", vulnerability_category: "Very Low", susceptibility_category: "Very Low"},
     { country: "Spain", wri: 3.20, exposure: 10.23, vulnerability: 31.27, susceptibility: 16.08, lack_of_coping_capability: 52.00, lack_of_adaptive_capacity: 25.74, year: 2014, exposure_category: "Low", wri_category: "Very Low", vulnerability_category: "Very Low", susceptibility_category: "Very Low"},
     { country: "Guatemala", wri: 20.88, exposure: 36.30, vulnerability: 57.53, susceptibility: 38.57, lack_of_coping_capability: 80.80, lack_of_adaptive_capacity: 53.21, year: 2013, exposure_category: "Very High", wri_category: "Very High", vulnerability_category: "High", susceptibility_category: "High"},
     { country: "Bangladesch", wri: 19.81, exposure: 31.70, vulnerability: 62.50, susceptibility: 40.92, lack_of_coping_capability: 86.23, lack_of_adaptive_capacity: 60.34, year: 2013, exposure_category: "Very High", wri_category: "Very High", vulnerability_category: "High", susceptibility_category: "High"}];

// b) Algoritmo que calcula la media de una columna para un determinado valor geográfico. 
//     He escogido "susceptibility" y "Kiribati" como ejemplo.
let suma = 0;
let contador = 0;
dataset
    .filter((data)=>{
        return data.country == "Kiribati";
    }).map((data)=>{
        return data.susceptibility;
    }).forEach((valor) => {
        suma += valor;
        contador++;
    }); // Acumula la suma

let mediaCalculada = suma / contador; // Divide entre el numero de veces que aparece un dato

//API SAMPLES RUBROMGUI
app.get("/samples/RRG", (req,res)=>{
    res.send(`<html><body><h1><p>La media calculada es: ${mediaCalculada}</p></h1></body></html>`);
});





//CODIGO ANTLOPBAR
let dataset2 = 
[{country:"Afghanistan",code:"AFG",year:1990,schizophrenia:0.16056,bipolar_disorder:0.697779,eating_disorder:0.101855,anxiety_disorder:4.82883,drug_use_disorder:1.677082,depression:4.071831,alcoholism:0.672404},
{country:"Afghanistan",code:"AFG",year:1991,schizophrenia:0.160312,bipolar_disorder:0.697961,eating_disorder:0.099313,anxiety_disorder:4.82974,drug_use_disorder:1.684746,depression:4.079531,alcoholism:0.671768},
{country:"Afghanistan",code:"AFG",year:1992,schizophrenia:0.160135,bipolar_disorder:0.698107,eating_disorder:0.096692,anxiety_disorder:4.831108,drug_use_disorder:1.694334,depression:4.088358,alcoholism:0.670644},
{country:"Afghanistan",code:"AFG",year:1993,schizophrenia:0.160037,bipolar_disorder:0.698257,eating_disorder:0.094336,anxiety_disorder:4.830864,drug_use_disorder:1.70532,depression:4.09619,alcoholism:0.669738},
{country:"Albania",code:"ALB",year:1990,schizophrenia:0.193413,bipolar_disorder:0.695013,eating_disorder:0.130782,anxiety_disorder:3.327587,drug_use_disorder:0.497616,depression:2.139903,alcoholism:1.709465},
{country:"Albania",code:"ALB",year:1991,schizophrenia:0.193393,bipolar_disorder:0.695294,eating_disorder:0.129102,anxiety_disorder:3.330348,drug_use_disorder:0.495687,depression:2.141201,alcoholism:1.708135},
{country:"Afghanistan",code:"AFG",year:1996,schizophrenia:0.160249,bipolar_disorder:0.698914,eating_disorder:0.089709,anxiety_disorder:4.828083,drug_use_disorder:1.737643,depression:4.1075,alcoholism:0.667727},
{country:"Afghanistan",code:"AFG",year:1997,schizophrenia:0.160554,bipolar_disorder:0.699127,eating_disorder:0.088372,anxiety_disorder:4.827726,drug_use_disorder:1.746891,depression:4.110834,alcoholism:0.66622},
{country:"Argentina",code:"ARG",year:2017,schizophrenia:0.198094,bipolar_disorder:0.773376,eating_disorder:0.404033,anxiety_disorder:6.283678,drug_use_disorder:1.008901,depression:3.665488,alcoholism:1.824515},
{country:"Armenia",code:"ARM",year:1990,schizophrenia:0.192443,bipolar_disorder:0.711719,eating_disorder:0.141317,anxiety_disorder:2.578688,drug_use_disorder:0.457313,depression:2.642647,alcoholism:2.155621},
{country:"Afghanistan",code:"AFG",year:2000,schizophrenia:0.161621,bipolar_disorder:0.700015,eating_disorder:0.086021,anxiety_disorder:4.827047,drug_use_disorder:1.788395,depression:4.11861,alcoholism:0.662479}];


//Algoritmo que calcula la media de esquizofrenia para el pais AFGHANISTAN.
let suma2 = 0;
let contador2 = 0;
dataset2
    .filter((data)=>{
        return data.country == "Afghanistan";
    }).map((data)=>{
        return data.schizophrenia;
    }).forEach((valor) => {
        suma2 += valor;
        contador2++;
    }); // Acumula la suma

let mediaCalculada2 = suma2 / contador2;
//Devolvemos la media calculada

//API ANTLOPBAR

app.get("samples/ALB", (req,res)=>{
    res.send(`<html><body><h1>${mediaCalculada2}</h1></body></html>`);
});





//CODIGO AARLOPLEA
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
      suma3 += valor;
      contador3++;
  });

let mediaCalculada3 = suma3 / contador3;

console.log(mediaCalculada3);

app.get("samples/ALL", (req,res)=>{
    res.send(`<html><body><h1>Salario Medio en Estados Unidos</h1>
  <p>La media calculada para Estados Unidos es:  ${mediaCalculada3} </p> </body></html>`);
});
