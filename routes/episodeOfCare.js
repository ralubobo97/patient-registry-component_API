const controller = require('../controllers/episodeOfCare');

module.exports = (router) => {
    router.get('/episodeOfCare/getLatestEpisodeOfCare', controller.getLatestEpisodeOfCare);
    router.get('/episodeOfCare/getDepartments', controller.getDepartments);
    router.get('/episodeOfCare/countLatestEpisodeOfCare', controller.countLatestEpisodeOfCare);
    router.get('/episodeOfCare/getEpisodesOfCareByPatientCNP', controller.getEpisodesOfCareByPatientCNP);
    router.get('/episodeOfCare/getPatientInformationByEOCCode', controller.getPatientInformationByEOCCode);
    router.post('/episodeOfCare/updateEpisodeOfCare', controller.updateEpisodeOfCare);
}