var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');

router.get('/', function (req, res) {
  res.render('index');
});

// Example routes - feel free to delete these

// Passing data into a page

router.get('/examples/template-data', function (req, res) {

  res.render('examples/template-data', { 'name' : 'Foo' });

});

// Branching

router.get('/examples/over-18', function (req, res) {
  // get the answer from the query string (eg. ?over18=false)
  var over18 = req.query.over18;
  if (over18 == "false"){
    // redirect to the relevant page
    res.redirect("/examples/under-18");
  } else {
    // if over18 is any other value (or is missing) render the page requested
    res.render('examples/over-18');
  }
});

router.post('/alpha-03/app/step2', function(req,res){
  if(req.body['employed'] === "Yes" && req.body.selfemployed === "No" && req.body.region === "Yes") {
    res.render('alpha-03/app/medical_consent');
  } else {
    res.redirect("/alpha-03/app/ineligible");
  }
});

// aahh! no time to think, quick for a meeting!
router.post('/alpha-04/app/medical_consent', function(req,res){
  if(req.body['employed'] === "Yes" && req.body.selfemployed === "No" && req.body.region === "Yes") {
    res.render('alpha-04/app/medical_consent');
  } else {
    res.redirect("/alpha-04/app/ineligible");
  }
});

// aahh! no time to think, quick for a meeting!
router.post('/alpha-04/app/step2', function(req,res){
  if(req.body['medical-consent'] === "Yes") {
    res.render('alpha-04/app/step2');
  } else {
    res.redirect("/alpha-04/app/ineligible");
  }
});

// add your routes here
module.exports = router;
