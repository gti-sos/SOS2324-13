const API_BASE = '/api/v2/salaries-datasets';

function loadSalarieApi2(app, dbSalaries) {

    app.get(`${API_BASE}/docs`, (req, res) => {
        res.redirect('https://documenter.getpostman.com/view/32946791/2sA35MxyEF');
    });

    app.get(API_BASE + "/", (req, res) => {
        const queryParameters = req.query;
        const limit = parseInt(queryParameters.limit) || 10;
        const offset = parseInt(queryParameters.offset) || 0;
        let from = req.query.from;
        let to = req.query.to;

        if (from !== undefined && to !== undefined) {
            const fromYear = parseInt(from);
            const toYear = parseInt(to);
            if (isNaN(fromYear) || isNaN(toYear)) {
                return res.status(400).json({ error: "Invalid year format. Please provide valid year values." });
            }
            queryParameters.year = { $gte: fromYear, $lte: toYear };
        }

        let query = {};
        Object.keys(queryParameters).forEach(key => {
            if (key !== 'limit' && key !== 'offset' && key !== 'from' && key !== 'to') {
                const value = !isNaN(queryParameters[key]) ? parseFloat(queryParameters[key]) : queryParameters[key];
                if (typeof value === 'string') {
                    query[key] = new RegExp(value, 'i');
                } else {
                    query[key] = value;
                }
            }
        });

        const hasSearchParameters = Object.keys(queryParameters).some(key => key !== 'limit' && key !== 'offset' && key !== 'from' && key !== 'to');

        if (!hasSearchParameters) {
            dbSalaries.count({}, (err, count) => {
                if (err) {
                    return res.status(500).json({ error: "Internal Server Error" });
                } else {
                    if (count === 0) {
                        res.status(200).json([]);
                    } else {
                        dbSalaries.find({}).skip(offset).limit(limit).exec((err, data) => {
                            if (err) {
                                return res.status(500).json({ error: "Internal Server Error" });
                            } else {
                                const resultsWithoutId = data.map(d => {
                                    const { _id, ...datWithoutId } = d;
                                    return datWithoutId;
                                });

                                res.status(200).json(resultsWithoutId);
                            }
                        });
                    }
                }
            });
        } else {
            dbSalaries.find(query).skip(offset).limit(limit).exec((err, data) => {
                if (err) {
                    return res.status(500).json({ error: "Internal Server Error" });
                }
                if (data.length > 0) {
                    const formattedData = data.map((d) => {
                        const { _id, ...formatted } = d;
                        return formatted;
                    });
                    res.status(200).json(formattedData)
                } else {
                    return res.status(404).json({ error: "Not found" });
                }
            });
        }
    });

    app.get(API_BASE + "/loadInitialData", (req, res) => {
            dbSalaries.find({}, (err, salariesData) => {
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
    
                    dbSalaries.insert(initialData, (err, newDocs) => {
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

    app.get(API_BASE + "/:country", (req, res) => {
        const countryName = req.params.country;
        dbSalaries.find({ country: countryName }, (err, datosSalaries) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            if (datosSalaries.length > 0) {
                const datosSinId = datosSalaries.map(doc => {
                    delete doc._id;
                    return doc;
                });
                res.status(200).json(datosSinId);
            } else {
                res.status(404).json({ message: 'Country not found, 404' });
            }
        });
    });

    app.get(`${API_BASE}/:country/:year`, (req, res) => {
        const countryName = req.params.country;
        const year = parseInt(req.params.year);
        if (isNaN(year)) {
            res.status(400).json({ error: 'Invalid year' });
            return;
        }
        dbSalaries.findOne({ country: countryName, year: year }, (err, datosSalaries) => {
            if (err) {
                res.status(500).json({ error: 'Internal Server Error' });
                return;
            }
            if (datosSalaries) {
                delete datosSalaries._id;
                res.status(200).json(datosSalaries);
            } else {
                res.status(404).json({ message: 'Data not found for the specified country and year,404' });
            }
        });
    });
    
// POST para añadir nuevo salario
app.post(API_BASE, (req, res) => {
    const newData = req.body;

    // Verificar si los datos cumplen con todos los campos del CSV
    if (!isValidData(newData)) {
        return res.status(400).json({ error: 'Bad Request - Invalid data format' });
    }

    // Comprobar si los datos ya existen
    dbSalaries.findOne(newData, (err, existingData) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (existingData) {
            return res.status(409).json({ error: 'Conflict - Data already exists' });
        }

        // Si los datos no existen, añadir nuevo salario
        dbSalaries.insert(newData, (err, newDoc) => {
            if (err) {
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            if (newDoc) {
                const { _id, ...responseData } = newDoc;
                return res.status(201).json({ id: _id, ...responseData });
            } else {
                return res.status(500).json({ error: 'Internal Server Error - Resource not created' });
            }
        });
    });
});

app.post(API_BASE + "/:country", (req, res) => {
    res.status(405).json({ error: 'Method Not Allowed' });
});


app.put(API_BASE + "/:country", (req, res) => {
    const newData = req.body;
    const countryName = req.params.country;

    // Verificar si newData contiene todos los campos necesarios
    const requiredFields = ['year', 'timestamp', 'salary', 'primary_database', 'time_with_this_database', 'employment_state', 'job_title', 'manage_staff', 'time_in_current_job', 'other_people_on_your_team', 'magnitude_of_company', 'sector'];
    const missingFields = requiredFields.filter(field => !(field in newData));

    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Missing fields: ${missingFields.join(', ')}` });
    }

    dbSalaries.update({ country: countryName }, { $set: newData }, { multi: true }, (err, numUpdated) => {
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

// PUT por país y año
app.put(API_BASE + '/:country/:year', (req, res) => {
    const country = req.params.country;
    const year = parseInt(req.params.year);
    const newData = req.body;

    // Verificar si los datos son válidos
    if (!isValidData(newData)) {
        return res.status(400).json({ error: 'Bad Request - Invalid data format' });
    }

    // Actualizar datos en la base de datos
    dbSalaries.update({ country: country, year: year }, { $set: newData }, { multi: true }, (err, numUpdated) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        // Verificar si se actualizó algún documento
        if (numUpdated > 0) {
            return res.status(200).json({ message: 'Data updated successfully' });
        } else {
            return res.status(404).json({ error: 'Data not found for the specified country and year' });
        }
    });
});



app.delete(API_BASE, (req, res) => {
    dbSalaries.remove({}, { multi: true }, (err, numRemoved) => {
        if (err) {
            res.status(500).json({ error: 'Internal Server Error' });
            return;
        }
        res.status(200).json({ message: 'Deleted' });
    });
});

app.delete(API_BASE + "/:country", (req, res) => {
    const countryName = req.params.country;
    dbSalaries.remove({ country: countryName }, { multi: true }, (err, numRemoved) => {
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

//DELETE por país y año
app.delete(API_BASE + '/:country/:year', (req, res) => {
    const country = req.params.country;
    const year = parseInt(req.params.year);

    // Eliminar datos por país y año en la base de datos
    dbSalaries.remove({ country: country, year: year }, { multi: true }, (err, numRemoved) => {
        if (err) {
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (numRemoved > 0) {
            return res.status(200).json({ message: 'Data for ' + country + ' in year ' + year + ' deleted successfully' });
        } else {
            return res.status(404).json({ error: 'Data not found for the specified country and year' });
        }
    });
});
};

export { loadSalarieApi2 }