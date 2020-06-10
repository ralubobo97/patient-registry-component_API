const moment = require('moment');
const formatDate = require('./utils').formatDate;

function checkCNP(searchText) {
    return searchText.length === 13 && searchText.substr(0, 1) !== '0' && Number(searchText);
  }

function checkPhone(searchText) {
return (searchText.substr(0, 1) === '0' || searchText.substr(0, 1) === '+');
}

function mapName(searchText) {
    if (!searchText) {
      return;
    }
    return searchText.split(' ').filter(s => s);
}



module.exports = {
    getDepartments: (req, res, next) => {
        let query = `SELECT id, name FROM departments;`;
        db.query(query, (error, response) => {
            if(error){
                res.status(500).send();
                throw error;
            }
            let departments = [];
            response.forEach(dept => {
                departments.push({
                    id: dept.id,
                    department: dept.name
                });
            })
            res.status(200).send(departments);
            next();
        });
    },

    getLatestEpisodeOfCare: (req, res, next) => {
        if(req.query.searchQuery != ''){
            if(checkCNP(req.query.searchQuery)){
                let query = `SELECT CONCAT(p.firstname, ' ', p.lastname) as patientName, p.cnp, p.birthdate + INTERVAL 1 DAY as birthdate, MAX(e.date) + INTERVAL 1 DAY as eocDate, d.name as department FROM 
                            patients p JOIN episode_of_care e ON p.id = e.patient_id JOIN departments d ON e.department_id = d.id WHERE 
                            p.cnp = '${req.query.searchQuery}'`;
                
                if(req.query.departmentID != ''){
                    query += ` AND d.id = '${req.query.departmentID}' GROUP BY e.patient_id, d.id;`;
                } else {
                    query += ` GROUP BY e.patient_id, d.id;`;
                }

                db.query(query, (error, response) => {
                    if(error){
                        res.status(500).send();
                        throw error;
                    }
                    let searchResults = [];
                    response.forEach(search => {
                        searchResults.push({
                            patientName: search.patientName,
                            cnp: search.cnp,
                            birthdate: formatDate(search.birthdate),
                            eocDate: formatDate(search.eocDate),
                            department: search.department
                        });
                    })
                    res.status(200).send(searchResults);
                    next();
                });
            } else if(moment(moment(req.query.searchQuery, 'DD.MM.YYYY', true).toDate()).isValid()){
                let exactBirthdate = moment(req.query.searchQuery, 'DD.MM.YYYY', true).toDate().toString();
                let query = `SELECT CONCAT(p.firstname, ' ', p.lastname) as patientName, p.cnp, p.birthdate + INTERVAL 1 DAY as birthdate, MAX(e.date) + INTERVAL 1 DAY as eocDate, d.name as department FROM 
                            patients p JOIN episode_of_care e ON p.id = e.patient_id JOIN departments d ON e.department_id = d.id WHERE 
                            p.birthdate = '${exactBirthdate}'`;
                
                if(req.query.departmentID != ''){
                    query += ` AND d.id = '${req.query.departmentID}' GROUP BY e.patient_id, d.id;`;
                } else {
                    query += ` GROUP BY e.patient_id, d.id;`;
                }

                db.query(query, (error, response) => {
                    if(error){
                        res.status(500).send();
                        throw error;
                    }
                    let searchResults = [];
                    response.forEach(search => {
                        searchResults.push({
                            patientName: search.patientName,
                            cnp: search.cnp,
                            birthdate: search.birthdate,
                            eocDate: search.eocDate,
                            department: search.department
                        });
                    })
                    res.status(200).send(searchResults);
                    next();
                });
            } else if(checkPhone(req.query.searchQuery)){
                let query = `SELECT CONCAT(p.firstname, ' ', p.lastname) as patientName, p.cnp, p.birthdate + INTERVAL 1 DAY as birthdate, MAX(e.date) + INTERVAL 1 DAY as eocDate, d.name as department FROM 
                            patients p JOIN episode_of_care e ON p.id = e.patient_id JOIN departments d ON e.department_id = d.id WHERE 
                            p.phone = '${req.query.searchQuery}'`;

                if(req.query.departmentID != ''){
                    query += ` AND d.id = '${req.query.departmentID}' GROUP BY e.patient_id, d.id;`;
                } else {
                    query += ` GROUP BY e.patient_id, d.id;`;
                }

                db.query(query, (error, response) => {
                    if(error){
                        res.status(500).send();
                        throw error;
                    }
                    let searchResults = [];
                    response.forEach(search => {
                        searchResults.push({
                            patientName: search.patientName,
                            cnp: search.cnp,
                            birthdate: search.birthdate,
                            eocDate: search.eocDate,
                            department: search.department
                        });
                    })
                    res.status(200).send(searchResults);
                    next();
                });
            } else if(Number(req.query.searchQuery)){
                let query = `SELECT CONCAT(p.firstname, ' ', p.lastname) as patientName, p.cnp, p.birthdate + INTERVAL 1 DAY as birthdate, MAX(e.date) + INTERVAL 1 DAY as eocDate, d.name as department FROM 
                            patients p JOIN episode_of_care e ON p.id = e.patient_id JOIN departments d ON e.department_id = d.id WHERE 
                            e.id = ${req.query.searchQuery}`;

                if(req.query.departmentID != ''){
                    query += ` AND d.id = '${req.query.departmentID}' GROUP BY e.patient_id, d.id;`;
                } else {
                    query += ` GROUP BY e.patient_id, d.id;`;
                }

                db.query(query, (error, response) => {
                    if(error){
                        res.status(500).send();
                        throw error;
                    }
                    let searchResults = [];
                    response.forEach(search => {
                        searchResults.push({
                            patientName: search.patientName,
                            cnp: search.cnp,
                            birthdate: search.birthdate,
                            eocDate: search.eocDate,
                            department: search.department
                        });
                    })
                    res.status(200).send(searchResults);
                    next();
                });
            } else {
                let searchPatientName = mapName(req.query.searchQuery);
                let query = `SELECT CONCAT(p.firstname, ' ', p.lastname) as patientName, p.cnp, p.birthdate + INTERVAL 1 DAY as birthdate, MAX(e.date) + INTERVAL 1 DAY as eocDate, d.name as department FROM 
                            patients p JOIN episode_of_care e ON p.id = e.patient_id JOIN departments d ON e.department_id = d.id WHERE 
                            (p.firstname = '${searchPatientName[0]}' OR p.lastname = '${searchPatientName[0]}')`;

                if(req.query.departmentID != ''){
                    query += ` AND d.id = '${req.query.departmentID}' GROUP BY e.patient_id, d.id;`;
                } else {
                    query += ` GROUP BY e.patient_id, d.id;`;
                }

                db.query(query, (error, response) => {
                    if(error){
                        res.status(500).send();
                        throw error;
                    }
                    let searchResults = [];
                    response.forEach(search => {
                        searchResults.push({
                            patientName: search.patientName,
                            cnp: search.cnp,
                            birthdate: search.birthdate,
                            eocDate: search.eocDate,
                            department: search.department
                        });
                    })
                    res.status(200).send(searchResults);
                    next();
                });
            }
        } else if(req.query.searchQuery == ''){
            let query = `SELECT CONCAT(p.firstname, ' ', p.lastname) as patientName, p.cnp, p.birthdate + INTERVAL 1 DAY as birthdate, MAX(e.date) + INTERVAL 1 DAY as eocDate, d.name as department FROM 
                        patients p JOIN episode_of_care e ON p.id = e.patient_id JOIN departments d ON e.department_id = d.id WHERE 
                        d.id = '${req.query.departmentID}' GROUP BY e.patient_id, d.id;;`;
            
            db.query(query, (error, response) => {
                if(error){
                    res.status(500).send();
                    throw error;
                }
                let searchResults = [];
                response.forEach(search => {
                    searchResults.push({
                        patientName: search.patientName,
                        cnp: search.cnp,
                        birthdate: formatDate(search.birthdate),
                        eocDate: formatDate(search.eocDate),
                        department: search.department
                    });
                })
                res.status(200).send(searchResults);
                next();
            });
            
        }

        
    }
}