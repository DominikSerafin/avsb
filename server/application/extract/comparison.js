/*------------------------------------*\
  Imports
\*------------------------------------*/
const config        = require('../config/base.js');
const models        = require('../models');



/*------------------------------------*\
  Comparison
  - Return properties are in snake_case
  - Private variables are in camelCase
\*------------------------------------*/
module.exports = async function(req, comparison){

  // copy
  comparison = JSON.parse(JSON.stringify(comparison));

  // url
  comparison.url = `${config.client_url}/${comparison.slug}`;

  // votes
  var aVotes = await models.Vote.count({where: {comparison_id: comparison.id, value: 'a'}});
  var bVotes = await models.Vote.count({where: {comparison_id: comparison.id, value: 'b'}});
  comparison.a_votes = aVotes;
  comparison.b_votes = bVotes;

  // percentage
  var all = aVotes + bVotes;
  if (aVotes) {
    comparison.a_votes_percentage = parseFloat(( aVotes / all * 100 ).toFixed(1));
  } else {
    comparison.a_votes_percentage = 0;
  }
  if (bVotes) {
    comparison.b_votes_percentage = parseFloat(( bVotes / all * 100 ).toFixed(1));
  } else {
    comparison.b_votes_percentage = 0;
  }

  // check if user already voted
  const userVotes = await models.Vote.findAll({where: {comparison_id: comparison.id, user_id: req.user.id}});
  if (userVotes.length) {
    comparison.user_vote = userVotes[0];
  }

  // return
  return comparison;

};
