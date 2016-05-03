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
      case 'self_checker':
        if(postData['selfemployed'] == 'true') {
          res.redirect('self_employed_class1');
        }
        else if (postData['selfemployed'] == 'false') {
          res.redirect('employer_details');
        } 
        else if (postData['selfemployed'] == 'unsure') {
          res.redirect('self_checker');
        } 
      break;
            
    // Self checker page          
      case 'self_employed_class1':
        if(postData['selfchecker'] == 'true') {
          res.redirect('self_employed_class1');
        }
        else if (postData['selfchecker'] == 'false') {
          res.redirect('employer_details');
        } 
      break;
            
    // Self class 1 page //
      case 'employer_details':
        if(postData['payclass1"'] == 'true') {
          res.redirect('employer_details');
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
