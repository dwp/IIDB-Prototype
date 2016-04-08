var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var fs = require('fs');
var _ = require('lodash');
var path = require('path');
var glob = require('globby');

var protoPaths = {
  version: '/:phase/:version*',
  step: '/:phase/:version*/app/:step',
  appsGlob: [
    __dirname + '/views/**/index.html',
    '!' + __dirname + '/views/index.html',
    '!' + __dirname + '/views/**/app/index.html',
    '!' + __dirname + 'views/includes/**/.*'
  ]
}

/**
 * for all routes provide some standard context data
 * TODO: refactor (this is brittle) but works for the Interaction Designer.
 */
router.use(function(req, res, next){

  // protoypes config obj
  var proto = {
    versions: []
  }

  // using glob pattern for set folder structure to grep url and title
  glob.sync(protoPaths.appsGlob).forEach(function(p){
    var sp = p.split('/');
    var computedPath = _.join(_.slice(sp,(_.indexOf(sp, 'views')+1)),'/');
    var title = computedPath.split('/')[1];
    proto.versions.push({ url: computedPath, title: (title[0].toUpperCase() + title.slice(1)).replace("-", ' ') });
  });

  // update locals so this data is accessible
  _.merge(res.locals,{
    foo: 'bar',
    postData: (req.body ? req.body : false),
    proto: proto
  });

  // on you go son
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
