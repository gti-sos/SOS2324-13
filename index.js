// Imports
import express from "express";
import bodyParser from "body-parser";
import { loadWRIApi1 } from "./back/api-wris-datasets/v1/index.js";
import { loadWRIApi2 } from "./back/api-wris-datasets/v2/index.js";
import { loadMentalApi2 } from "./back/api-mentalhealth-datasets/v2/index.js";
import { loadSalarieApi2 } from "./back/api-salaries-datasets/v2/index.js";
import dataStore from "nedb";
import { handler } from "./front/build/handler.js";
import cors from "cors";
import request from "request";

// Configuracion del servidor
// Rubén Romero Guisado
let dbRisk = new dataStore();

// Antonio López Barrios
let dbMental = new dataStore();

// Aaron López Leal
let dbSalarie = new dataStore();
let app = express();
// Configuracion del puerto
const PORT = (process.env.PORT || 10000);
app.use(cors());
app.use(bodyParser.json());

// Cargar las functions de las APIs
// Rubén Romero Guisado
loadWRIApi1(app, dbRisk);
loadWRIApi2(app, dbRisk);

// Antonio López Barrios
loadMentalApi2(app, dbMental);

// Aaron López Leal
loadSalarieApi2(app, dbSalarie);

// Proxy: Rubén Romero Guisado
app.use("/proxyRRG", function (req, res) {
    var url = 'https://api.api-ninjas.com/v1/interestrate?country=Australia';
    console.log("piped: " + req.url);
    req.pipe(request(url)).pipe(res);
});

// Proxy: Aaron López Leal
app.use("/proxyALL", function (req, res) {
    var url = 'https://api.api-ninjas.com/v1/exercises?muscle=biceps';
    console.log("piped: " + req.url);
    req.pipe(request(url)).pipe(res);
});

// Cargamos el handler
app.use(handler);

// Logs del servidor
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
});

console.log(`Server initializing...`);