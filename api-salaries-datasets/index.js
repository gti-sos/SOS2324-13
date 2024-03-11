const API_BASE = '/api/v1/salaries-datasets';

module.exports = (app, salarieDB) => {

       // PAGINA "/DOCS"
    // GET -- OK
    app.get(API_BASE + '/docs', (req, res) => {
        res.redirect('');
    });


    //POST PARA PAIS CONCRETO
app.post(API_BASE + "/:country", (req, res) => {
    res.status(405).json({ error: 'Method not allowed,405' });
})


// PUT GENERAL - Método no permitido
app.put(API_BASE + "/", (req, res) => {
    res.status(405).json({ error: 'Method not allowed,405' });
})


// Función para validar datos
function isValidData(data) {
    const expectedFields = ['year', 'timestamp', 'salary', 'country', 'primary_database', 'time_with_this_database', 'employment_state', 'job_title', 'manage_staff', 'time_in_current_job', 'other_people_on_your_team', 'magnitude_of_company', 'sector'];

    const keys = Object.keys(data);
    for (const key of keys) {
        if (!expectedFields.includes(key)) {
            return false;
        }
    }

    return true;
}

// Ruta para buscar por todos los campos con paginación
app.get(API_BASE + '/search', (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const searchTerm = req.query.q; // Obtener el término de búsqueda de la consulta

    if (!searchTerm) {
        return res.status(400).json({ error: 'Bad Request - Missing search term' });
    }

    // Construir una consulta que busca en todos los campos
    const query = {
        $or: [
            { year: searchTerm },
            { timestamp: { $regex: new RegExp(searchTerm, 'i') } },
            { salary: searchTerm },
            { country: { $regex: new RegExp(searchTerm, 'i') } },
            // Agregar más campos según sea necesario
        ]
    };

    salarieDB.find(query)
        .limit(limit)
        .skip(offset)
        .exec((err, data) => {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (data.length > 0) {
                const datosSinId = data.map(doc => {
                    delete doc._id;
                    return doc;
                });
                return res.status(200).json(datosSinId);
            } else {
                return res.status(404).json({ message: 'No data found for the specified search term' });
            }
        });
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

    // PUT por ID
    app.put(API_BASE + '/:id', (req, res) => {
        const id = req.params.id;
        const updatedData = req.body;

        // Validar que el ID en el cuerpo sea el mismo que el ID en la URL
        if (updatedData._id && updatedData._id !== id) {
            return res.status(400).json({ error: 'ID in the body does not match the ID in the URL' });
        }

        salarieDB.update({ _id: id }, { $set: updatedData }, {}, (err, numReplaced) => {
            if (err) {
                return res.status(500).json({ error: '500, Internal Server Error' });
            }

            if (numReplaced > 0) {
                return res.status(200).json({ message: 'Resource updated successfully' });
            } else {
                return res.status(404).json({ error: 'Resource not found' });
            }
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

    // DELETE para borrar todos los datos
    app.delete(API_BASE, (req, res) => {
        salarieDB.remove({}, { multi: true }, (err, numRemoved) => {
            if (err) {
                return res.status(500).json({ error: '500, Internal Server Error' });
            }

            return res.status(200).json({ message: 'All resources deleted successfully' });
        });
    });

    // POST para insertar un solo dato sin repetir
    app.post(API_BASE, (req, res) => {
        const newData = req.body;

        if (!newData || !isValidData(newData)) {
            return res.status(400).json({ error: 'Bad Request - Invalid data provided' });
        }

        // Verificar duplicados por timestamp
        salarieDB.findOne({ timestamp: newData.timestamp }, (err, existingData) => {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (existingData) {
                return res.status(409).json({ error: 'Conflict - Data already exists' });
            } else {
                salarieDB.insert(newData, (err, newDoc) => {
                    if (err) {
                        return res.status(500).json({ error: 'Internal Server Error' });
                    }
                    res.status(201).json({ message: 'Created new data', data: newDoc });
                });
            }
        });
    });

    // POST para insertar un solo dato (sin la verificación de duplicados)
    app.post(API_BASE, (req, res) => {
        const newData = req.body;

        if (!newData || !isValidData(newData)) {
            return res.status(400).json({ error: 'Bad Request - Invalid data provided' });
        }

        salarieDB.insert(newData, (err, newDocs) => {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            res.status(201).json({ message: 'Created new data', data: newDocs });
        });
    });

    // GET para obtener datos por año y país con paginación
    app.get(API_BASE + '/year/:year/country/:country', (req, res) => {
        const year = parseInt(req.params.year);
        const country = req.params.country;
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        salarieDB.find({ year: year, country: country })
            .limit(limit)
            .skip(offset)
            .exec((err, data) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                if (data.length > 0) {
                    const datosSinId = data.map(doc => {
                        delete doc._id;
                        return doc;
                    });
                    return res.status(200).json(datosSinId);
                } else {
                    return res.status(404).json({ message: 'No data found for the specified year and country' });
                }
            });
    });

  

const fields = ['year', 'timestamp', 'salary', 'country', 'primary_database', 'time_with_this_database', 'employment_state', 'job_title', 'manage_staff', 'time_in_current_job', 'other_people_on_your_team', 'magnitude_of_company', 'sector'];

fields.forEach(field => {
    app.get(API_BASE + `/${field}`, (req, res) => {
        const limit = parseInt(req.query.limit) || 10;
        const offset = parseInt(req.query.offset) || 0;

        const query = {};
        query[field] = { $exists: true };

        salarieDB.find(query)
            .limit(limit)
            .skip(offset)
            .exec((err, data) => {
                if (err) {
                    return res.status(500).json({ error: 'Internal Server Error' });
                }

                if (data.length > 0) {
                    const datosSinId = data.map(doc => {
                        delete doc._id;
                        return doc;
                    });
                    return res.status(200).json(datosSinId);
                } else {
                    return res.status(404).json({ message: `No data found for field: ${field}` });
                }
            });
    });
});
};