const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let ProjectModel = {};

const convertId = mongoose.Types.ObjectId;
const setEscaped = (name) => _.escape(name).trim();

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
});

ProjectSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };
  return ProjectModel.find(search).select('name description link').exec(callback);
};

ProjectSchema.statics.removeByOwnerAndName = (ownerId, name, callback) => {
  const search = {
    owner: convertId(ownerId),
    name: name
  };
  return ProjectModel.find(search).remove(callback);
}

ProjectModel = mongoose.model('Project', ProjectSchema);

module.exports.ProjectModel = ProjectModel;
module.exports.ProjectSchema = ProjectSchema;
