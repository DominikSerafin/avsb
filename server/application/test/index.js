/*------------------------------------*\
  Imports
\*------------------------------------*/
const config        = require('../config/base.js');

const assert        = require('assert');



/*------------------------------------*\
  Hello World
\*------------------------------------*/
describe('Test', () => {
  it('Initializes', () => {
    assert(true);
  });
});



/*------------------------------------*\
  Config
\*------------------------------------*/
describe('Config', () => {

  it('Contains "env"', () => assert(typeof config.env !== 'undefined'));

  if (config.env) {
    it('"env" is either "production" or "development"', () => {
      assert(config.env === 'production' || config.env === 'development');
    });
  }

  it('Contains "port"', () => assert(typeof config.port !== 'undefined'));
  it('Contains "media_url"', () => assert(typeof config.media_url !== 'undefined'));
  it('Contains "api_url"', () => assert(typeof config.api_url !== 'undefined'));
  it('Contains "client_url"', () => assert(typeof config.client_url !== 'undefined'));
  it('Contains "database_file"', () => assert(typeof config.database_file !== 'undefined'));
  it('Contains "temp_dir"', () => assert(typeof config.temp_dir !== 'undefined'));
  it('Contains "media_dir"', () => assert(typeof config.media_dir !== 'undefined'));

});
