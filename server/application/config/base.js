/*------------------------------------*\
  Imports
\*------------------------------------*/
const path = require('path');



/*------------------------------------*\
  Config
\*------------------------------------*/
const base = {
  env: process.env.NODE_ENV || 'development',
  port: 9550,
  resources_dir: path.join(__dirname, '../../../resources/'),
  media_url: '/media/',
}

const development = {
  ...base,
  api_url: 'http://localhost:9550',
  client_url: 'http://localhost',
  database_file: path.join(__dirname, '../../database/dev6.sqlite'),
  temp_dir: path.join(__dirname, '../../temp/'),
  media_dir: path.join(__dirname, '../../media/'),
}

const production = {
  ...base,
  api_url: 'https://avsb.serafin.io/api',
  client_url: 'https://avsb.serafin.io',
  database_file: path.join(__dirname, '../../database/production5.sqlite'),
  temp_dir: path.join(__dirname, '../../temp/'),
  media_dir: path.join(__dirname, '../../media/'),
}

module.exports = base.env === 'development' ? development : production;
