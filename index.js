//CODIGO GENERAL DEL SERVIDOR
let express = require("express");
let bodyParser = require("body-parser");
let dataStore = require("nedb"); 
let riskData = new dataStore();
let dbMental = new dataStore();
let salarieDB = new dataStore();

let wris_datasetsAPI = require("./api-wris-datasets");
let mentalhealth_datasetsAPI = require("./api-mentalhealth-datasets");
let salaries_datasetsAPI = require("./api-salaries-datasets")

//inicio del servidor
let app = express();
// Configuracion del puerto
const PORT = (process.env.PORT || 10000);

app.use(bodyParser.json());

wris_datasetsAPI(app, riskData);
mentalhealth_datasetsAPI(app,dbMental);
salaries_datasetsAPI(app ,salarieDB )

app.listen(PORT);
console.log(`Server listening on port ${PORT}.`);

// Ruta raíz "/"
app.use("/", express.static("./home"));