var _ = require('lodash');

exports.getVersionName = function(path) {
  var sp = path.split('/');
  var computedPath = _.join( _.slice( sp, ( _.indexOf(sp, 'views') +1 ) ), '/' );
  return {
    computedPath: computedPath,
    title: computedPath.split('/')[1],
  }
}
