const API_BASE = '/api/v1/wris-datasets';

function loadWRIApi(app, dataset) {

    // PAGINA "/DOCS"
    // GET -- OK
    app.get(API_BASE + '/docs', (req, res) => {
        res.redirect('https://documenter.getpostman.com/view/32976490/2sA2xh3YgN');
    });

    // RUTA "/loadInitialData"
    // GET -- OK
    app.get(API_BASE + "/loadInitialData", (req, res) => {
        dataset.find({}, (err, riskData) => {
            if (err) {
                res.status(500).json({ error: '500, Internal Server Error' });
                return;
            }
            if (riskData.length === 0) {
                let initialData = [
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

                dataset.insert(initialData, (err, newDocs) => {
                    if (err) {
                        res.status(500).json({ error: '500, Internal Server Error' });
                        return;
                    }
                    res.status(201).json({ message: '201, Created initial data' });
                });
            } else {
                res.status(409).json({ message: '409, Data already exists' });
            }
        });
    });

    //===============================================================================//
    //                      METODOS DE LA RUTA RAIZ + "/"                            //
    //===============================================================================//

    // RUTA RAIZ
    // GET -- OK
    app.get(API_BASE, (req, res) => {
        // EN CASO DE PONER ?limit=xx o ?offset=yy o ?fields=...,... 
        // los encuentra directamente en la peticion (forma dinámica)
        const { limit, offset, fields, ...searchParams } = req.query;

        // obtengo los datos del dataset
        dataset.find(searchParams, (err, riskData) => {
            if (err) {
                return res.status(500).json({ error: '500, Internal Server Error' });
            }

            // aplico limit y offset
            let resultData = riskData;
            if (limit) {
                resultData = resultData.slice(0, parseInt(limit));
            }
            if (offset) {
                resultData = resultData.slice(parseInt(offset));
            }

            // aplico la vista personalizada
            if (fields) {
                const selectedFields = fields.split(',');
                resultData = resultData.map(data => {
                    const selectedData = {};
                    selectedFields.forEach(field => {
                        if (data.hasOwnProperty(field)) {
                            selectedData[field] = data[field];
                        }
                    });
                    return selectedData;
                });
            }

            if (resultData.length > 0) {
                const resultsWithoutId = resultData.map(d => {
                    const { _id, ...datWithoutId } = d;
                    return datWithoutId;
                });
                res.status(200).json(resultsWithoutId);
            } else {
                res.status(404).json({ message: '404, Data not found' });
            }
        });
    });

    // RUTA RAIZ
    // POST -- OK
    app.post(API_BASE, (req, res) => {
        // pedimos el contenido (esperado)
        let data = req.body;
        const expectedFields = [
            'country',
            'wri',
            'exposure',
            'vulnerability',
            'susceptibility',
            'lack_of_coping_capability',
            'lack_of_adaptive_capacity',
            'exposure_category',
            'vulnerability_category',
            'susceptibility_category'];
        const receivedFields = Object.keys(data);

        const isValidData = expectedFields.every(field => receivedFields.includes(field));

        // verificamos si los datos son válidos
        if (!isValidData) {
            return res.status(400).send('400, Bad Request');
        } else {

            // verificamos si los datos ya existen (mismo país y año)
            dataset.findOne({ country: data.country, year: data.year }, (err, existingData) => {
                if (err) {
                    return res.status(500).json({ error: '500, Internal Server Error' });
                }
                if (existingData) {
                    return res.status(409).send('409, Conflict');
                }

                // insertamos los nuevos datos
                dataset.insert(data, (err, newData) => {
                    if (err) {
                        return res.status(500).json({ error: '500, Internal Server Error' });
                    }
                    return res.status(201).send('201, Created');
                });
            });
        }
    });

    // RUTA RAIZ
    // PUT -- NOK
    app.put(API_BASE, (req, res) => {
        res.status(405).json({ error: '405, Method not allowed' });
    });

    // RUTA RAIZ
    // DELETE -- OK
    app.delete(API_BASE, (req, res) => {
        dataset.remove({}, { multi: true }, (err, numRemoved) => {
            if (err) {
                res.status(500).json({ error: '500, Internal Server Error' });
                return;
            }
            res.status(200).json({ message: '200, Deleted' });
        });
    });

    //===============================================================================//
    //                 METODOS DE LA RUTA RECURSO BASE + "/country"                  //
    //===============================================================================//

    // RUTA RECURSO BASE
    // GET byId -- OK (con opcion a ?year=XXXX y con opcion a ?from=XXXX&to=YYYY)
    app.get(API_BASE + "/:country", (req, res) => {
        const countryName = req.params.country;
        const { year, from, to } = req.query;

        // verificamos si se proporciona el parámetro year
        if (year) {
            // devolvemos los datos para el país y el año
            dataset.findOne({ country: countryName, year: parseInt(year) }, (err, riskData) => {
                if (err) {
                    return res.status(500).json({ error: '500, Internal Server Error' });
                }
                if (riskData) {
                    delete riskData._id;
                    res.status(200).json(riskData);
                } else {
                    res.status(404).json({ message: '404, Data not found for the specified country and year' });
                }
            });
        } else {
            // verificamos si se proporciona el rango (from y to)
            if (from && to) {
                // devolvemos los datos para el país dentro del rango
                dataset.find({ country: countryName, year: { $gte: parseInt(from), $lte: parseInt(to) } }, (err, riskData) => {
                    if (err) {
                        return res.status(500).json({ error: '500, Internal Server Error' });
                    }
                    if (riskData.length > 0) {
                        const datosSinId = riskData.map(d => {
                            delete d._id;
                            return d;
                        });
                        res.status(200).json(datosSinId);
                    } else {
                        res.status(404).json({ message: '404, Data not found for the specified country and year range' });
                    }
                });
            } else {
                // devolvemos todos los datos para el país si no se proporciona el año ni el rango
                dataset.find({ country: countryName }, (err, riskData) => {
                    if (err) {
                        return res.status(500).json({ error: '500, Internal Server Error' });
                    }
                    if (riskData.length > 0) {
                        let resultData = riskData;
                        const datosSinId = resultData.map(d => {
                            delete d._id;
                            return d;
                        });
                        res.status(200).json(datosSinId);
                    } else {
                        res.status(404).json({ message: '404, Country not found' });
                    }
                });
            }
        }
    });

    // RUTA RECURSO BASE Y AÑO
    // GET byId/byYear -- OK
    app.get(API_BASE + "/:country/:year", (req, res) => {
        const countryName = req.params.country;
        const year = parseInt(req.params.year);

        // buscamos el dato específico para el país y el año
        dataset.findOne({ country: countryName, year }, (err, riskData) => {
            if (err) {
                return res.status(500).json({ error: '500, Internal Server Error' });
            }
            if (riskData) {
                delete riskData._id;
                res.status(200).json(riskData);
            } else {
                res.status(404).json({ message: '404, Data not found for the specified country and year' });
            }
        });
    });

    // RUTA RECURSO BASE
    // POST byId -- NOK
    app.post(API_BASE + "/:country", (req, res) => {
        res.status(405).json({ error: '405, Method not allowed' });
    });

    // RUTA RECURSO BASE
    // PUT byId -- OK
    app.put(API_BASE + "/:country", (req, res) => {
        const countryName = req.params.country;
        const newData = req.body;

        // verificamos que el ID en el cuerpo coincide con el ID de la URL
        if (newData.country && newData.country !== countryName) {
            res.status(400).json({ error: '400, Bad Request' });
            return;
        }

        dataset.update({ country: countryName }, { $set: newData }, { multi: true }, (err, numUpdated) => {
            if (err) {
                res.status(500).json({ error: '500, Internal Server Error' });
                return;
            }
            if (numUpdated > 0) {
                res.status(200).json({ message: '200, OK' });
            } else {
                res.status(404).json({ message: '404, Country not found' });
            }
        });
    });

    // RUTA RECURSO BASE/YEAR
    // PUT byId/byYear -- OK
    app.put(API_BASE + "/:country/:year", (req, res) => {
        const countryName = req.params.country;
        const yearParam = parseInt(req.params.year);
        const newData = req.body;

        // verificamos que el país y el año coincidan con la URL y el cuerpo del PUT
        if (newData.country && newData.country !== countryName) {
            return res.status(400).json({ error: '400, Bad Request: Country mismatch' });
        }
        if (newData.year && newData.year !== yearParam) {
            return res.status(400).json({ error: '400, Bad Request: Year mismatch' });
        }

        // verificamos que todos los campos necesarios estan y son correctos
        const expectedFields = [
            'country',
            'wri',
            'exposure',
            'vulnerability',
            'susceptibility',
            'lack_of_coping_capability',
            'lack_of_adaptive_capacity',
            'year',
            'exposure_category',
            'wri_category',
            'vulnerability_category',
            'susceptibility_category'
        ];
        const receivedFields = Object.keys(newData);
        const isValidData = expectedFields.every(field => receivedFields.includes(field));

        if (!isValidData) {
            return res.status(400).json({ error: '400, Bad Request: Missing or incorrect fields' });
        }

        // actualizamos los datos en la base de datos
        dataset.update({ country: countryName, year: yearParam }, { $set: newData }, { multi: false }, (err, numUpdated) => {
            if (err) {
                return res.status(500).json({ error: '500, Internal Server Error' });
            }
            if (numUpdated > 0) {
                return res.status(200).json({ message: '200, OK' });
            } else {
                return res.status(404).json({ message: '404, Data not found for the specified country and year' });
            }
        });
    });

    // RUTA RECURSO BASE
    // DELETE byId -- OK
    app.delete(API_BASE + "/:country", (req, res) => {
        const countryName = req.params.country;
        dataset.remove({ country: countryName }, { multi: true }, (err, numRemoved) => {
            if (err) {
                res.status(500).json({ error: '500, Internal Server Error' });
                return;
            }
            if (numRemoved > 0) {
                res.status(200).json({ message: '200, Deleted' });
            } else {
                res.status(404).json({ message: '404, Country not found' });
            }
        });
    });

    // RUTA RECURSO BASE
    // DELETE byId/byYear -- OK
    app.delete(API_BASE + "/:country/:year", (req, res) => {
        const countryName = req.params.country;
        const yearParam = parseInt(req.params.year);

        dataset.remove({ country: countryName, year: yearParam }, (err, numRemoved) => {
            if (err) {
                res.status(500).json({ error: '500, Internal Server Error' });
                return;
            }
            if (numRemoved > 0) {
                res.status(200).json({ message: '200, Deleted' });
            } else {
                res.status(404).json({ message: '404, No data for that country on that year' });
            }
        });
    });
};

export { loadWRIApi };