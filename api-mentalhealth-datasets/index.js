const API_BASE = "/api/v1/mentalhealth-datasets";

// Creamos un array vacío para almacenar los datos
var datos = [];

// Exportamos el módulo que maneja las operaciones de la API
module.exports = (app) => {

    // Método en la raiz
         //POST
         app.post(API_BASE + "/", (req, res) => {
            //pedimos el contenido
            let data = req.body;
    
            //veo si los datos ya existen (mismo pais y año)
            const exitenDatos = datos.some(g => g.country === g.country
                && g.year === g.year);
    
            //veo si los datos son validos
    
    
            if (exitenDatos) {
                //si ya existen
                res.sendStatus(409).json({ message: 'Hay un conflicto.409' });
            } else if (!data || Object.keys(data).length === 0) {
                //si no son validos
                res.sendStatus(400).json({ message: 'No es valido.400' })
            } else {
                //lo creamos
                datos.push(data);
                res.sendStatus(201).json({ message: 'Creado correctamente.200' })
            }
        });
            // GET
            app.get(API_BASE+ "/", (req, res) => {
            res.send(JSON.stringify(datos))
            res.sendStatus(200).json(Object.values(datos));
            });
    
            // DELETE
            app.delete(API_BASE+ "/", (req, res) => {
            datos.splice(0, datos.length);
            res.sendStatus(200).json({ message: 'Borrado correctamente.200' });
            });
    
             // PUT
            app.put(API_BASE+ "/", (req, res) => {
            res.sendStatus(405).json({ message: 'Método no permitido. No se puede usar PUT en la raiz.405' });
             });
       
       
























    // Método para cargar datos iniciales
    app.get(API_BASE + "/loadInitialData", (req, res) => {
        // Verificar si el array de datos está vacío
        if (datos.length === 0) {
            // Crear datos iniciales
            let data = [{country:"Afghanistan",code:"AFG",year:1990,schizophrenia:0.16056,bipolar_disorder:0.697779,eating_disorder:0.101855,anxiety_disorder:4.82883,drug_use_disorder:1.677082,depression:4.071831,alcoholism:0.672404},
            {country:"Afghanistan",code:"AFG",year:1991,schizophrenia:0.160312,bipolar_disorder:0.697961,eating_disorder:0.099313,anxiety_disorder:4.82974,drug_use_disorder:1.684746,depression:4.079531,alcoholism:0.671768},
            {country:"Afghanistan",code:"AFG",year:1992,schizophrenia:0.160135,bipolar_disorder:0.698107,eating_disorder:0.096692,anxiety_disorder:4.831108,drug_use_disorder:1.694334,depression:4.088358,alcoholism:0.670644},
            {country:"Afghanistan",code:"AFG",year:1993,schizophrenia:0.160037,bipolar_disorder:0.698257,eating_disorder:0.094336,anxiety_disorder:4.830864,drug_use_disorder:1.70532,depression:4.09619,alcoholism:0.669738},
            {country:"Albania",code:"ALB",year:1990,schizophrenia:0.193413,bipolar_disorder:0.695013,eating_disorder:0.130782,anxiety_disorder:3.327587,drug_use_disorder:0.497616,depression:2.139903,alcoholism:1.709465},
            {country:"Albania",code:"ALB",year:1991,schizophrenia:0.193393,bipolar_disorder:0.695294,eating_disorder:0.129102,anxiety_disorder:3.330348,drug_use_disorder:0.495687,depression:2.141201,alcoholism:1.708135},
            {country:"Afghanistan",code:"AFG",year:1996,schizophrenia:0.160249,bipolar_disorder:0.698914,eating_disorder:0.089709,anxiety_disorder:4.828083,drug_use_disorder:1.737643,depression:4.1075,alcoholism:0.667727},
            {country:"Afghanistan",code:"AFG",year:1997,schizophrenia:0.160554,bipolar_disorder:0.699127,eating_disorder:0.088372,anxiety_disorder:4.827726,drug_use_disorder:1.746891,depression:4.110834,alcoholism:0.66622},
            {country:"Argentina",code:"ARG",year:2017,schizophrenia:0.198094,bipolar_disorder:0.773376,eating_disorder:0.404033,anxiety_disorder:6.283678,drug_use_disorder:1.008901,depression:3.665488,alcoholism:1.824515},
            {country:"Armenia",code:"ARM",year:1990,schizophrenia:0.192443,bipolar_disorder:0.711719,eating_disorder:0.141317,anxiety_disorder:2.578688,drug_use_disorder:0.457313,depression:2.642647,alcoholism:2.155621},
            {country:"Afghanistan",code:"AFG",year:2000,schizophrenia:0.161621,bipolar_disorder:0.700015,eating_disorder:0.086021,anxiety_disorder:4.827047,drug_use_disorder:1.788395,depression:4.11861,alcoholism:0.662479}]; // Inserta tus datos iniciales aquí
            
            datos.push(data);
            res.sendStatus(201).json({ message: 'Datos iniciales creados correctamente.201' });
        } else {
            res.send(JSON.stringify(datos))
            res.sendStatus(200).json({ message: 'El array de datos ya contiene elementos.200' });
           
        }














   
   
   
   
   
     //PARA PAIS EN ESPECIFICO
        // GET
        app.get(API_BASE + "/:country", (req, res) => {
        const nombrePais = req.params.country;
        const pais = datosPais[nombrePais];
        if (pais) {
            res.sendStatus(200).json(pais);
        } else {
            res.sendStatus(404).json({ message: 'El pais especificado no fue encontrado. 404' });
        }
     });


        //PUT
        app.put(API_BASE + "/:country", (req, res) => {
        const nombrePais = req.params.country;
        if (!datosPais[nombrePais]) {
            res.sendStatus(404).json({ message: 'El pais especificado no fue encontrado. 404' });
        } else {
            datosPais[nombrePais] = req.body;
            res.sendStatus(200).json({ message: 'Datos del pais actualizados correctamente. 200' });
        }
    });

        // POST
         app.post(API_BASE + "/:country", (req, res) => {
        res.sendStatus(405).json({ message: 'Método no permitido. 405' });
        });

        // DELETE
        app.delete(API_BASE + "/:country", (req, res) => {
        const nombrePais = req.params.country;
        if (!datosPais[nombrePais]) {
            res.sendStatus(404).json({ message: 'El pais especificado no fue encontrado. 404' });
        } else {
            delete datosPais[nombrePais];
            res.sendStatus(200).json({ message: 'Pais eliminado correctamente. 200' });
        }
    });

        // ERROR 401(no sabia donde ponerlo)
         // Manejar el error 401 para solicitudes no autorizadas
        app.use((req, res, next) => {
        res.sendStatus(401).json({ message: 'No autorizado. Se requiere autenticación para acceder a este recurso. 401 ' });
    });
})};

