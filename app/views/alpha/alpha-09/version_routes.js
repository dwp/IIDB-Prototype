module.exports = function(router, config) {
  router.all(config.route, function(req,res,next){

    var requestedPage = req.params.step,
        postData = req.body || {};

    switch(requestedPage) {

      case 'location':
        if(postData['reason'] == 'other') {
          res.redirect('ineligible');
        }
      break;

      case 'working':
        if(postData['withinregion'] == 'false') {
          res.redirect('ineligible');
        }
      break;

       // Self employed main page          
      case 'elligible_consent':
        if(postData['selfemployed'] == 'true') {
          res.redirect('self_employed_class1');
        }
        else if (postData['selfemployed'] == 'false') {
          res.redirect('elligible_consent');
        } 
        else if (postData['selfemployed'] == 'unsure') {
          res.redirect('self_checker');
        } 
        // Self checker page 
        if(postData['selfchecker'] == 'true') {
          res.redirect('self_employed_class1');
        }
        else if (postData['selfchecker'] == 'false') {
          res.redirect('elligible_consent');
        } 
        // Self class 1 page //
        if(postData['payclass1"'] == 'true') {
          res.redirect('elligible_consent');
        }
        else if (postData['payclass1'] == 'false') {
          res.redirect('ineligible');
        } 
      break;



    }

    next();

  });

  return router;
}
