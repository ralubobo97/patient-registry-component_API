const moment = require('moment');
const formatDate = require('./utils').formatDate;
const reformatDate = require('./utils').reformatDate;

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
                let query = `SELECT COUNT(*) OVER() as fullCount, CONCAT(p.firstname, ' ', p.lastname) as patientName, p.cnp, p.birthdate + INTERVAL 1 DAY as birthdate, MAX(e.date) + INTERVAL 1 DAY as eocDate, d.name as department FROM 
                            patients p JOIN episode_of_care e ON p.id = e.patient_id JOIN departments d ON e.department_id = d.id WHERE 
                            p.cnp = '${req.query.searchQuery}'`;
                
                if(req.query.departmentID != ''){
                    query += ` AND d.id = ${req.query.departmentID}`;
                }

                query += ` GROUP BY e.patient_id, d.id LIMIT ${req.query.limit} OFFSET ${req.query.offset};`;

                db.query(query, (error, response) => {
                    if(error){
                        res.status(500).send();
                        throw error;
                    }
                    let searchResults = [];
                    let id = Number(req.query.offset) + 1;

                    response.forEach(search => {
                        searchResults.push({
                            id,
                            patientName: search.patientName,
                            cnp: search.cnp,
                            birthdate: formatDate(search.birthdate),
                            eocDate: formatDate(search.eocDate),
                            department: search.department,
                            count: search.fullCount
                        });
                    })
                    res.status(200).send(searchResults);
                    next();
                });
            } else if(moment(moment(req.query.searchQuery, 'DD.MM.YYYY', true).toDate()).isValid()){
                let exactBirthdate = moment(req.query.searchQuery, 'DD.MM.YYYY', true).toDate().toString();
                let query = `SELECT COUNT(*) OVER() as fullCount, CONCAT(p.firstname, ' ', p.lastname) as patientName, p.cnp, p.birthdate + INTERVAL 1 DAY as birthdate, MAX(e.date) + INTERVAL 1 DAY as eocDate, d.name as department FROM 
                            patients p JOIN episode_of_care e ON p.id = e.patient_id JOIN departments d ON e.department_id = d.id WHERE 
                            p.birthdate = '${exactBirthdate}'`;
                
                if(req.query.departmentID != ''){
                    query += ` AND d.id = ${req.query.departmentID}`;
                }

                query += ` GROUP BY e.patient_id, d.id LIMIT ${req.query.limit} OFFSET ${req.query.offset};`;

                db.query(query, (error, response) => {
                    if(error){
                        res.status(500).send();
                        throw error;
                    }
                    let searchResults = [];
                    let id = Number(req.query.offset) + 1;
                    
                    response.forEach(search => {
                        searchResults.push({
                            id,
                            patientName: search.patientName,
                            cnp: search.cnp,
                            birthdate: search.birthdate,
                            eocDate: search.eocDate,
                            department: search.department,
                            count: search.fullCount
                        });
                    })
                    res.status(200).send(searchResults);
                    next();
                });
            } else if(checkPhone(req.query.searchQuery)){
                let query = `SELECT COUNT(*) OVER() as fullCount, CONCAT(p.firstname, ' ', p.lastname) as patientName, p.cnp, p.birthdate + INTERVAL 1 DAY as birthdate, MAX(e.date) + INTERVAL 1 DAY as eocDate, d.name as department FROM 
                            patients p JOIN episode_of_care e ON p.id = e.patient_id JOIN departments d ON e.department_id = d.id WHERE 
                            p.phone = '${req.query.searchQuery}'`;

                if(req.query.departmentID != ''){
                    query += ` AND d.id = ${req.query.departmentID}`;
                }

                query += ` GROUP BY e.patient_id, d.id LIMIT ${req.query.limit} OFFSET ${req.query.offset};`;

                db.query(query, (error, response) => {
                    if(error){
                        res.status(500).send();
                        throw error;
                    }
                    let searchResults = [];
                    let id = Number(req.query.offset) + 1;

                    response.forEach(search => {
                        searchResults.push({
                            id,
                            patientName: search.patientName,
                            cnp: search.cnp,
                            birthdate: search.birthdate,
                            eocDate: search.eocDate,
                            department: search.department,
                            count: search.fullCount
                        });
                    })
                    res.status(200).send(searchResults);
                    next();
                });
            } else if(Number(req.query.searchQuery)){
                let query = `SELECT COUNT(*) OVER() as fullCount, CONCAT(p.firstname, ' ', p.lastname) as patientName, p.cnp, p.birthdate + INTERVAL 1 DAY as birthdate, MAX(e.date) + INTERVAL 1 DAY as eocDate, d.name as department FROM 
                            patients p JOIN episode_of_care e ON p.id = e.patient_id JOIN departments d ON e.department_id = d.id WHERE 
                            e.id = ${req.query.searchQuery}`;

                if(req.query.departmentID != ''){
                    query += ` AND d.id = ${req.query.departmentID}`;
                }

                query += ` GROUP BY e.patient_id, d.id LIMIT ${req.query.limit} OFFSET ${req.query.offset};`;

                db.query(query, (error, response) => {
                    if(error){
                        res.status(500).send();
                        throw error;
                    }
                    let searchResults = [];
                    let id = Number(req.query.offset) + 1;

                    response.forEach(search => {
                        searchResults.push({
                            id,
                            patientName: search.patientName,
                            cnp: search.cnp,
                            birthdate: search.birthdate,
                            eocDate: search.eocDate,
                            department: search.department,
                            count: search.fullCount
                        });
                    })
                    res.status(200).send(searchResults);
                    next();
                });
            } else {
                let searchPatientName = mapName(req.query.searchQuery);
                let query = `SELECT COUNT(*) OVER() as fullCount, CONCAT(p.firstname, ' ', p.lastname) as patientName, p.cnp, p.birthdate + INTERVAL 1 DAY as birthdate, MAX(e.date) + INTERVAL 1 DAY as eocDate, d.name as department FROM 
                            patients p JOIN episode_of_care e ON p.id = e.patient_id JOIN departments d ON e.department_id = d.id WHERE 
                            (p.firstname = '${searchPatientName[0]}' OR p.lastname = '${searchPatientName[0]}')`;

                if(req.query.departmentID != ''){
                    query += ` AND d.id = ${req.query.departmentID}`;
                }

                query += ` GROUP BY e.patient_id, d.id LIMIT ${req.query.limit} OFFSET ${req.query.offset};`;

                db.query(query, (error, response) => {
                    if(error){
                        res.status(500).send();
                        throw error;
                    }
                    let searchResults = [];
                    let id = Number(req.query.offset) + 1;

                    response.forEach(search => {
                        searchResults.push({
                            id,
                            patientName: search.patientName,
                            cnp: search.cnp,
                            birthdate: search.birthdate,
                            eocDate: search.eocDate,
                            department: search.department,
                            count: search.fullCount
                        });
                    })
                    res.status(200).send(searchResults);
                    next();
                });
            }
        } else if(req.query.searchQuery == '' && req.query.departmentID != ''){
            let query = `SELECT COUNT(*) OVER() as fullCount, CONCAT(p.firstname, ' ', p.lastname) as patientName, p.cnp, p.birthdate + INTERVAL 1 DAY as birthdate, MAX(e.date) + INTERVAL 1 DAY as eocDate, d.name as department FROM 
                        patients p JOIN episode_of_care e ON p.id = e.patient_id JOIN departments d ON e.department_id = d.id WHERE 
                        d.id = ${req.query.departmentID} GROUP BY e.patient_id, d.id LIMIT ${req.query.limit} OFFSET ${req.query.offset};`;
            
            db.query(query, (error, response) => {
                if(error){
                    res.status(500).send();
                    throw error;
                }
                let searchResults = [];
                let id = Number(req.query.offset) + 1;

                response.forEach(search => {
                    searchResults.push({
                        id,
                        patientName: search.patientName,
                        cnp: search.cnp,
                        birthdate: formatDate(search.birthdate),
                        eocDate: formatDate(search.eocDate),
                        department: search.department,
                        count: search.fullCount
                    });
                })
                res.status(200).send(searchResults);
                next();
            });
        } else {
            res.status(200).send();
            next();
        }
    },

    countLatestEpisodeOfCare: (req, res, next) => {
        let query = `SELECT COUNT(*) as totalRecords FROM (SELECT MAX(e.date) + INTERVAL 1 DAY as eocDate, d.name as department 
                    FROM episode_of_care e JOIN departments d ON e.department_id = d.id GROUP BY e.patient_id, d.id) as allEpisodesOfCare;`;
        
        db.query(query, (error, response) => {
            if(error){
                res.status(500).send();
                throw error;
            }
            res.status(200).send(response);
            next();
        });
    },

    getEpisodesOfCareByPatientCNP: (req, res, next) => {
        let query = `SELECT e.code, e.date + INTERVAL 1 DAY as eocDate, d.name as department, d.id  
                    FROM episode_of_care e JOIN departments d ON e.department_id = d.id JOIN patients p ON p.id = e.patient_id 
                    WHERE p.cnp = ${req.query.patientCNP};`;

        db.query(query, (error, response) => {
            if(error){
                res.status(500).send();
                throw error;
            }
            let episodeOfCareList = [];
            response.forEach(eoc => {
                episodeOfCareList.push({
                    eocCode: eoc.code,
                    eocDate: formatDate(eoc.eocDate),
                    department: eoc.department,
                    departmentID: eoc.id
                });
            });
            res.status(200).send(episodeOfCareList);
            next();
        });
    },

    getPatientInformationByEOCCode: (req, res, next) => {
        let query = `SELECT p.firstname, p.lastname, p.cid, p.birthdate  + INTERVAL 1 DAY as birthdate, p.birth_weight, p.gender, p.phone, p.personal_id, p.pid_series, p.pid_number, p.issued_by, p.issue_date + INTERVAL 1 DAY as issue_date  
                    FROM patients p JOIN episode_of_care e ON e.patient_id = p.id WHERE e.code = ${req.query.eocCode};`;

        db.query(query, (error, response) => {
            if(error){
                res.status(500).send();
                throw error;
            }
            let patientInfo = [];
            response.forEach(info => {
                patientInfo.push({
                    firstname: info.firstname,
                    lastname: info.lastname,
                    cid: info.cid,
                    birthdate: formatDate(info.birthdate),
                    birthWeight: info.birth_weight != null ? info.birth_weight : '',
                    gender: info.gender == 'M' ? 'male' : 'female',
                    phone: info.phone,
                    idType: info.personal_id,
                    series: info.pid_series,
                    seriesNumber: info.pid_number,
                    issuedBy: info.issued_by,
                    issueDate: formatDate(info.issue_date)
                });
            });
            res.status(200).send(patientInfo);
            next();
        });
    },

    updateEpisodeOfCare: (req, res, next) => {
        let { episodeOfCareForm, patientForm, patientDetailsForm, medicalDataForm  } = req.body;
        
        
        let issueDate = reformatDate(patientForm.issueDate);
        console.log(issueDate);
        

        // Address
        let country = patientDetailsForm.country ? patientDetailsForm.country.toString() : null;
        let county = patientDetailsForm.county ? patientDetailsForm.county.toString() : null;
        let city = patientDetailsForm.city ? patientDetailsForm.city.toString() : null;
        let nationality = patientDetailsForm.nationality ? patientDetailsForm.nationality.toString() : null;
        let street = patientDetailsForm.street ? patientDetailsForm.street.toString() : null;
        let streetNumber = patientDetailsForm.streetNumber ? patientDetailsForm.streetNumber : null;
        let building = patientDetailsForm.building ? patientDetailsForm.building.toString() : null;
        let apartment = patientDetailsForm.apartment ? patientDetailsForm.apartment : null;

        // Health insurance
        let insuranceStatus = patientDetailsForm.insuranceStatus ? patientDetailsForm.insuranceStatus.toString() : null;
        let insuranceType = patientDetailsForm.insuranceType ? patientDetailsForm.insuranceType.toString() : null;
        let familyDoctor = patientDetailsForm.familyDoctor ? patientDetailsForm.familyDoctor.toString() : null;
        let card = patientDetailsForm.card ? patientDetailsForm.card.toString() : null;
        let cardType = patientDetailsForm.cardType ? patientDetailsForm.cardType.toString() : null;
        let cardNumber = patientDetailsForm.cardNumber ? patientDetailsForm.cardNumber : null;
        
        // Medical data
        let bloodType = medicalDataForm.bloodType ? medicalDataForm.bloodType.toString() : null;
        let rh = medicalDataForm.rh ? medicalDataForm.rh.toString() : null;
        let ahc = medicalDataForm.ahc ? medicalDataForm.ahc.toString() : null;
        let observations = medicalDataForm.observations ? medicalDataForm.observations.toString() : null;
        let allergies = medicalDataForm.allergies ? medicalDataForm.allergies.toString() : null;
        let contraindications = medicalDataForm.contraindications ? medicalDataForm.contraindications.toString() : null;
        let lifestyle = medicalDataForm.lifestyle ? medicalDataForm.lifestyle.toString() : null;

        let query = `UPDATE episode_of_care e, patients p, addresses a, health_insurance h, medical_data m 
                    SET e.department_id = ${episodeOfCareForm.departmentID}, 
                        p.firstname = '${patientForm.firstname}', p.lastname = '${patientForm.lastname}', p.pid_series = '${patientForm.series}', p.pid_number = '${patientForm.seriesNumber}', p.issue_date = ${issueDate}, 
                        a.country = ${country}, a.county = ${county}, a.city = ${city}, a.nationality = ${nationality}, a.street = ${street}, a.number = ${streetNumber}, a.building = ${building}, a.apartment = ${apartment}, 
                        h.insurance_status = ${insuranceStatus}, h.insurance_type = ${insuranceType}, h.family_doctor = ${familyDoctor}, h.card = ${card}, h.card_type = ${cardType}, h.card_number = ${cardNumber}, 
                        m.blood_type = ${bloodType}, m.rh = ${rh}, m.ahc = ${ahc}, m.observations = ${observations}, m.allergies = ${allergies}, m.contraindications = ${contraindications}, m.lifestyle = ${lifestyle} 
                    WHERE e.code = ${episodeOfCareForm.eocCode} AND 
                        e.patient_id = p.id AND 
                        a.patient_id = p.id AND 
                        h.patient_id = p.id AND 
                        m.patient_id = p.id;`;
        
        // db.query(query, (error, response) => {
        //     if(error){
        //         res.status(500).send();
        //         throw error;
        //     }
        //     res.status(200).send();
        //     next();
        // });
    }
}