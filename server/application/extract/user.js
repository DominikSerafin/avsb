/*------------------------------------*\
  Imports
\*------------------------------------*/
const config        = require('../config/base.js');
const models        = require('../models');



/*------------------------------------*\
  User
  - Return properties are in snake case
  - Private variables are in camelCase
\*------------------------------------*/
module.exports = async function(req, user){

  // copy
  user = JSON.parse(JSON.stringify(user));

  // votes
  var userVotesCount = await models.Vote.count({where: {user_id: user.id}});
  user.votes_count = userVotesCount;

  // comparisons
  var allComparisonsCount = await models.Comparison.count();
  var userComparisonsCount = await models.Comparison.count({where: {user_id: user.id}});
  user.comparisons_count = userComparisonsCount;

  // available comparisons to add
  // if there are less than 10 comparisons globally
  if (allComparisonsCount<=10) {
    user.available_comparisons = 1;
  }

  // available comparisons to add
  // if there are more than 10 comparisons globally
  else {
    user.available_comparisons = Math.floor( userVotesCount/10 - userComparisonsCount );
  }

  // calculation of votes remaining until next comparison
  // it's very naive - it just subtracts the last digit of user votes from 10
  var lastDigit = parseInt( userVotesCount.toString().split('').pop() );
  user.next_comparison_votes_remaining = 10 - lastDigit;

  // user voted on everything
  user.voted_on_everything = allComparisonsCount === userVotesCount;

  // testing...
  //if (config.env==='development') {
  //  user.available_comparisons = 123;
  //}

  // return
  return user;

};
