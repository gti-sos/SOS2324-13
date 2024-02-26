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

//API RUBROMGUI
module.exports = (app) => {
    app.get(API_BASE+"/RRG", (req,res)=>{
        res.send(`<html><body><h1>${mediaCalculada}</h1></body></html>`);
    });
};