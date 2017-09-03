/*------------------------------------*\
  Imports
\*------------------------------------*/
const config        = require('../config/base.js');

const util          = require('util');
const fs            = require('fs');
const path          = require('path');
const crypto        = require('crypto');
const Jimp          = require('jimp');
const mmm           = require('mmmagic');



/*------------------------------------*\
  Generate File Name
\*------------------------------------*/
function generateFilePath(originalFilePath, prefix){

  var epochSeconds = (new Date).getTime();

  var extension = path.parse(originalFilePath).ext;

  var finalPrefix =  prefix ? prefix : 'image';

  var fileName = `${prefix}-${epochSeconds}${extension}`;
  var filePath = path.join(config.media_dir, fileName);

  // fail-safe if both of the comparison images are processed in the same millisecond (very unlikely)
  if (fs.existsSync(filePath)) {
    var id = crypto.randomBytes(4).toString('hex');
    fileName = `${finalPrefix}-${epochSeconds}-${id}${extension}`;
    filePath = path.join(config.media_dir, fileName);
  }

  return filePath;
}



/*------------------------------------*\
  Save Image / Useful: https://github.com/pillarjs/multiparty/issues/141
  TODO: allow animated gifs/webp
\*------------------------------------*/
module.exports.saveImage = function(params){
  params = params || {};
  return new Promise(async function(resolve, reject){

    try {

      // paths
      var newFilePath = generateFilePath(params.file.path, params.prefix);
      var tempFilePath = params.file.path;

      // jimp read
      var image = await Jimp.read(tempFilePath);

      // check if the image is too big
      var widthOrHeightTooBig = (image.bitmap.width > 1500) || (image.bitmap.height > 1500);

      // process with bicubic mode because it looks the best when making image smaller
      if (widthOrHeightTooBig) {
        image.scaleToFit(1500, 1500, Jimp.RESIZE_BICUBIC);
      }

      // write new image
      await image.write(newFilePath);

      // remove temp file
      fs.unlinkSync(tempFilePath);

      // resolve after success
      resolve({
        path: newFilePath,
        part: path.parse(newFilePath),
      });

    } catch (err) {
      console.error(err);
      reject(err);
    }

  });
}



/*------------------------------------*\
  Image Content Type Check
  - Magic library used to get real content type
\*------------------------------------*/
module.exports.contentTypeIsImage = function(params){
  params = params || {};
  return new Promise(function(resolve, reject){

    try {

      var goodContentTypes = [
        'image/jpeg', 'image/png', 'image/gif', /*'image/bmp',*/ 'image/webp', /*'image/svg+xml','image/ico' ,*/
      ]

      var magic = new mmm.Magic(mmm.MAGIC_MIME_TYPE);

      magic.detectFile(params.file.path, function(err, contentType) {

        if (err) {
          console.error(err);
          return reject(err);
        }

        resolve(goodContentTypes.indexOf(contentType.toLowerCase()) > -1);

      });

    } catch (err) {
      console.error(err);
      reject(err);
    }

  });
}
