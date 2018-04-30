const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');
const ImageStore = require('./ImageStore.js');

let ProjectModel = {};

const convertId = mongoose.Types.ObjectId;
const setEscaped = (name) => _.escape(name).trim();

const HeaderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setEscaped
  },
  description: {
    type: String,
    required: true,
    trim: true,
    set: setEscaped
  }
});

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setEscaped,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    set: setEscaped
  },
  link: {
    type: String,
    required: true,
    trim: true,
    set: setEscaped
  },
  image: {
    type: String,
    required: true,
    set: setEscaped
  },
  imageId: {
    type: String,
    required: true,
    set: setEscaped
  },
  headers: [HeaderSchema],
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

ProjectSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  description: doc.description,
  link: doc.link,
  image: doc.image
});

ProjectSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  return ProjectModel.find(search).exec(callback);
};

ProjectSchema.statics.removeByOwnerAndName = (ownerId, name) => {
  const search = {
    owner: convertId(ownerId),
    name: name
  };
  return ProjectModel.find(search).then((docs) => {
    return ImageStore.removeImage(docs[0].imageId).then(() => {
      return docs[0].remove();
    });
  });
}

ProjectModel = mongoose.model('Project', ProjectSchema);

module.exports.ProjectModel = ProjectModel;
module.exports.ProjectSchema = ProjectSchema;
