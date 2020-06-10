const controller = require('../controllers/episodeOfCare');

module.exports = (router) => {
    router.get('/episodeOfCare/getLatestEpisodeOfCare', controller.getLatestEpisodeOfCare);
    router.get('/episodeOfCare/getDepartments', controller.getDepartments);
}