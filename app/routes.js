var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var _ = require('lodash');

router.get('/', function (req, res) {
  res.render('index');
});

router.all(['/alpha-:version*'], function(req, res, next){
  res.locals.proto = {
    title: 'Industrial Injuries Diablement Benefit - Alpha',
    version: req.params.version
  }
  next();
});

/**
 * Handles some OLD routing in lieu of a proper solution.
 * makes param for 'step' available to the view via locals
 */
router.all('/alpha-:version/app/:step', function(req,res,next){

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
          if(req.body['employed'] === true && req.body.selfemployed === false && req.body.region === true) {
            next();
          } else {
            res.redirect('ineligible');
          }
          break;
        default:
          break;
      }
      break;

    // version alpha-04 & 06
    case '04':
    case '05':
    case '06':
      switch (step) {
        case 'medical_consent':
          if(req.body['employed'] === true && req.body.selfemployed === false && req.body.region === true) {
            next();
          } else {
            res.redirect('ineligible');
          }
          break;
        case 'step2':
          if(req.body['medical-consent'] === "Yes") {
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
