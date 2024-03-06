const API_BASE = '/api/v1/mentalhealth-datasets';


// Datos de ejemplo
module.exports = (app,dbMental) => {
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
    db.find({ country: countryName }, (err, datosMental) => {
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

// POST para agregar nuevos datos 
app.post(API_BASE + "/", (req, res) => {
    // Pedimos el contenido
    let data = req.body;


    // Verificar si los datos son válidos
    if (!data || Object.keys(data).length === 0) {
        res.status(400).send("Bad Request,400");
     // Verificar si los datos ya existen (mismo país y año)
     dbMental.findOne({ country: data.country, year: data.year }, (err, existingData) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        if (existingData) {
            res.status(409).send("Conflict");
        } else {
            // Insertar nuevos datos
            dbMental.insert(data, (err, newData) => {
                if (err) {
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                res.status(201).send("Created");
            });
        }
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
    app.put(API_BASE +"/:country", (req, res) => {
        const countryName = req.params.country;
        const newData = req.body;
        

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
};


