const API_BASE = '/api/v1/mentalhealth-datasets';




// Datos de ejemplo
module.exports = (app,dbMental) => {


// Ruta para redirigir al portal de documentación de Postman
app.get('/api/v1/mentalhealth-datasets/docs', (req, res) => {
    // Redirigir al portal de documentación de Postman
    res.redirect('https://documenter.getpostman.com/view/32965348/2sA2xh1rtd');
});






  //BUSQUEDA Y PAGINACION
    // Ruta para realizar búsquedas por todos los campos del recurso
    app.get(API_BASE + "/search", (req, res) => {
        const query = req.query;

         // Convertir valores numéricos a números si es necesario
    for (const key in query) {
        if (!isNaN(query[key])) {
            query[key] = parseFloat(query[key]);
            }
        }
    
        // Realizar la búsqueda en la base de datos
        dbMental.find(query, (err, result) => {
                if (err) {
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                if (result.length > 0) {
                    res.status(200).json(result);
                } else {
                    res.status(404).json({ message: 'No matching data found' });
                }
            });
        });
    
        // Ruta para obtener datos con paginación
    app.get(API_BASE + "/", (req, res) => {
        const limit = parseInt(req.query.limit) || 10; // Límite predeterminado: 10
        const offset = parseInt(req.query.offset) || 0; // Offset predeterminado: 0
    
        dbMental.find({})
            .skip(offset)
            .limit(limit)
            .exec((err, data) => {
                if (err) {
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                if (data.length > 0) {
                    res.status(200).json(data);
                } else {
                    res.status(404).json({ message: 'Data not found' });
                }
            });
    });
    











    // Método para cargar datos iniciales si el array está vacío
app.get(API_BASE + "/loadInitialData", (req, res) => {
    dbMental.find({}, (err, datosMental) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (datosMental.length === 0) {
    let initialData = [{country:"Afghanistan",code:"AFG",year:1990,schizophrenia:0.16056,bipolar_disorder:0.697779,eating_disorder:0.101855,anxiety_disorder:4.82883,drug_use_disorder:1.677082,depression:4.071831,alcoholism:0.672404},
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
    dbMental.insert(initialData, (err, newDocs) => {
                if (err) {
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                res.status(201).json({ message: 'Created initial data' });
            });
        } else {
            res.status(409).json({ message: 'Data already exists' });
        }
    });
});

// GET para obtener todos los datos
app.get(API_BASE, (req, res) => {
    dbMental.find({}, (err, datosMental) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (datosMental.length > 0) {
            res.status(200).json(datosMental);
        } else {
            res.status(404).json({ message: 'Data not found' });
        }
    });
});

// GET para obtener datos de un país específico
app.get(API_BASE + "/:country", (req, res) => {
    const countryName = req.params.country;
    dbMental.find({ country: countryName }, (err, datosMental) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (datosMental.length > 0) {
            res.status(200).json(datosMental);
        } else {
            res.status(404).json({ message: 'Country not found' });
        }
    });
});

//GET AÑO CONCRETO
// GET para obtener datos de un año concreto
app.get(API_BASE + "/year/:year", (req, res) => {
    let year = req.params.year;

    // Verificar si year es una cadena que puede ser parseada a un número
    if (isNaN(year)) {
        res.status(400).json({ error: 'Invalid year' });
        return;
    }

    // Parsear year a un número entero
    year = parseInt(year);

    // Realizar la búsqueda en la base de datos
    dbMental.find({ year: year }, (err, data) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (data.length > 0) {
            res.status(200).json(data);
        } else {
            res.status(404).json({ message: 'Data not found for the specified year' });
        }
    });
});

















//GET PAIS Y AÑO CONCRETO
app.get(`${API_BASE}/country/:country/:year`, (req, res) => {
    const countryName = req.params.country;
    const year = parseInt(req.params.year); // Parsear el año como un número entero

    // Verificar si el año es válido
    if (isNaN(year)) {
        res.status(400).json({ error: 'Invalid year' });
        return;
    }

    // Aquí se construye el filtro para buscar por país y año específico
    dbMental.findOne({ country: countryName, year: year }, (err, datosMental) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (datosMental) {
            res.status(200).json(datosMental); // Devuelve un solo objeto
        } else {
            res.status(404).json({ message: 'Data not found for the specified country and year' });
        }
    });
});

//POST GENERAL
app.post(API_BASE + "/", (req, res) => {
    // Pedimos el contenido
    let data = req.body;
    const expectedFields = ['country', 'code', 'year', 'schizophrenia','bipolar_disorder','eating_disorder','anxiety_disorder','drug_use_disorder','depression','alcoholism'];
    const receivedFields = Object.keys(data);

    const isValidData = expectedFields.every(field => receivedFields.includes(field));

    // Verificar si los datos son válidos
    if (!isValidData) {
        return res.status(400).send("Bad Request");
    } else{

    // Verificar si los datos ya existen (mismo país y año)
    dbMental.findOne({ country: data.country, year: data.year }, (err, existingData) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (existingData) {
            return res.status(409).send("Conflict");
        }
        
        // Insertar nuevos datos
        dbMental.insert(data, (err, newData) => {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            return res.status(201).send("Created");
        });
    });
}});


