/*------------------------------------*\
  Imports
\*------------------------------------*/
const config        = require('../config/base.js');

const models        = require('../models');



/*------------------------------------*\
  CORS
\*------------------------------------*/
module.exports.cors = function(req, res, next){
  var url = 'http://localhost';
  res.header('Access-Control-Allow-Origin', url);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  //response.header('X-Frame-Options', 'ALLOW-FROM '+url);
  return next();
}



/*------------------------------------*\
  User
\*------------------------------------*/
module.exports.user = async function(req, res, next) {
  const env = config.env;

  // get real ip of visitor
  var reqIP = (
    req.headers['x-forwarded-for']
    || req.connection.remoteAddress
    //|| req.socket.remoteAddress
    //|| req.connection.socket.remoteAddress
  ).split(',')[0];
  var finalIP = reqIP;

  // mock ip for testing
  if (env==='development') {
    finalIP = '127.0.0.10';
  }

  // find or create user
  var user = await models.User.findOne({where: {ip: finalIP}});
  if (!user) {
    user = await models.User.create({ip: finalIP});
  }

  // assign to request and response
  req.user = user;
  res.locals.user = user;

  return next();

}
