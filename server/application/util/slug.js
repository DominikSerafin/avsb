/*------------------------------------*\
  Imports
\*------------------------------------*/
const config        = require('../config/base.js');

const Moniker       = require('moniker');

const models        = require('../models');



/*------------------------------------*\
  Generate Slug
  - regenerate if it already exists
\*------------------------------------*/
async function generate(){

  var names = Moniker.generator([Moniker.adjective, Moniker.noun, Moniker.verb]);
  var slug = names.choose();

  // debug
  /*
  var slugs = [
    'some-unique',
    'some-unique2',
    'somber-rabbits-hold',
    'some-unique3',
  ];
  var slug = slugs[Math.floor(Math.random() * slugs.length )]
  */

  const comparison = await models.Comparison.findOne({where: {slug: slug}});

  if (comparison) {
    return generate();
  }

  return slug;

}



/*------------------------------------*\
  Export
\*------------------------------------*/
module.exports.generate = generate;
