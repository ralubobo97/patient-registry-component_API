const controller = require('../controllers/episodeOfCare');

module.exports = (router) => {
    router.get('/episodeOfCare/getLatestEpisodeOfCare', controller.getLatestEpisodeOfCare);
    router.get('/episodeOfCare/getDepartments', controller.getDepartments);
    router.get('/episodeOfCare/countLatestEpisodeOfCare', controller.countLatestEpisodeOfCare);
    router.get('/episodeOfCare/getEpisodesOfCareByPatientCNP', controller.getEpisodesOfCareByPatientCNP);
    router.get('/episodeOfCare/getPatientInformationByEOCCode', controller.getPatientInformationByEOCCode);
    router.post('/episodeOfCare/updateEpisodeOfCare', controller.updateEpisodeOfCare);
    router.post('/episodeOfCare/saveNewEpisodeOfCare', controller.saveNewEpisodeOfCare);
    router.get('/episodeOfCare/getLastRegisteredEOC', controller.getLastRegisteredEOC);
    router.get('/episodeOfCare/getPatientByCNP', controller.getPatientByCNP);
    router.post('/episodeOfCare/saveNewPatient', controller.saveNewPatient);
    router.get('/episodeOfCare/getPatientLastID', controller.getPatientLastID);
}