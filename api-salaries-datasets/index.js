const API_BASE = '/api/v1/salaries-datasets';

module.exports = (app, salarieDB) => {

    // PAGINA "/DOCS"
    // GET -- OK
    app.get(API_BASE + '/docs', (req, res) => {
        res.redirect('https://documenter.getpostman.com/view/32946791/2sA2xiVrAy');
    });

    // POST PARA PAIS CONCRETO
    app.post(API_BASE + "/:country", (req, res) => {
        res.status(405).json({ error: 'Method not allowed, 405' });
    });

    // PUT GENERAL - Método no permitido
    app.put(API_BASE + "/", (req, res) => {
        res.status(405).json({ error: 'Method not allowed, 405' });
    });

    // Función para validar datos
    function isValidData(data) {
        const expectedFields = ['year', 'timestamp', 'salary', 'country', 'primary_database', 'time_with_this_database', 'employment_state', 'job_title', 'manage_staff', 'time_in_current_job', 'other_people_on_your_team', 'magnitude_of_company', 'sector'];

        return expectedFields.every(field => {
            if (field === 'year') {
                return !isNaN(parseInt(data[field]));
            } else {
                return Object.keys(data).includes(field);
            }
        });
    }

    // Ruta para búsqueda por campos con paginación
    app.get(API_BASE + "/", (req, res) => {
        const queryParameters = req.query;
        const limit = parseInt(queryParameters.limit) || 10;
        const offset = parseInt(queryParameters.offset) || 0;
        let from = req.query.from;
        let to = req.query.to;

        // Verifica si hay parámetros 'from' y 'to'
        if (from !== undefined && to !== undefined) {
            const fromYear = parseInt(from);
            const toYear = parseInt(to);
            if (isNaN(fromYear) || isNaN(toYear)) {
                return res.status(400).json({ error: 'Invalid year format. Please provide valid year values.' });
            }
            // Si los años son válidos, construye la consulta para filtrar por el rango de años
            queryParameters.year = { $gte: fromYear, $lte: toYear };
        }

        let query = {};
        // Construir la consulta basada en los parámetros proporcionados
        Object.keys(queryParameters).forEach(key => {
            if (key !== 'limit' && key !== 'offset' && key !== 'from' && key !== 'to') {
                const value = !isNaN(queryParameters[key]) ? parseFloat(queryParameters[key]) : queryParameters[key];
                if (typeof value === 'string') {
                    query[key] = { $regex: new RegExp(value, 'i') };
                } else {
                    query[key] = value;
                }
            }
        });

        // Verificar si se proporcionaron parámetros de búsqueda
        const hasSearchParameters = Object.keys(queryParameters).some(key => key !== 'limit' && key !== 'offset' && key !== 'from' && key !== 'to');

        if (!hasSearchParameters) {
            salarieDB.count({}, (err, count) => {
                if (err) {
                    return res.sendStatus(500);
                } else {
                    if (count === 0) {
                        return res.status(200).json([]);
                    } else {
                        salarieDB.find({}).skip(offset).limit(limit).exec((err, data) => {
                            if (err) {
                                return res.sendStatus(500);
                            } else {
                                const resultsWithoutId = data.map(d => {
                                    const { _id, ...datWithoutId } = d;
                                    return datWithoutId;
                                });
                                return res.status(200).json(resultsWithoutId);
                            }
                        });
                    }
                }
            });
        } else {
            salarieDB.find(query).skip(offset).limit(limit).exec((err, data) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal Server Error' });
                }
                if (data.length > 0) {
                    const formattedData = data.map((d) => {
                        const { _id, ...formatted } = d;
                        return formatted;
                    });
                    return res.status(200).json(formattedData);
                } else {
                    return res.status(404).json({ error: 'Not Found' });
                }
            });
        }
    });

    // RUTA "/loadInitialData"
    // GET -- OK
    app.get(API_BASE + "/loadInitialData", (req, res) => {
        salarieDB.find({}, (err, salariesData) => {
            if (err) {
                res.status(500).json({ error: '500, Internal Server Error' });
                return;
            }
            if (salariesData.length === 0) {
                let initialData = [
                    { year: 2021, timestamp: '12/10/2020 8:22:42', salary: 65000, country: 'Sweden', primary_database: 'Microsoft SQL Server', time_with_this_database: 4, employment_state: 'Full time employee', job_title: 'Developer: Business Intelligence (SSRS, PowerBI, etc)', manage_staff: 'Yes', time_in_current_job: 4, other_people_on_your_team: 'None', magnitude_of_company: 2, sector: 'Private business' },
                    { year: 2021, timestamp: '12/10/2020 8:23:22', salary: 145000, country: 'United States', primary_database: 'Microsoft SQL Server', time_with_this_database: 15, employment_state: 'Full time employee', job_title: 'DBA (Production Focus - build & troubleshoot servers, HA/DR)', manage_staff: 'No', time_in_current_job: 25, other_people_on_your_team: 'None', magnitude_of_company: 74, sector: 'Private business' },
                    { year: 2021, timestamp: '12/10/2020 8:23:37', salary: 105000, country: 'United States', primary_database: 'Microsoft SQL Server', time_with_this_database: 12, employment_state: 'Full time employee', job_title: 'DBA (General - splits time evenly between writing & tuning queries AND building & troubleshooting servers)', manage_staff: 'Yes', time_in_current_job: 6, other_people_on_your_team: '1', magnitude_of_company: 500, sector: 'Private business' },
                    { year: 2021, timestamp: '12/10/2020 8:23:48', salary: 46482, country: 'United Kingdom', primary_database: 'Microsoft SQL Server', time_with_this_database: 10, employment_state: 'Full time employee', job_title: 'DBA (Production Focus - build & troubleshoot servers, HA/DR)', manage_staff: 'No', time_in_current_job: 5, other_people_on_your_team: 'None', magnitude_of_company: 35, sector: 'Education (K-12, college, university)' },
                    { year: 2021, timestamp: '12/10/2020 8:24:03', salary: 98800, country: 'United States', primary_database: 'Microsoft SQL Server', time_with_this_database: 5, employment_state: 'Full time employee', job_title: 'Developer: Business Intelligence (SSRS, PowerBI, etc)', manage_staff: 'No', time_in_current_job: 5, other_people_on_your_team: 'None', magnitude_of_company: 50, sector: 'Private business' },
                    { year: 2021, timestamp: '12/10/2020 8:24:39', salary: 2500, country: 'Pakistan', primary_database: 'Microsoft SQL Server', time_with_this_database: 14, employment_state: 'Full time employee', job_title: 'Manager', manage_staff: 'Yes', time_in_current_job: 14, other_people_on_your_team: '1', magnitude_of_company: 20, sector: 'Private business' },
                    { year: 2021, timestamp: '12/10/2020 8:24:45', salary: 100800, country: 'United States', primary_database: 'Microsoft SQL Server', time_with_this_database: 14, employment_state: 'Full time employee', job_title: 'Developer: App code (C#, JS, etc)', manage_staff: 'No', time_in_current_job: 14, other_people_on_your_team: 'More than 5', magnitude_of_company: 5, sector: 'Private business' },
                    { year: 2021, timestamp: '12/10/2020 8:24:46', salary: 160000, country: 'United States', primary_database: 'PostgreSQL', time_with_this_database: 2, employment_state: 'Full time employee of a consulting/contracting company', job_title: 'Manager', manage_staff: 'Yes', time_in_current_job: 9, other_people_on_your_team: '1', magnitude_of_company: 1000, sector: 'Private business' },
                    { year: 2021, timestamp: '12/10/2020 8:25:12', salary: 105000, country: 'United States', primary_database: 'Microsoft SQL Server', time_with_this_database: 10, employment_state: 'Full time employee', job_title: 'DBA (General - splits time evenly between writing & tuning queries AND building & troubleshooting servers)', manage_staff: 'No', time_in_current_job: 2, other_people_on_your_team: '4', magnitude_of_company: 50, sector: 'Private business' },
                    { year: 2021, timestamp: '12/10/2020 8:25:36', salary: 61100, country: 'United Kingdom', primary_database: 'Microsoft SQL Server', time_with_this_database: 10, employment_state: 'Full time employee', job_title: 'Developer: T-SQL', manage_staff: 'Yes', time_in_current_job: 10, other_people_on_your_team: 'None', magnitude_of_company: 7, sector: 'Private business' },
                    { year: 2021, timestamp: '12/10/2020 8:25:51', salary: 18000, country: 'Paraguay', primary_database: 'Microsoft SQL Server', time_with_this_database: 5, employment_state: 'Full time employee', job_title: 'DBA (General - splits time evenly between writing & tuning queries AND building & troubleshooting servers)', manage_staff: 'No', time_in_current_job: 5, other_people_on_your_team: 'None', magnitude_of_company: 20, sector: 'Private business' },
                ];

                salarieDB.insert(initialData, (err, newDocs) => {
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

    // GET para obtener todos los datos con paginación
    app.get(API_BASE, (req, res) => {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        salarieDB.find({})
            .limit(limit)
            .skip(offset)
            .exec((err, salariesData) => {
                if (err) {
                    return res.status(500).json({ error: '500, Internal Server Error' });
                }

                if (salariesData.length > 0) {
                    return res.status(200).json(salariesData);
                } else {
                    return res.status(404).json({ message: '404, No data found' });
                }
            });
    });

    // GET AÑO CONCRETO con paginación
    app.get(API_BASE + "/year/:year", (req, res) => {
        const year = parseInt(req.params.year);
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        salarieDB.find({ year: year })
            .limit(limit)
            .skip(offset)
            .exec((err, data) => {
                if (err) {
                    res.status(500).json({ error: 'Error interno del servidor' });
                    return;
                }
                if (data.length > 0) {
                    const datosSinId = data.map(doc => {
                        delete doc._id;
                        return doc;
                    });
                    res.status(200).json(datosSinId);
                } else {
                    res.status(404).json({ message: 'No se encontraron datos para el año especificado' });
                }
            });
    });

    // GET por ID
    app.get(API_BASE + '/:id', (req, res) => {
        const id = req.params.id;

        salarieDB.findOne({ _id: id }, (err, salary) => {
            if (err) {
                return res.status(500).json({ error: '500, Internal Server Error' });
            }

            if (salary) {
                return res.status(200).json(salary);
            } else {
                return res.status(404).json({ error: 'Resource not found' });
            }
        });
    });


// GET por Country
app.get(API_BASE + '/country/:country', (req, res) => {
    const country = req.params.country;

    salarieDB.findOne({ country: country }, (err, salary) => {
        if (err) {
            return res.status(500).json({ error: '500, Internal Server Error' });
        }

        if (salary) {
            return res.status(200).json(salary);
        } else {
            return res.status(404).json({ error: 'Resource not found for the specified country' });
        }
    });
});


    // PUT por ID
    app.put(API_BASE + '/:id', (req, res) => {
        const id = req.params.id;
        const updatedData = req.body;

        // Validar que el ID en el cuerpo sea el mismo que el ID en la URL
        if (updatedData._id && updatedData._id !== id) {
            return res.status(400).json({ error: 'ID in the body does not match the ID in the URL' });
        }

        // Verificar si la ID existe
        salarieDB.findOne({ _id: id }, (err, existingData) => {
            if (err) {
                return res.status(500).json({ error: '500, Internal Server Error' });
            }

            if (!existingData) {
                return res.status(400).json({ error: '400, Bad Request - Resource not found' });
            }

            // Actualizar el recurso
            salarieDB.update({ _id: id }, { $set: updatedData }, {}, (err, numReplaced) => {
                if (err) {
                    return res.status(500).json({ error: '500, Internal Server Error' });
                }

                if (numReplaced > 0) {
                    return res.status(200).json({ message: 'Resource updated successfully' });
                } else {
                    return res.status(500).json({ error: '500, Internal Server Error - Resource not updated' });
                }
            });
        });
    });

    // PUT por Country
app.put(API_BASE + '/country/:country', (req, res) => {
    const country = req.params.country;
    const updatedData = req.body;

    // Validar que los datos sean válidos
    if (!isValidData(updatedData)) {
        return res.status(400).json({ error: '400, Bad Request - Invalid data format' });
    }

    // Verificar si el país existe
    salarieDB.findOne({ country: country }, (err, existingData) => {
        if (err) {
            return res.status(500).json({ error: '500, Internal Server Error' });
        }

        if (!existingData) {
            return res.status(404).json({ error: '404, Resource not found for the specified country' });
        }

        // Actualizar el recurso por el país
        salarieDB.update({ country: country }, { $set: updatedData }, { multi: true }, (err, numReplaced) => {
            if (err) {
                return res.status(500).json({ error: '500, Internal Server Error' });
            }

            if (numReplaced > 0) {
                return res.status(200).json({ message: 'Resources updated successfully' });
            } else {
                return res.status(500).json({ error: '500, Internal Server Error - Resources not updated' });
            }
        });
    });
});


    // DELETE por ID
    app.delete(API_BASE + '/:id', (req, res) => {
        const id = req.params.id;

        salarieDB.remove({ _id: id }, {}, (err, numRemoved) => {
            if (err) {
                return res.status(500).json({ error: '500, Internal Server Error' });
            }

            if (numRemoved > 0) {
                return res.status(200).json({ message: 'Resource deleted successfully' });
            } else {
                return res.status(404).json({ error: 'Resource not found' });
            }
        });
    });

    // POST para añadir nuevo salario
    app.post(API_BASE, (req, res) => {
        const newData = req.body;

        if (!isValidData(newData)) {
            return res.status(400).json({ error: '400, Bad Request - Invalid data format' });
        }

        // Añadir nuevo salario
        salarieDB.insert(newData, (err, newDoc) => {
            if (err) {
                return res.status(500).json({ error: '500, Internal Server Error' });
            }

            if (newDoc) {
                const { _id, ...responseData } = newDoc;
                return res.status(201).json({ id: _id, ...responseData });
            } else {
                return res.status(500).json({ error: '500, Internal Server Error - Resource not created' });
            }
        });
    });


    app.delete(API_BASE, (req, res) => {
        // Lógica para eliminar todos los recursos
        salarieDB.remove({}, { multi: true }, (err, numRemoved) => {
            if (err) {
                return res.status(500).json({ error: '500, Internal Server Error' });
            }
    
            if (numRemoved > 0) {
                return res.status(200).json({ message: 'All resources deleted successfully' });
            } else {
                return res.status(404).json({ error: '404, No resources found to delete' });
            }
        });
    });


    // POST -- OK
app.post(API_BASE, (req, res) => {
    // Pedimos el contenido (esperado)
    const data = req.body;
    const expectedFields = [
        'year',
        'timestamp',
        'salary',
        'country',
        'primary_database',
        'time_with_this_database',
        'employment_state',
        'job_title',
        'manage_staff',
        'time_in_current_job',
        'other_people_on_your_team',
        'magnitude_of_company',
        'sector'
    ];
    const receivedFields = Object.keys(data);

    const isValidData = expectedFields.every(field => receivedFields.includes(field));

    // Verificamos si los datos son válidos
    if (!isValidData) {
        return res.status(400).json({ error: '400, Bad Request' });
    } else {
        // Verificamos si los datos ya existen (mismo trabajo y año)
        salarieDB.findOne({ job_title: data.job_title, year: data.year }, (err, existingData) => {
            if (err) {
                console.error('Error al buscar datos existentes:', err);
                return res.status(500).json({ error: '500, Internal Server Error' });
            }

            console.log('Datos existentes:', existingData);

            if (existingData) {
                console.log('Datos duplicados encontrados. Conflicto.');
                return res.status(409).json({ error: '409, Conflict' });
            }

            // Insertamos los nuevos datos
            salarieDB.insert(data, (err, newData) => {
                if (err) {
                    console.error('Error al insertar nuevos datos:', err);
                    return res.status(500).json({ error: '500, Internal Server Error' });
                }
                return res.status(201).json({ message: '201, Created' });
            });
        });
    }
});


};
