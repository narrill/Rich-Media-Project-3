const models = require('../models');
const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'RAWR RAWR!!!!! AN ERROR!!!!!!!!' });
    }
    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};

const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.contents) {
    return res.status(400).json({ error: 'Must have name and contents' });
  }

  const domoData = {
    name: req.body.name,
    contents: req.body.contents,
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);
  const domoPromise = newDomo.save();
  domoPromise.then(() => res.json({ redirect: '/maker' }));
  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'RAWR!!! AN ERROR OCCURRED!!' });
    }
    return res.status(400).json({ error: 'RAAAAAAAWWR AN ERRORRRRRRRR!!!!' });
  });
  return domoPromise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ domos: docs });
  });
};

const deleteDomo = (request, response) => {
  const req = request;
  const res = response;

  const name = req.query.name;

  if(!name) {
    return res.status(400).json({ error: "You must provide the name of the domo to delete" });
  }

  return Domo.DomoModel.removeByOwnerAndName(req.session.account._id, name, (err) => {
    if(err) {
      console.log(err);
      return res.status(500).json({ error: "Error deleting domo domo" });
    }
    return res.status(204).end();
  });
};

module.exports.makerPage = makerPage;
module.exports.getDomos = getDomos;
module.exports.deleteDomo = deleteDomo;
module.exports.make = makeDomo;
