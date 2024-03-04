// CODIGO API wris-datasets
const API_BASE = "/api/v1/wris-datasets";

var dataset = [];

/*
    --ERRORES--
    400: se intenta hacer un put/post de datos que no son validos
    404: se hace un get de datos que no existen
    405: se hace un post en "/" o un put en "/pais"
    409: se hace un post de datos que ya existen (coincide pais y año)
*/

module.exports = (app) => {
    //METODOS DEL DIRECTORIO RAIZ "/"
    //POST -- OK
    app.post(API_BASE + "/", (req, res) => {
        //pedimos el contenido
        let data = req.body;

        //veo si los datos ya existen (mismo pais y año)
        const datosExisten = dataset.some(d => d.country === data.country
            && d.year === data.year);

        //veo si los datos son validos


        if (datosExisten) {
            //si ya existen
            res.sendStatus(409, "Conflict");
        } else if (!data || Object.keys(data).length === 0) {
            //si no son validos
            res.sendStatus(400, "Bad Request");
        } else {
            //lo creamos
            dataset.push(data);
            res.sendStatus(201, "Created");
        }
    });

    //GET -- OK
    app.get(API_BASE + "/", (req, res) => {
        res.send(JSON.stringify(dataset))
        res.sendStatus(200, "Ok");
    });

    //PUT -- NOK
    app.put(API_BASE + "/", (req, res) => {
        //aunque no se autorice, el put recibe datos como cuerpo
        let data = req.body;
        res.sendStatus(405, "Method Not Allowed");
    });

    //DELETE -- OK
    app.delete(API_BASE + "/", (req, res) => {
        //como estamos en el directorio raiz,
        //el metodo delete borra todo
        dataset.splice(0, dataset.length);
        res.sendStatus(200, "Ok");
    });

    //METODO DE /loadInitialData
    //GET -- OK (/loadInitialData)
    app.get(API_BASE + "/loadInitialData", (req, res) => {
        //si el array esta vacio
        if (dataset.length === 0) {
            //se inicializa un post
            //este es el contenido a crear
            let data = [
                { country: "Kiribati", wri: 1.88, exposure: 3.31, vulnerability: 56.87, susceptibility: 41.52, lack_of_coping_capability: 83.54, lack_of_adaptive_capacity: 45.56, year: 2011, exposure_category: "Very Low", wri_category: "Very Low", vulnerability_category: "High", susceptibility_category: "High" },
                { country: "Kiribati", wri: 1.78, exposure: 3.05, vulnerability: 58.48, susceptibility: 42.90, lack_of_coping_capability: 82.49, lack_of_adaptive_capacity: 50.06, year: 2013, exposure_category: "Very Low", wri_category: "Very Low", vulnerability_category: "High", susceptibility_category: "High" },
                { country: "Kiribati", wri: 1.73, exposure: 3.05, vulnerability: 56.68, susceptibility: 41.19, lack_of_coping_capability: 83.69, lack_of_adaptive_capacity: 45.17, year: 2015, exposure_category: "Very Low", wri_category: "Very Low", vulnerability_category: "High", susceptibility_category: "High" },
                { country: "Malta", wri: 0.62, exposure: 1.65, vulnerability: 37.76, susceptibility: 15.25, lack_of_coping_capability: 59.94, lack_of_adaptive_capacity: 38.08, year: 2015, exposure_category: "Very Low", wri_category: "Very Low", vulnerability_category: "Low", susceptibility_category: "Very Low" },
                { country: "Malta", wri: 0.72, exposure: 2.15, vulnerability: 33.34, susceptibility: 15.21, lack_of_coping_capability: 50.13, lack_of_adaptive_capacity: 34.67, year: 2011, exposure_category: "Very Low", wri_category: "Very Low", vulnerability_category: "Very Low", susceptibility_category: "Very Low" },
                { country: "Katar", wri: 0.02, exposure: 0.05, vulnerability: 33.18, susceptibility: 9.40, lack_of_coping_capability: 52.12, lack_of_adaptive_capacity: 38.03, year: 2011, exposure_category: "Very Low", wri_category: "Very Low", vulnerability_category: "Very Low", susceptibility_category: "Very Low" },
                { country: "Vanuatu", wri: 36.43, exposure: 63.66, vulnerability: 57.23, susceptibility: 34.66, lack_of_coping_capability: 81.27, lack_of_adaptive_capacity: 55.77, year: 2013, exposure_category: "Very High", wri_category: "Very High", vulnerability_category: "High", susceptibility_category: "High" },
                { country: "France", wri: 2.69, exposure: 9.25, vulnerability: 29.08, susceptibility: 16.13, lack_of_coping_capability: 43.29, lack_of_adaptive_capacity: 27.83, year: 2014, exposure_category: "Very Low", wri_category: "Very Low", vulnerability_category: "Very Low", susceptibility_category: "Very Low" },
                { country: "Spain", wri: 3.20, exposure: 10.23, vulnerability: 31.27, susceptibility: 16.08, lack_of_coping_capability: 52.00, lack_of_adaptive_capacity: 25.74, year: 2014, exposure_category: "Low", wri_category: "Very Low", vulnerability_category: "Very Low", susceptibility_category: "Very Low" },
                { country: "Guatemala", wri: 20.88, exposure: 36.30, vulnerability: 57.53, susceptibility: 38.57, lack_of_coping_capability: 80.80, lack_of_adaptive_capacity: 53.21, year: 2013, exposure_category: "Very High", wri_category: "Very High", vulnerability_category: "High", susceptibility_category: "High" }
            ];
            //lo añadimos a la variable dataset
            dataset.push(data);
            res.sendStatus(201, "Array empty, new data created");
        } else {
            //se devuelven los datos
            res.send(JSON.stringify(dataset))
            res.sendStatus(200, "Ok");
        }
    });

    //METODOS DENTRO DE LA RUTA "/PAIS"
    //POST -- NOK
    app.post(API_BASE +"/:country", (req, res) => {
        const pais = req.params.country;

        //aunque no se autorice, el post recibe datos como cuerpo
        let data = req.body;
        //lo creamos
        res.sendStatus(405, "Method Not Allowed");
    });

    //GET -- OK
    app.get(API_BASE +"/:country", (req, res) => {
        const pais = req.params.country;

        //filtro para obtener los datos del pais introducido
        const countryData = dataset.filter(p => p.country === pais);

        //veo si existen esos datos
        if (countryData.length > 0) {
            res.send(JSON.stringify(countryData))
            res.sendStatus(200, "Ok");
        } else {
            res.sendStatus(404, "Not Found");
        }
    });

    //PUT -- OK
    app.put(API_BASE +"/:country", (req, res) => {
        const pais = req.params.country;
        let data = req.body;
        const countryNameBody = data.country

        //filtro para obtener los datos del pais introducido
        if (pais !== countryNameBody) {
            res.status(400).json({ message: 'Error 400, bad reequest' });
            return;
          }
          

        //veo si los datos introducidos no son vacios (si son validos)
        if (!data || Object.keys(data).length === 0 || data.country !== pais) {
            res.sendStatus(400, "Bad Request");
        } else {
            countryData.push(data);
            res.sendStatus(200, "Ok");
        }
    });

    //DELETE -- OK
    app.delete(API_BASE +"/:country", (req, res) => {
        //como estamos en el directorio de un pais,
        //el metodo delete borra todo de ese pais
        const pais = req.params.country;

        //filtro el dataset para quedarme solo con las filas que 
        //no son del pais a eliminar
        const nuevoDataset = dataset.filter(entry => entry.country !== pais);

        // vemos si se ha eliminado al menos una fila
        if (nuevoDataset.length < dataset.length) {
            dataset = nuevoDataset;
            res.sendStatus(200, "Ok");
        } else {
            //si no se ha borrado ninguna fila, ese pais no existe
            //en el dataset
            res.sendStatus(404, "Not Found");
        }
    });

};