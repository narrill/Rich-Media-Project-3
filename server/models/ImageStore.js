const cloudinary = require('cloudinary');

const submitImage = (data) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream((result, err) => {
      if(err)
        reject(err);
      else
        resolve({
          image: result.url,
          imageId: result.public_id
        });
    }, {resource_type: 'raw'}).end(data);
  });
}

const removeImage = (id) => {
  return cloudinary.uploader.destroy(id);
};

module.exports.submitImage = submitImage;
module.exports.removeImage = removeImage;