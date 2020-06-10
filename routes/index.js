const episodeOfCare = require('./episodeOfCare');

module.exports = (router) => {
    episodeOfCare(router);
    return router;
}