//CODIGO GENERAL DEL SERVIDOR
import express from "express";
import bodyParser from "body-parser";
import { loadWRIApi } from "./back/api-wris-datasets/index.js";
import { loadMentalApi2} from "./back/api-mentalhealth-datasets/v2/index.js";
import { loadSalarieApi2 } from "./back/api-salaries-datasets/v2/index.js";
import dataStore from "nedb";
import {handler} from "./front/build/handler.js";
import cors from "cors";

// Configuracion del servidor
let dbRisk = new dataStore();
let dbMental = new dataStore();
let dbSalarie = new dataStore();
let app = express();
// Configuracion del puerto
const PORT = (process.env.PORT || 10000);
app.use(cors());
app.use(bodyParser.json());

// Cargar las functions de las APIs
loadWRIApi(app, dbRisk);
loadMentalApi2(app, dbMental);
loadSalarieApi2(app, dbSalarie);

// Cargamos el handler
app.use(handler);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}.`);
});

console.log(`Server initializing...`);