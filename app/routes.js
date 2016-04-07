var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var glob = require('glob');

var protoPaths = {
  version: '/:phase/:version*',
  step: '/:phase/:version*/app/:step',
  appsGlob: '/views/**/app/index.html'
}

/**
 * for all routes provide some standard context data
 */
router.use(function(req, res, next){
  var versionURLs;

  glob(__dirname + protoPaths.appsGlob, function(err, files){
    versionURLs = files.map(function(item){
      return item;
    });
  });

  _.merge(res.locals,{
    foo: 'bar',
    postData: (req.body ? req.body : false),
    proto: {
      urls: versionURLs
    }
  });

  next();

});

router.get('/', function (req, res) {
    res.render('index');
});

/**
 * handle 'phase' (alpha/beta,etc) and 'version' of prototypes by passing some
 * enhanced context data (useful to nunjucks templates).
 */
router.all([protoPaths.version], function(req, res, next){
  _.merge(res.locals.proto, {
    title: 'Industrial Injuries Diablement Benefit - ' + req.params.phase,
    version: req.params.version,
    path: '/' + req.params.phase + '/' + req.params.version + '/app'
  });
  next();
});

/**
 * Handles some OLD routing in lieu of a proper solution.
 * makes param for 'step' available to the view via locals
 */
router.all(protoPaths.step, function(req,res,next){

  var version = req.params.version || false,
      step = req.params.step || false,
      p = {
        step: step
      }

  // update local proto obj with useful data
  res.locals.proto ? _.merge(res.locals.proto, p) : res.locals.proto = p;

  // which prototype version
  switch (version) {

    // version alpha-03
    case '03':
      // which step
      switch (step) {
        case 'step2':
          if(req.body['employed'] === 'true' && req.body.selfemployed === 'false' && req.body.region === 'true') {
            next();
          } else {
            res.redirect('ineligible');
          }
          break;
        default:
          break;
      }
      break;

    // version alpha-04 - 06
    case '04':
    case '05':
    case '06':
      switch (step) {
        case 'medical_consent':
          if(req.body['employed'] === 'true' && req.body.selfemployed === 'false' && req.body.region === 'true') {
            next();
          } else {
            res.redirect('ineligible');
          }
          break;
        case 'step2':
          if(req.body['medical-consent'] === 'true') {
            next();
          } else {
            res.redirect('ineligible');
          }
          break;
        default:
          break;
      }
    default:
      break;
  }

  next();

});

// add your routes here
module.exports = router;
