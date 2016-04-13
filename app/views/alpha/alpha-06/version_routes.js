var express = require('express'),
router = express.Router();

module.exports = function (routeData) {
  router.use(routeData.path, function(req, res, next) {

    next();

  });
  return router;
};
