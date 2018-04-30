const models = require('../models');
const Project = models.Project;
const ImageStore = models.ImageStore;

const portfolioPage = (req, res) => {
  Project.ProjectModel.findByOwner(req.accountId, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'RAWR RAWR!!!!! AN ERROR!!!!!!!!' });
    }
    let id;
    if (req.session.account) { id = req.session.account._id.toString('hex'); }
    const isOwner = req.session.account && id === req.accountId;
    return res.render('app', {
      csrfToken: req.csrfToken(),
      projects: docs,
      owner: req.accountId,
      ownerName: req.accountName,
      isOwner,
    });
  });
};

const addProject = (req, res) => {
  if (!req.body.name
    || !req.body.description
    || !req.body.link
    || !req.files
    || !req.files.image) {
    return res.status(400).json({ error: 'Must have name, image, description, and link' });
  }

  return ImageStore.submitImage(req.files.image.data).then(({ image, imageId }) => {
    const domoData = {
      name: req.body.name,
      description: req.body.description,
      link: req.body.link,
      image,
      imageId,
      owner: req.session.account._id,
    };

    // const newDomo = new Project.ProjectModel(domoData);
    return Project.ProjectModel.findOneAndUpdate(
      {
        name: domoData.name,
      },
      domoData,
      {
        upsert: true,
      }
    ).lean().exec()
    .then((docs) => {
      if (docs && docs.length > 0) {
        return ImageStore.removeImage(docs[0].imageId);
      }
      return Promise.resolve();
    })
    .then(() => {
      res.status(200).json({});
    })
    .catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        res.status(400).json({ error: 'RAWR!!! AN ERROR OCCURRED!!' });
      }
      res.status(400).json({ error: 'RAAAAAAAWWR AN ERRORRRRRRRR!!!!' });
      return ImageStore.removeImage(domoData.image);
    })
    .catch((err) => {
      console.log(err);
    });
  });
};

const getProjects = (request, response) => {
  const req = request;
  const res = response;

  if (!req.query.owner) { return res.status(400).json({ error: 'Must provide an owner ID' }); }

  return Project.ProjectModel.findByOwner(req.query.owner, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    const projects = docs.map((doc) => Project.ProjectModel.toAPI(doc));

    return res.json({ projects });
  });
};

const deleteProject = (request, response) => {
  const req = request;
  const res = response;

  const name = req.query.name;

  if (!name) {
    return res.status(400).json({ error: 'You must provide the name of the project to delete' });
  }

  return Project.ProjectModel.removeByOwnerAndName(req.session.account._id, name).then(() => {
    res.status(204).end();
  }).catch((err) => {
    console.log(err);
    return res.status(500).json({ error: 'Error deleting domo domo' });
  });
};

module.exports.portfolioPage = portfolioPage;
module.exports.getProjects = getProjects;
module.exports.deleteProject = deleteProject;
module.exports.updateProject = addProject;
module.exports.addProject = addProject;
