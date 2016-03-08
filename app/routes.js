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

// temporary until I consider how to version this sort of logic, etc.
// no time at the minute.

var prototypePath = '/alpha-01/app';

router.post(prototypePath + '/step0', function(req, res){
  res.redirect(prototypePath + '/' + (req.body['claim-reason'] == "other" ? "ineligible" : "step1" ));
});

router.post(prototypePath + '/step2', function(req, res){
  res.redirect(prototypePath + '/step2');
});

router.post('/alpha-02/app' + '/step0', function(req, res, next){
  res.redirect('/alpha-02/app' + '/' + (req.body['claim-reason'] == "other" ? "ineligible" : "step1" ));
  next();
});

router.post('/alpha-02/app' + '/step1-process', function(req, res, next){
  // console.log(req.body);
  res.redirect('/alpha-02/app/step2');
  next();
});

router.post("/alpha-02/app/step2-process", function(req,res,next){
  // console.log(req);
  res.render('alpha-02/app/step3', { 'posted' : req.body });
  next();
});

router.post("/alpha-02/app/step3-process", function(req,res,next){
  // console.log(req);
  res.render('alpha-02/app/step4', { 'posted' : req.body });
  next();
});

// add your routes here

module.exports = router;
