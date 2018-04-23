const models = require('../models');
const Project = models.Project;

const portfolioPage = (req, res) => {
  Project.ProjectModel.findByOwner(req.accountId, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'RAWR RAWR!!!!! AN ERROR!!!!!!!!' });
    }
    let id;
    if(req.session.account)
      id = req.session.account._id.toString('hex');
    const isOwner = req.session.account && id == req.accountId;
    return res.render('app', { 
      csrfToken: req.csrfToken(), 
      projects: docs, 
      owner: req.accountId, 
      isOwner: isOwner 
    });
  });
};

const addProject = (req, res) => {
  if (!req.body.name || !req.body.description || !req.body.link) {
    return res.status(400).json({ error: 'Must have name, description, and link' });
  }

  const domoData = {
    name: req.body.name,
    description: req.body.description,
    link: req.body.link,
    owner: req.session.account._id,
  };

  const newDomo = new Project.ProjectModel(domoData);
  const domoPromise = newDomo.save();
  domoPromise.then(() => res.status(200).json({}));
  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'RAWR!!! AN ERROR OCCURRED!!' });
    }
    return res.status(400).json({ error: 'RAAAAAAAWWR AN ERRORRRRRRRR!!!!' });
  });
  return domoPromise;
};

const getProjects = (request, response) => {
  const req = request;
  const res = response;

  if(!req.query.owner)
    return res.status(400).json({error: 'Must provide an owner ID'});

  return Project.ProjectModel.findByOwner(req.query.owner, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ projects: docs });
  });
};

const deleteProject = (request, response) => {
  const req = request;
  const res = response;

  const name = req.query.name;

  if(!name) {
    return res.status(400).json({ error: "You must provide the name of the project to delete" });
  }

  return Project.ProjectModel.removeByOwnerAndName(req.session.account._id, name, (err) => {
    if(err) {
      console.log(err);
      return res.status(500).json({ error: "Error deleting domo domo" });
    }
    return res.status(204).end();
  });
};

module.exports.portfolioPage = portfolioPage;
module.exports.getProjects = getProjects;
module.exports.deleteProject = deleteProject;
module.exports.updateProject = addProject;
module.exports.addProject = addProject;
