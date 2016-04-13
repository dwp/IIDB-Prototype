module.exports = function(router, config) {
  router.all(config.protoPaths.step, function(req,res,next){

    var currentPage = req.params.step,
        postData = req.body || {};

    // if current page == consent do stuff
    if(currentPage == 'consent') {

        if(postData['radio group'] == 'Every Thirteen') {
          console.log("every thirteen was chosen");
        } else {
          res.redirect('ineligible');
        }

    }

    next();

  });

  return router;
}
