//CODIGO GENERAL DEL SERVIDOR -- NO TOCAR
let cool = require("cool-ascii-faces");
let express = require("express");
let bodyParser = require("body-parser");
let rubromguiAPI = require("./samples/RRG");

//inicio del servidor
let app = express();

app.use(bodyParser.json());
app.use("/", express.static("./public"));

// Esto va dentro de cada api personal: vaconst API_BASE = "/samples";
//Llamada a APIs de los integrantes del grupo
rubromguiAPI(app);
//API2(app);
//API3(app);

// Configuracion del puerto
const PORT = (process.env.PORT || 10000);
app.listen(PORT);
console.log(`Server listening on port ${PORT}.`);

// Ruta raíz "/"
app.get("/", (req,res)=>{
    res.send("<html><body><h1>Proyecto SOS2324-13</h1></body></html>");
});

// Ruta "/cool"
app.get("/cool", (req,res)=>{
    res.send(`<html><body><h1>${cool()}</h1></body></html>`);
});
