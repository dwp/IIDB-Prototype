module.exports = function(router, config) {
  router.all(config.protoPaths.step, function(req,res,next){

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

      case 'self_employed':
        if(postData['atwork'] == 'false') {
          res.redirect('ineligible');
        }
      break;

      case 'self_employed_class1':
        if(postData['selfemployed'] == 'false') {
          res.redirect('employer_details');
        }
      break;

    }

    next();

  });

  return router;
}
