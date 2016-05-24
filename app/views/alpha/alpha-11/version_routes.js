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
      case 'accident_date':
      if(postData['selfemployed'] == 'employed') {
          res.redirect('accident_date');
        }
        else if (postData['selfemployed'] == 'selfemployed') {
          res.redirect('ineligible');
        } 
        else if (postData['selfemployed'] == 'director') {
          res.redirect('accident_date');
        } 
        break;



      // case 'elligible_consent':
      //   if(postData['selfemployed'] == 'true') {
      //     res.redirect('self_employed_class1');
      //   }
      //   else if (postData['selfemployed'] == 'false') {
      //     res.redirect('elligible_consent');
      //   } 
      //   else if (postData['selfemployed'] == 'unsure') {
      //     res.redirect('self_checker');
      //   } 
      //   // Self checker page 
      //   if(postData['selfchecker'] == 'true') {
      //     res.redirect('self_employed_class1');
      //   }
      //   else if (postData['selfchecker'] == 'false') {
      //     res.redirect('elligible_consent');
      //   } 
      //   // Self class 1 page //
      //   if(postData['payclass1"'] == 'true') {
      //     res.redirect('elligible_consent');
      //   }
      //   else if (postData['payclass1'] == 'false') {
      //     res.redirect('ineligible');
      //   } 
      // break;
            
      //   // Medical Professionals //
      //   case 'medical_names':
      //   if(postData['seek_medical'] == 'false') {
      //     res.redirect('accident_workrelated');
      //   }
      // break;


            
        // Did you report the accident to the employer //
        //case 'report_got':
       // if(postData['report_employer'] == 'false') {
         // res.redirect('employer_details');
        //}
      //break;

    }

    next();

  });

  return router;
}