//POST PARA PAIS CONCRETO
app.post(API_BASE + "/:country", (req, res) => {
    res.status(405).json({ error: 'Method not allowed,405' });
})

// PUT GENERAL - Método no permitido
app.put(API_BASE + "/", (req, res) => {
    res.status(405).json({ error: 'Method not allowed,405' });
})
// PUT para actualizar datos de un país específico
app.put(API_BASE + "/:country", (req, res) => {
    const countryName = req.params.country;
    const newData = req.body;
    const expectedFields = ['country', 'code', 'year', 'schizophrenia','bipolar_disorder','eating_disorder','anxiety_disorder','drug_use_disorder','depression','alcoholism'];
    const receivedFields = Object.keys(newData);

    const isValidData = expectedFields.every(field => receivedFields.includes(field));

    // Verificar si los datos son válidos
    if (!isValidData) {
        return res.status(400).send("Bad Request");
    } else{

    // Verificar que el ID en el cuerpo coincida con el ID en la URL
    if (newData.country && newData.country !== countryName) {
        res.status(400).json({ error: 'Mismatched ID in the request body' });
        return;
    }

    dbMental.update({ country: countryName }, { $set: newData }, { multi: true }, (err, numUpdated) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (numUpdated > 0) {
            res.status(200).json({ message: 'Updated' });
        } else {
            res.status(404).json({ message: 'Country not found' });
        }
    });
}});


// PUT para actualizar datos de un país específico en un año específico
app.put(API_BASE+ "/:country/:year", (req, res) => {
    const countryName = req.params.country;
    const year = parseInt(req.params.year);
    const newData = req.body;
    const expectedFields = ['code', 'schizophrenia', 'bipolar_disorder', 'eating_disorder', 'anxiety_disorder', 'drug_use_disorder', 'depression', 'alcoholism'];

    // Verificar si los datos incluyen los campos esperados
    const isValidData = expectedFields.every(field => field in newData);

    if (!isValidData) {
        return res.status(400).json({ error: 'Missing or invalid fields in the request body' });
    }

    // Verificar si hay un ID de país en la solicitud y si coincide con el ID en la URL
    if (newData.country && newData.country !== countryName) {
        return res.status(400).json({ error: 'Mismatched country ID in the request body' });
    }

    // Verificar si hay un año en la solicitud y si coincide con el año en la URL
    if (newData.year && newData.year !== year) {
        return res.status(400).json({ error: 'Mismatched year in the request body' });
    }

    // Actualizar los datos en la base de datos para el país y el año específicos
    dbMental.update({ country: countryName, year: year }, { $set: newData }, { multi: true }, (err, numUpdated) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (numUpdated > 0) {
            return res.status(200).json({ message: 'Updated' });
        } else {
            return res.status(404).json({ message: 'Country or year not found' });
        }
    });
});




// DELETE para eliminar todos los datos
app.delete(API_BASE, (req, res) => {
    dbMental.remove({}, { multi: true }, (err, numRemoved) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(200).json({ message: 'Deleted' });
    });
});

// DELETE para eliminar datos de un país específico
app.delete(API_BASE + "/:country", (req, res) => {
    const countryName = req.params.country;
    dbMental.remove({ country: countryName }, { multi: true }, (err, numRemoved) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (numRemoved > 0) {
            res.status(200).json({ message: 'Deleted' });
        } else {
            res.status(404).json({ message: 'Country not found' });
        }
    });
});








//BUSQUEDA PAIS CONCRETO PERIODO
// GET para obtener estadísticas de un país en un periodo específico
app.get(API_BASE+ "/statistics/:country/:startYear/:endYear", (req, res) => {
    const countryName = req.params.country;
    const startYear = parseInt(req.params.startYear);
    const endYear = parseInt(req.params.endYear);

    // Verificar si los años son válidos
    if (isNaN(startYear) || isNaN(endYear) || startYear > endYear) {
        return res.status(400).json({ error: 'Invalid years' });
    }

    // Realizar la búsqueda en la base de datos de las estadísticas para el país y el periodo especificados
    dbMental.find({ country: countryName, year: { $gte: startYear, $lte: endYear } }, (err, statistics) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (statistics.length > 0) {
            return res.status(200).json(statistics);
        } else {
            return res.status(404).json({ message: 'No statistics found for the specified country and period' });
        }
    });
});



// GET para obtener estadísticas en un periodo específico sin un país concreto
app.get(`${API_BASE}/statistics2/:startYear/:endYear`, (req, res) => {
    const startYear = parseInt(req.params.startYear);
    const endYear = parseInt(req.params.endYear);

    // Verificar si los años son válidos
    if (isNaN(startYear) || isNaN(endYear) || startYear > endYear) {
        return res.status(400).json({ error: 'Invalid years' });
    }

    // Realizar la búsqueda en la base de datos de las estadísticas para el periodo especificado
    dbMental.find({ year: { $gte: startYear, $lte: endYear } }, (err, statistics) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (statistics.length > 0) {
            return res.status(200).json(statistics);
        } else {
            return res.status(404).json({ message: 'No statistics found for the specified period' });
        }
    });
});




}

