/*------------------------------------*\
  Imports
\*------------------------------------*/
const config         = require('./config/base.js');

const express        = require('express');
const helmet         = require('helmet');

const middleware     = require('./middleware');
const views          = require('./views');



/*------------------------------------*\
  Initialize
\*------------------------------------*/
const app = express();
const env = app.settings.env;

// check db connection
/*
models.sequelize.authenticate().then(() => {
  console.log('Connection has been established successfully.');
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});
*/



/*------------------------------------*\
  Middleware
\*------------------------------------*/

// helmet protection
app.use(helmet());

// cors/iframe protection
app.use(middleware.cors);

// media serve (in production use nginx)
if (env==='development') {
  app.use('/media', express.static(config.media_dir));
}



/*------------------------------------*\
  Start
\*------------------------------------*/
app.listen(config.port, function(){
  console.log('AvsB listening on port '+config.port+'!');
});



/*------------------------------------*\
  Routes
  (Add user middleware only
   on specific routes to not
   spam database with users)
\*------------------------------------*/
app.get(  '/',                                    views.home);
app.get(  '/robots.txt',                          views.robots);
app.get(  '/favicon.ico',                         views.favicon);
app.get(  '/comparison/queue',  middleware.user,  views.comparisonQueue);
app.get(  '/comparison/list',   middleware.user,  views.comparisonList);
app.post( '/comparison/new',    middleware.user,  views.comparisonNew);
app.get(  '/user',              middleware.user,  views.user);
app.post( '/:slug/vote/:aorb',  middleware.user,  views.comparisonVote);
app.get(  '/:slug',             middleware.user,  views.comparison);
