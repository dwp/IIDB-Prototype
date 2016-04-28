// Use this file to change prototype configuration.

// Note: prototype config can be overridden using environment variables (eg on heroku)

module.exports = {

  // Service name used in header. Eg: 'Renew your passport'
  serviceName: "Industrial Injuries Disablement Benefit",

  // Default port that prototype runs on
  port: '3000',

  // Enable or disable password protection on production
  useAuth: 'true',

  // Cookie warning - update link to service's cookie page.
  cookieText: 'GOV.UK uses cookies to make the site simpler. <a href="#" title="Find out more about cookies">Find out more about cookies</a>',

  // this could be accessed from a variety of required js modules so placed here in config
  protoPaths: {
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

};
