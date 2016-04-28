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

     // Self employed checker
      case 'self_checker':
        if(postData['selfchecker'] == 'true') {
          res.redirect('self_employed_class1');
        }
        else if (postData['selfchecker'] == 'false') {
          res.redirect('employer_details');
        }
      break;



    }

    next();

  });

  return router;
}
