var express = require('express'),
  router = express.Router(),
  bodyparser = require('body-parser'),
  fs = require('fs'),
  _ = require('lodash'),
  path = require('path'),
  glob = require('globby');

var protoPaths = {
  version: '/:phase/:version*',                     // e.g '/alpha/alpha-01/'
  step: '/:phase/:version*/app/:step',              // e.g '/alpha/alpha-01/app/address'
  appsGlob: [
    __dirname + '/views/**/index.html',
    '!' + __dirname + '/views/index.html',
    '!' + __dirname + '/views/**/app/index.html',
    '!' + __dirname + 'views/includes/**/.*'
  ],
  routesGlob: [
    __dirname + '/views/**/version_routes.js'
  ]
}

var getVersionName = function(path) {
  var sp = path.split('/');
  var computedPath = _.join( _.slice( sp, ( _.indexOf(sp, 'views') +1 ) ), '/' );
  return {
    computedPath: computedPath,
    title: computedPath.split('/')[1],
  }
}

// loop each version route file and bring it in passing router and some config
glob.sync(protoPaths.routesGlob).forEach(function(p){
  require(p)(router, { protoPaths: protoPaths });
});

/**
 * for all routes provide some standard context data
 * this is brittle but works for the Interaction Designer.
 */
router.use(function(req, res, next){

  // protoypes config obj
  var proto = {
    versions: [],
    stages: ['alpha']
  }

  // using glob pattern for the predefined folder structure to grep url and title
  glob.sync(protoPaths.appsGlob).forEach(function(p){
    var v = getVersionName(p);
    proto.versions.push({ url: v.computedPath, title: (v.title[0].toUpperCase() + v.title.slice(1)).replace("-", ' ') });
  });

  // update locals so this data is accessible
  _.merge(res.locals,{
    postData: (req.body ? req.body : false),
    proto: proto
  });

  next();

});

/**
 * Just render the route index file
 */
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
    case 'alpha-03':
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
    case 'alpha-04':
    case 'alpha-05':
    case 'alpha-06':
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
