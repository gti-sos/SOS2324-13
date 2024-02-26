//CODIGO GENERAL DEL SERVIDOR -- NO TOCAR
let cool = require("cool-ascii-faces");
let express = require("express");
let bodyParser = require("body-parser");
let rubromguiAPI = require("./samples/RRG");
let antlopbarAPI = require("./samples/ALB");
let aarlopleaAPI = require("./samples/ALL");

//inicio del servidor
let app = express();

app.use(bodyParser.json());

// Esto va dentro de cada api personal: vaconst API_BASE = "/samples";
//Llamada a APIs de los integrantes del grupo
rubromguiAPI(app);
antlopbarAPI(app);
aarlopleaAPI(app);

// Configuracion del puerto
const PORT = (process.env.PORT || 10000);
app.listen(PORT);
console.log(`Server listening on port ${PORT}.`);

// Ruta raíz "/"
app.use("/", express.static("./home"));

// Ruta "/cool"
app.get("/cool", (req,res)=>{
    res.send(`<html><body><h1>${cool()}</h1></body></html>`);
});