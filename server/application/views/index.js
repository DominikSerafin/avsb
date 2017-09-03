/*------------------------------------*\
  Imports
\*------------------------------------*/
const config        = require('../config/base.js');

const path          = require('path');
const multiparty    = require('multiparty');

const utilmedia     = require('../util/media.js');
const utilslug      = require('../util/slug.js');

const extract       = require('../extract');
const models        = require('../models');



/*------------------------------------*\
  Home
\*------------------------------------*/
module.exports.home = function(req, res){
  return res.send(`<h1>Whazzzup World!</h1>`);
}



/*------------------------------------*\
  Comparison New
\*------------------------------------*/
module.exports.comparisonNew = function(req, res){

  var form = new multiparty.Form({
    uploadDir: config.temp_dir,
  });

  return form.parse(req, async function(err, fields, files) {

    // form parse error
    if (err) {
      console.error(err);
      return res.status(500).json({'error': 'FORM_PARSE_ERROR'});
    }

    // setup validation errors array
    var validationErrors = [];

    // check if user can add comparison
    var user = await extract.user(req, req.user);
    if (user.available_comparisons < 1) {
      validationErrors.push({error: 'USER_COMPARISON_LIMIT_EXCEEDED'});
    }

    // check if field exists
    files.a_image ? null : validationErrors.push({error: 'NO_FILE', field: 'a_image'});
    files.b_image ? null : validationErrors.push({error: 'NO_FILE', field: 'b_image'});

    // check if files exist and their content types
    if (files.a_image) {
      var aImageIsImage = await utilmedia.contentTypeIsImage({file: files.a_image[0]});
      if (!aImageIsImage) {
        validationErrors.push({error: 'BAD_CONTENT_TYPE', field: 'a_image'});
      }
    }
    if (files.b_image) {
      var bImageIsImage = await utilmedia.contentTypeIsImage({file: files.b_image[0]});
      if (!bImageIsImage) {
        validationErrors.push({error: 'BAD_CONTENT_TYPE', field: 'b_image'});
      }
    }

    // throw error
    if (validationErrors.length) {
      return res.status(400).json(validationErrors);
    }

    // we can start processing the form...
    try {
      var aImageProcessed = await utilmedia.saveImage({file: files.a_image[0], prefix: 'comparison'});
      var bImageProcessed = await utilmedia.saveImage({file: files.b_image[0], prefix: 'comparison'});
    } catch (err) {
      return res.status(500).json({error: 'COULDNT_PROCESS_IMAGES'});
    }

    // generate unique slug
    var slug = await utilslug.generate();

    try {

      var comparison = await models.Comparison.create({
        user_id: req.user.id,
        slug: slug,
        title: fields.title[0],
        added_from_ip: req.user.ipv4,
        a_image: aImageProcessed.part.name + aImageProcessed.part.ext,
        a_description: fields.a_description[0],
        b_image: bImageProcessed.part.name + bImageProcessed.part.ext,
        b_description: fields.b_description[0],
      });

    } catch (err) {
      console.error(err);
      return res.status(400).json({error: 'COMPARISON_CREATE_FAILED'});
    }

    comparison = await extract.comparison(req, comparison);
    return res.json(comparison);

  });

}



/*------------------------------------*\
  Comparison List
\*------------------------------------*/
module.exports.comparisonList = async function(req, res){

  var output = [];

  try {
    var comparisons = await models.Comparison.findAll();
  } catch (err) {
    console.error(err);
    return;
  }

  for (comparison of comparisons) {
    var comparison = await extract.comparison(req, comparison);
    output.push(comparison);
  }

  return res.json(output);

}



/*------------------------------------*\
  Comparison List
\*------------------------------------*/
module.exports.comparisonQueue = async function(req, res){

  // TODO: do this through sequelize.js API
  var comparisonsWithoutUserVotes = `
    SELECT c.*
    FROM comparisons c
    WHERE NOT EXISTS (
      SELECT v.*
      FROM votes v
      WHERE v.comparison_id = c.id
      AND v.user_id = ${req.user.id}
    )
    ORDER BY RANDOM()
    LIMIT 1
  `;

  const comparisons = await models.sequelize.query(comparisonsWithoutUserVotes, {model: models.Comparison});
  return res.json(comparisons.length ? comparisons[0].slug : 0);

}



/*------------------------------------*\
  Comparison Single
\*------------------------------------*/
module.exports.comparison = async function(req, res){
  var slug = req.params.slug;
  var comparison = await models.Comparison.findOne({where: {slug: slug}});
  if (!comparison) {
    return res.status(404).json({'error': 'COMPARISON_NOT_FOUND'});
  }
  comparison = await extract.comparison(req, comparison);
  return res.json(comparison);
}



