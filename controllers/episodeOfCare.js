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
                let query = `SELECT COUNT(*) OVER() as fullCount, CONCAT(p.firstname, ' ', p.lastname) as patientName, p.cnp, p.birthdate + INTERVAL 1 DAY as birthdate, e.date + INTERVAL 1 DAY as eocDate, d.name as department FROM 
                            patients p JOIN episode_of_care e ON p.id = e.patient_id JOIN departments d ON e.department_id = d.id WHERE 
                            p.cnp = '${req.query.searchQuery}'`;
                
                if(req.query.departmentID != ''){
                    query += ` AND d.id = ${req.query.departmentID}`;
                }

                query += ` ORDER BY e.date DESC LIMIT 1 OFFSET ${req.query.offset};`;

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
                let exactBirthdate = moment(req.query.searchQuery, 'DD.MM.YYYY', true).format('YYYY-MM-DD').toString();
                let query = `SELECT COUNT(*) OVER() as fullCount, CONCAT(p.firstname, ' ', p.lastname) as patientName, p.cnp, p.birthdate + INTERVAL 1 DAY as birthdate, MAX(e.date) + INTERVAL 1 DAY as eocDate, d.name as department FROM 
                            patients p JOIN episode_of_care e ON p.id = e.patient_id JOIN departments d ON e.department_id = d.id WHERE 
                            p.birthdate = '${exactBirthdate}'`;
                
                if(req.query.departmentID != ''){
                    query += ` AND d.id = ${req.query.departmentID}`;
                }

                query += ` GROUP BY e.patient_id ORDER BY e.date DESC LIMIT ${req.query.limit} OFFSET ${req.query.offset};`;

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
            } else if(checkPhone(req.query.searchQuery)){
                let query = `SELECT COUNT(*) OVER() as fullCount, CONCAT(p.firstname, ' ', p.lastname) as patientName, p.cnp, p.birthdate + INTERVAL 1 DAY as birthdate, e.date + INTERVAL 1 DAY as eocDate, d.name as department FROM 
                            patients p JOIN episode_of_care e ON p.id = e.patient_id JOIN departments d ON e.department_id = d.id WHERE 
                            p.phone = '${req.query.searchQuery}'`;

                if(req.query.departmentID != ''){
                    query += ` AND d.id = ${req.query.departmentID}`;
                }

                query += ` ORDER BY e.date DESC LIMIT 1 OFFSET ${req.query.offset};`;

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
            } else if(Number(req.query.searchQuery)){
                let query = `SELECT COUNT(*) OVER() as fullCount, CONCAT(p.firstname, ' ', p.lastname) as patientName, p.cnp, p.birthdate + INTERVAL 1 DAY as birthdate, e.date + INTERVAL 1 DAY as eocDate, d.name as department FROM 
                            patients p JOIN episode_of_care e ON p.id = e.patient_id JOIN departments d ON e.department_id = d.id WHERE 
                            e.code = ${req.query.searchQuery}`;

                if(req.query.departmentID != ''){
                    query += ` AND d.id = ${req.query.departmentID}`;
                }

                query += ` ORDER BY e.date DESC LIMIT 1 OFFSET ${req.query.offset};`;

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
                let searchPatientName = mapName(req.query.searchQuery);
                let query = `SELECT COUNT(*) OVER() as fullCount, CONCAT(p.firstname, ' ', p.lastname) as patientName, p.cnp, p.birthdate + INTERVAL 1 DAY as birthdate, MAX(e.date) + INTERVAL 1 DAY as eocDate, d.name as department FROM 
                            patients p JOIN episode_of_care e ON p.id = e.patient_id JOIN departments d ON e.department_id = d.id WHERE 
                            (p.firstname = '${searchPatientName[0]}' OR p.lastname = '${searchPatientName[0]}')`;

                if(req.query.departmentID != ''){
                    query += ` AND d.id = ${req.query.departmentID}`;
                }

                query += ` GROUP BY e.patient_id ORDER BY e.date DESC LIMIT ${req.query.limit} OFFSET ${req.query.offset};`;

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
            }
        } else if(req.query.searchQuery == '' && req.query.departmentID != ''){
            let query = `SELECT COUNT(*) OVER() as fullCount, CONCAT(p.firstname, ' ', p.lastname) as patientName, p.cnp, p.birthdate + INTERVAL 1 DAY as birthdate, e.date + INTERVAL 1 DAY as eocDate, d.name as department FROM 
                        patients p JOIN episode_of_care e ON p.id = e.patient_id JOIN departments d ON e.department_id = d.id WHERE 
                        d.id = ${req.query.departmentID} GROUP BY e.patient_id ORDER BY e.date LIMIT ${req.query.limit} OFFSET ${req.query.offset};`;
            
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
        let query = `SELECT a.country, a.county, a.city, a.nationality, a.street, a.number, a.building, a.apartment, 
                    h.insurance_status, h.insurance_type, h.family_doctor, h.card, h.card_type, h.card_number, 
                    m.blood_type, m.rh, m.ahc, m.observations, m.allergies, m.contraindications, m.lifestyle 
                    FROM addresses a JOIN episode_of_care e ON e.patient_id = a.patient_id 
                                    JOIN health_insurance h ON h.patient_id = e.patient_id 
                                    JOIN medical_data m ON m.patient_id = e.patient_id 
                    WHERE e.code = ${req.query.eocCode};`;

        db.query(query, (error, response) => {
            if(error){
                res.status(500).send();
                throw error;
            }
            let patientInfo = [];
            response.forEach(info => {
                patientInfo.push({
                    country: info.country ? info.country : '',
                    county: info.county ? info.county : '',
                    city: info.city ? info.city : '',
                    nationality: info.nationality ? info.nationality : '',
                    street: info.street ? info.street : '',
                    streetNumber: info.number ? info.number : '',
                    building: info.building ? info.building : '',
                    apartment: info.apartment ? info.apartment : '',
                    insuranceStatus: info.insurance_status ? info.insurance_status : '',
                    insuranceType: info.insurance_type ? info.insurance_type : '',
                    familyDoctor: info.family_doctor ? info.family_doctor : '',
                    card: info.card ? info.card : '',
                    cardType: info.card_type ? info.card_type : '',
                    cardNumber: info.card_number ? info.card_number : '',
                    bloodType: info.blood_type ? info.blood_type : '',
                    rh: info.rh ? info.rh : '',
                    ahc: info.ahc ? info.ahc : '',
                    observations: info.observations ? info.observations : '',
                    allergies: info.allergies ? info.allergies : '',
                    contraindications: info.contraindications ? info.contraindications : '',
                    lifestyle: info.lifestyle ? info.lifestyle : '',
                });
            });
            res.status(200).send(patientInfo);
            next();
        });
    },

    updateEpisodeOfCare: (req, res, next) => {
        let { episodeOfCareForm, patientForm, patientDetailsForm, medicalDataForm  } = req.body;
        let dateFormat = '%d.%m.%Y';

        let query = `UPDATE episode_of_care e, patients p, addresses a, health_insurance h, medical_data m 
                    SET e.department_id = ${episodeOfCareForm.departmentID}, p.firstname = '${patientForm.firstname}', 
                        p.lastname = '${patientForm.lastname}', p.pid_series = '${patientForm.series}', 
                        p.pid_number = '${patientForm.seriesNumber}', p.issue_date = STR_TO_DATE('${patientForm.issueDate}', '${dateFormat}')`;

        // ADDRESS details
        if(patientDetailsForm.country){
            query += `, a.country = '${patientDetailsForm.country}'`;
        } else { query += `, a.country = null`; }

        if(patientDetailsForm.county){
            query += `, a.county = '${patientDetailsForm.county}'`;
        } else { query += `, a.county = null`; }

        if(patientDetailsForm.city){
            query += `, a.city = '${patientDetailsForm.city}'`;
        } else { query += `, a.city = null`; }

        if(patientDetailsForm.nationality){
            query += `, a.nationality = '${patientDetailsForm.nationality}'`;
        } else { query += `, a.nationality = null`; }

        if(patientDetailsForm.street){
            query += `, a.street = '${patientDetailsForm.street}'`;
        } else { query += `, a.street = null`; }

        if(patientDetailsForm.streetNumber){
            query += `, a.number = ${patientDetailsForm.streetNumber}`;
        } else { query += `, a.number = null`; }

        if(patientDetailsForm.building){
            query += `, a.building = '${patientDetailsForm.building}'`;
        } else { query += `, a.building = null`; }

        if(patientDetailsForm.apartment){
            query += `, a.apartment = ${patientDetailsForm.apartment}`;
        } else { query += `, a.apartment = null`; }

        // HEALTH INSURANCE details
        if(patientDetailsForm.insuranceStatus){
            query += `, h.insurance_status = '${patientDetailsForm.insuranceStatus}'`;
        } else { query += `, h.insurance_status = null`; }

        if(patientDetailsForm.insuranceType){
            query += `, h.insurance_type = '${patientDetailsForm.insuranceType}'`;
        } else { query += `, h.insurance_type = null`; }

        if(patientDetailsForm.familyDoctor){
            query += `, h.family_doctor = '${patientDetailsForm.familyDoctor}'`;
        } else { query += `, h.family_doctor = null`; }

        if(patientDetailsForm.card){
            query += `, h.card = '${patientDetailsForm.card}'`;
        } else { query += `, h.card = null`; }

        if(patientDetailsForm.cardType){
            query += `, h.card_type = '${patientDetailsForm.cardType}'`;
        } else { query += `, h.card_type = null`; }

        if(patientDetailsForm.cardNumber){
            query += `, h.card_number = ${patientDetailsForm.cardNumber}`;
        } else { query += `, h.card_number = null`; }

        // MEDICAL DATA details
        if(medicalDataForm.bloodType){
            query += `, m.blood_type = '${medicalDataForm.bloodType}'`;
        } else { query += `, m.blood_type = null`; }

        if(medicalDataForm.rh){
            query += `, m.rh = '${medicalDataForm.rh}'`;
        } else { query += `, m.rh = null`; }

        if(medicalDataForm.ahc){
            query += `, m.ahc = '${medicalDataForm.ahc}'`;
        } else { query += `, m.ahc = null`; }

        if(medicalDataForm.observations){
            query += `, m.observations = '${medicalDataForm.observations}'`;
        } else { query += `, m.observations = null`; }

        if(medicalDataForm.allergies){
            query += `, m.allergies = '${medicalDataForm.allergies}'`;
        } else { query += `, m.allergies = null`; }

        if(medicalDataForm.contraindications){
            query += `, m.contraindications = '${medicalDataForm.contraindications}'`;
        } else { query += `, m.contraindications = null`; }

        if(medicalDataForm.lifestyle){
            query += `, m.lifestyle = '${medicalDataForm.lifestyle}'`;
        } else { query += `, m.lifestyle = null`; }

        query += ` WHERE e.code = ${episodeOfCareForm.eocCode} AND 
                        e.patient_id = p.id AND 
                        a.patient_id = p.id AND 
                        h.patient_id = p.id AND 
                        m.patient_id = p.id;`

        db.query(query, (error, response) => {
            if(error){
                res.status(500).send();
                throw error;
            }
            res.status(200).send();
            next();
        });
    },

    getLastRegisteredEOC: (req, res, next) => {
        let query = `SELECT * FROM episode_of_care ORDER BY code DESC LIMIT 1;`;

        db.query(query, (error, response) => {
            if(error){
                res.status(500).send();
                throw error;
            }
            res.status(200).send(response);
            next();
        });
    },

    getPatientByCNP: (req, res, next) => {
        let query = `SELECT id, firstname, lastname, cnp, cid, birthdate + INTERVAL 1 DAY as birthdate, birth_weight, gender, phone, personal_id, 
                    pid_series, pid_number, issued_by, issue_date + INTERVAL 1 DAY as issue_date FROM patients WHERE cnp = '${req.query.cnp}';`;

        db.query(query, (error, response) => {
            if(error){
                res.status(500).send();
                throw error;
            }
            let patient = {};
            response.forEach(info => {
                patient.patientID = info.id;
                patient.firstname = info.firstname;
                patient.lastname = info.lastname;
                patient.cnp = info.cnp;
                patient.cid = info.cid;
                patient.birthdate = formatDate(info.birthdate);
                patient.birthWeight = info.birth_weight;
                patient.gender = info.gender;
                patient.phone = info.phone;
                patient.idType = info.personal_id;
                patient.series = info.pid_series;
                patient.seriesNumber = info.pid_number;
                patient.issuedBy = info.issued_by;
                patient.issueDate = formatDate(info.issue_date);
            });
            res.status(200).send(patient);
            next();
        });
    },
    
    saveNewEpisodeOfCare: (req, res, next) => {
        let { patientID, episodeOfCareForm, patientForm, patientDetailsForm, medicalDataForm  } = req.body;
        let dateFormat = '%d.%m.%Y';
        
        let query = `INSERT INTO episode_of_care (code, patient_id, date, department_id) 
                        VALUES (${episodeOfCareForm.eocCode}, ${patientID}, STR_TO_DATE('${episodeOfCareForm.eocDate}', '${dateFormat}'), ${episodeOfCareForm.departmentID}); 
                    UPDATE  patients SET firstname = '${patientForm.firstname}', lastname = '${patientForm.lastname}', pid_series = '${patientForm.series}', 
                                        pid_number = '${patientForm.seriesNumber}', issue_date = STR_TO_DATE('${patientForm.issueDate}', '${dateFormat}') 
                            WHERE id = ${patientID}; 
                    INSERT INTO addresses (patient_id, country, county, city, nationality, street, number, building, apartment, date) VALUES (${patientID}`;
        
        // ADDRESS details
        if(patientDetailsForm.country) {
            query += `, '${patientDetailsForm.country}'`;
        } else { query += `, null`; }

        if(patientDetailsForm.county) {
            query += `, '${patientDetailsForm.county}'`;
        } else { query += `, null`; }

        if(patientDetailsForm.city) {
            query += `, '${patientDetailsForm.city}'`;
        } else { query += `, null`; }

        if(patientDetailsForm.nationality) {
            query += `, '${patientDetailsForm.nationality}'`;
        } else { query += `, null`; }

        if(patientDetailsForm.street) {
            query += `, '${patientDetailsForm.street}'`;
        } else { query += `, null`; }

        if(patientDetailsForm.streetNumber) {
            query += `, ${patientDetailsForm.streetNumber}`;
        } else { query += `, null`; }

        if(patientDetailsForm.building) {
            query += `, '${patientDetailsForm.building}'`;
        } else { query += `, null`; }

        if(patientDetailsForm.apartment) {
            query += `, ${patientDetailsForm.apartment}`;
        } else { query += `, null`; }

        query += `, STR_TO_DATE('${episodeOfCareForm.eocDate}', '${dateFormat}')); `;

        // HEALTH INSURANCE details
        query += `INSERT INTO health_insurance (patient_id, insurance_status, insurance_type, family_doctor, card, card_type, card_number, date) VALUES (${patientID}`;
        
        if(patientDetailsForm.insuranceStatus) {
            query += `, '${patientDetailsForm.insuranceStatus}'`;
        } else { query += `, null`; }

        if(patientDetailsForm.insuranceType) {
            query += `, '${patientDetailsForm.insuranceType}'`;
        } else { query += `, null`; }

        if(patientDetailsForm.familyDoctor) {
            query += `, '${patientDetailsForm.familyDoctor}'`;
        } else { query += `, null`; }

        if(patientDetailsForm.card) {
            query += `, '${patientDetailsForm.card}'`;
        } else { query += `, null`; }

        if(patientDetailsForm.cardType) {
            query += `, '${patientDetailsForm.cardType}'`;
        } else { query += `, null`; }

        if(patientDetailsForm.cardNumber) {
            query += `, ${patientDetailsForm.cardNumber}`;
        } else { query += `, null`; }
        
        query += `, STR_TO_DATE('${episodeOfCareForm.eocDate}', '${dateFormat}')); `;

        // MEDICAL DATA details
        query += `INSERT INTO medical_data (patient_id, blood_type, rh, ahc, observations, allergies, contraindications, lifestyle, date) VALUES (${patientID}`;
        
        if(medicalDataForm.bloodType) {
            query += `, '${medicalDataForm.bloodType}'`;
        } else { query += `, null`; }

        if(medicalDataForm.rh) {
            query += `, '${medicalDataForm.rh}'`;
        } else { query += `, null`; }

        if(medicalDataForm.ahc) {
            query += `, '${medicalDataForm.ahc}'`;
        } else { query += `, null`; }

        if(medicalDataForm.observations) {
            query += `, '${medicalDataForm.observations}'`;
        } else { query += `, null`; }

        if(medicalDataForm.allergies) {
            query += `, '${medicalDataForm.allergies}'`;
        } else { query += `, null`; }

        if(medicalDataForm.contraindications) {
            query += `, '${medicalDataForm.contraindications}'`;
        } else { query += `, null`; }

        if(medicalDataForm.lifestyle) {
            query += `, '${medicalDataForm.lifestyle}'`;
        } else { query += `, null`; }

        query += `, STR_TO_DATE('${episodeOfCareForm.eocDate}', '${dateFormat}'));`;
             
        db.query(query, (error, response) => {
            if(error){
                res.status(500).send();
                throw error;
            }
            res.status(200).send();
            next();
        });
    },

    saveNewPatient: (req, res, next) => {
        let { newPatientID, newPatientEOCForm, newPatientForm, newPatientDetailsForm, newPatientMedicalDataForm } = req.body;
        let dateFormat = '%d.%m.%Y';

        let query = `INSERT INTO patients (id, firstname, lastname, cnp, cid, birthdate, birth_weight, gender, personal_id, pid_series, pid_number, issued_by, issue_date) 
                        VALUES (${newPatientID}, '${newPatientForm.firstname}', '${newPatientForm.lastname}', '${newPatientForm.cnp}', '${newPatientForm.cid}', 
                                STR_TO_DATE('${newPatientForm.birthdate}', '${dateFormat}'), ${newPatientForm.birthWeight}, '${newPatientForm.gender}', 
                                '${newPatientForm.idType}', '${newPatientForm.series}', '${newPatientForm.seriesNumber}', '${newPatientForm.issuedBy}', 
                                STR_TO_DATE('${newPatientForm.issueDate}', '${dateFormat}')); 
                    INSERT INTO episode_of_care (code, patient_id, date, department_id) 
                        VALUES (${newPatientEOCForm.eocCode}, ${newPatientID}, STR_TO_DATE('${newPatientEOCForm.eocDate}', '${dateFormat}'), ${newPatientEOCForm.departmentID}); 
                    INSERT INTO addresses (patient_id, country, county, city, nationality, street, number, building, apartment, date) 
                        VALUES (${newPatientID}`;
        
        // ADDRESS details
        if(newPatientDetailsForm.country) {
            query += `, '${newPatientDetailsForm.country}'`;
        } else { query += `, null`; }

        if(newPatientDetailsForm.county) {
            query += `, '${newPatientDetailsForm.county}'`;
        } else { query += `, null`; }

        if(newPatientDetailsForm.city) {
            query += `, '${newPatientDetailsForm.city}'`;
        } else { query += `, null`; }

        if(newPatientDetailsForm.nationality) {
            query += `, '${newPatientDetailsForm.nationality}'`;
        } else { query += `, null`; }

        if(newPatientDetailsForm.street) {
            query += `, '${newPatientDetailsForm.street}'`;
        } else { query += `, null`; }

        if(newPatientDetailsForm.streetNumber) {
            query += `, ${newPatientDetailsForm.streetNumber}`;
        } else { query += `, null`; }

        if(newPatientDetailsForm.building) {
            query += `, '${newPatientDetailsForm.building}'`;
        } else { query += `, null`; }

        if(newPatientDetailsForm.apartment) {
            query += `, ${newPatientDetailsForm.apartment}`;
        } else { query += `, null`; }

        query += `, STR_TO_DATE('${newPatientEOCForm.eocDate}', '${dateFormat}')); `;

        // HEALTH INSURANCE details
        query += `INSERT INTO health_insurance (patient_id, insurance_status, insurance_type, family_doctor, card, card_type, card_number, date) 
                    VALUES (${newPatientID}`;
        
        if(newPatientDetailsForm.insuranceStatus) {
            query += `, '${newPatientDetailsForm.insuranceStatus}'`;
        } else { query += `, null`; }

        if(newPatientDetailsForm.insuranceType) {
            query += `, '${newPatientDetailsForm.insuranceType}'`;
        } else { query += `, null`; }

        if(newPatientDetailsForm.familyDoctor) {
            query += `, '${newPatientDetailsForm.familyDoctor}'`;
        } else { query += `, null`; }

        if(newPatientDetailsForm.card) {
            query += `, '${newPatientDetailsForm.card}'`;
        } else { query += `, null`; }

        if(newPatientDetailsForm.cardType) {
            query += `, '${newPatientDetailsForm.cardType}'`;
        } else { query += `, null`; }

        if(newPatientDetailsForm.cardNumber) {
            query += `, ${newPatientDetailsForm.cardNumber}`;
        } else { query += `, null`; }
        
        query += `, STR_TO_DATE('${newPatientEOCForm.eocDate}', '${dateFormat}')); `;

        // MEDICAL DATA details
        query += `INSERT INTO medical_data (patient_id, blood_type, rh, ahc, observations, allergies, contraindications, lifestyle, date) 
                    VALUES (${newPatientID}`;
        
        if(newPatientMedicalDataForm.bloodType) {
            query += `, '${newPatientMedicalDataForm.bloodType}'`;
        } else { query += `, null`; }

        if(newPatientMedicalDataForm.rh) {
            query += `, '${newPatientMedicalDataForm.rh}'`;
        } else { query += `, null`; }

        if(newPatientMedicalDataForm.ahc) {
            query += `, '${newPatientMedicalDataForm.ahc}'`;
        } else { query += `, null`; }

        if(newPatientMedicalDataForm.observations) {
            query += `, '${newPatientMedicalDataForm.observations}'`;
        } else { query += `, null`; }

        if(newPatientMedicalDataForm.allergies) {
            query += `, '${newPatientMedicalDataForm.allergies}'`;
        } else { query += `, null`; }

        if(newPatientMedicalDataForm.contraindications) {
            query += `, '${newPatientMedicalDataForm.contraindications}'`;
        } else { query += `, null`; }

        if(newPatientMedicalDataForm.lifestyle) {
            query += `, '${newPatientMedicalDataForm.lifestyle}'`;
        } else { query += `, null`; }

        query += `, STR_TO_DATE('${newPatientEOCForm.eocDate}', '${dateFormat}'));`;

        db.query(query, (error, response) => {
            if(error){
                res.status(500).send();
                throw error;
            }
            res.status(200).send();
            next();
        });
    },

    getPatientLastID: (req, res, next) => {
        let query = `SELECT id FROM patients ORDER BY id DESC LIMIT 1;`;

        db.query(query, (error, response) => {
            if(error){
                res.status(500).send();
                throw error;
            }
            res.status(200).send(response);
            next();
        });
    }
}