/*------------------------------------*\
  Imports
\*------------------------------------*/
const config        = require('../config/base.js');

const Sequelize     = require('sequelize');



/*------------------------------------*\
  Sequelize
\*------------------------------------*/
const sequelize = new Sequelize(null, null, null, {
  dialect: 'sqlite',
  storage: config.database_file,
  logging: false,
  /*
  host: 'localhost',
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  */
});



/*------------------------------------*\
  User Model
\*------------------------------------*/
const User = sequelize.define('user', {

  ip: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isIP: true,
    },
  },

}, { underscored: true });



/*------------------------------------*\
  Comparison Model
\*------------------------------------*/
const Comparison = sequelize.define('comparison', {

  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  slug: {
    type: Sequelize.STRING,
    unique: true,
    validate: {
      is: /((?:\w+-)+\w+)/gi, // alphanumeric, hyphens, underscores
    },
  },

  title: {
    type: Sequelize.TEXT,
  },

  a_image: {
    type: Sequelize.STRING,
    allowNull: false,
    get() {
      return `${config.api_url}${config.media_url}${this.getDataValue('a_image')}`;
    },
  },

  a_description: {
    type: Sequelize.TEXT,
  },

  b_image: {
    type: Sequelize.STRING,
    allowNull: false,
    get() {
      return `${config.api_url}${config.media_url}${this.getDataValue('b_image')}`;
    },
  },

  b_description: {
    type: Sequelize.TEXT,
  },

}, { underscored: true });



/*------------------------------------*\
  Vote Model
\*------------------------------------*/
const Vote = sequelize.define('vote', {

  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  comparison_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },

  value: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      isAlpha: true,
      isIn: [['a', 'b']],
    },
  },

}, { underscored: true });



/*------------------------------------*\
  Associations
\*------------------------------------*/

User.hasMany(Comparison, {foreignKey: 'user_id'});
Comparison.belongsTo(User, {foreignKey: 'user_id'});

User.hasMany(Vote, {foreignKey: 'user_id'});
Vote.belongsTo(Comparison, {foreignKey: 'user_id'});

Comparison.hasMany(Vote, {foreignKey: 'comparison_id'});
Vote.belongsTo(Comparison, {foreignKey: 'comparison_id'});



/*------------------------------------*\
  Synchronize
\*------------------------------------*/
User.sync({force: false});
Comparison.sync({force: false});
Vote.sync({force: false});



/*------------------------------------*\
  Export
\*------------------------------------*/
module.exports = {

  Sequelize: Sequelize,
  sequelize: sequelize,

  User: User,
  Comparison: Comparison,
  Vote: Vote,

};