/*------------------------------------*\
  Comparison Vote
\*------------------------------------*/
module.exports.comparisonVote = async function(req, res){

  var slug = req.params.slug;
  var aorb = req.params.aorb;

  if (aorb!=='a' && aorb!=='b') {
    return res.status(400).json({'error': 'BAD_VOTE_PARAMETER'});
  }

  var comparison = await models.Comparison.findOne({where: {slug: slug}});

  var existingVote = await models.Vote.findOne({where: {
    user_id: req.user.id,
    comparison_id: comparison.id,
  }})

  if (existingVote) {
    return res.status(400).json({'error': 'ALREADY_VOTED'});
  }

  const vote = await models.Vote.create({
    user_id: req.user.id,
    comparison_id: comparison.id,
    value: aorb,
  });
  //await comparison.save();

  comparison = await extract.comparison(req, comparison);
  return res.json(comparison);

}



/*------------------------------------*\
  User
\*------------------------------------*/
module.exports.user = async function(req, res){
  var user = await extract.user(req, req.user);
  return res.json(user);
}



/*------------------------------------*\
  Robots
\*------------------------------------*/
module.exports.robots = async function(req, res){
  return res.sendFile(path.join(config.resources_dir, '/txt/robots.txt'));
}



/*------------------------------------*\
  Favicon
\*------------------------------------*/
module.exports.favicon = async function(req, res){

  /*
  var base64 = `AAABAAEAEBAQAAEABAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAA/4QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEREREAEREREREREQARERERERERABEREREREREAEREREREREQARERERERERABEREREREREAEREREREREQARERERERERABEREREREREAEREREREREQARERERERERABEREREREREAEREREREREQARERERERERABEREREREREAEREREBgAAAAYAAAAGAAAABgAAAAYAAAAGAAAABgAAAAYAAAAGAAAABgAAAAYAAAAGAAAABgAAAAYAAAAGAAAABgAAA`;
  */

  var base64 = `iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAGAUExURf///////////////////////////0xpcf///////////////////////////////////////////wAA//z8//7+//v7//39//r6/wEA/6Ki//j4/xMT/76+//n5/xQU/4OD/56e/2Ji/2Rk//T0/2Nj/9TU/2lp/83N//b2/9/f/wcG/8XF/w8O/6Cg//f3/97e/7e3/yMj/zQ0/+np/wYG/4yM/1xc//Dw/5yc/7Cw/7Ky/5GR/+zs/8DA/wkI/1VV/+jo/7+//2Fh/9fX/wQE/05O/5ub/zIy/729/19f/yQk/7i4/7S0/8jI/8fH/8HB/4KC/35+/8vL/6+v/8bG/+7u/2tr/9DQ/+vr/+Li/yYl/42N/zc3/+bm/zMz/xcX/zAw/5aW/3p6/6Gh/8zM/6en/6yr/9PT/xkZ/wUF/5+f/9HR/4CA/0xM/3V1/x8f/z8//3l5/52d/wEB/5KS/xgY/wMD/4SE/2pq/zU1/87O/xYV/11d/7y8//X1/wyeUisAAAASdFJOU/4Dk9v596MA/AECJiqRfPLYezp9TZYAAAAJcEhZcwAACxMAAAsTAQCanBgAAAG8SURBVDjLhZOHd9MwEMbVNqns7n6fJSc0C5J07wkUyt7Qyeguo4O9R6Gl/Ot4xIkLzfM9PevJ99PdSfpOSLNGNtbWxfCPxepqG2WNKYXZINvjEPjPBOLtssEUpqyHYZwEGAbqpSlkC2InuD0khhYpmlpRxe9maW0SzTBQ1Qw0i7bqAdwQbSIeLJRlBbNjdulvXJT3K2+UzfaRih+F+VntMlfS/XOPloatEh4AFnbJHdgap5mkY7c7YYcBG+/JD9Aa29yazL1Y470eL4YI/L1fDye+DyGBU8w73/Es07AqgMY3Tv7kCDoc4Aw6FJ7xfhgAxjh8xCkPKCIx9Jypx6EUNg74C4XUj3HgDftePZ3gwHK4SI3P3P9TKPILnFO8zqYGmHyiKxEUej66R0vyE7waMon+LG85+0qAhRGO5qd+F1N8i0G3yAwWeS0M3OWgewc5vnNS5KEtdLGrDChcvHRjE4kMXnLUSTG2nlu4meR0+Zga53jZXSlssHvPv+q+C/5j+BE6z/f6r3n94erKgztX0zPdZ3H8OdWxyS/M93uCsXVJILZWvmAsFQgmUnKRoo2UfWTjRLZeZPNGtf9fJ/ReVxSbj5sAAABXelRYdFJhdyBwcm9maWxlIHR5cGUgaXB0YwAAeJzj8gwIcVYoKMpPy8xJ5VIAAyMLLmMLEyMTS5MUAxMgRIA0w2QDI7NUIMvY1MjEzMQcxAfLgEigSi4A6hcRdPJCNZUAAAAASUVORK5CYII=`;

  var icon = new Buffer(base64, 'base64');
  res.writeHead(200, {
    'Content-Type': 'image/x-icon',
    'Content-Length': icon.length,
  });
  return res.end(icon);

}
