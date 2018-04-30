const models = require('../models');
const Account = models.Account;
const loginPage = (req, res) => {
  res.render('login', { csrfToken: req.csrfToken() });
};
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};
const login = (request, response) => {
  const req = request;
  const res = response;

  const username = `${req.body.username}`;
  const password = `${req.body.pass}`;

  if (!username || !password) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  return Account.AccountModel.authenticate(username, password, (err, account) => {
    if (err || !account) {
      return res.status(400).json({ error: 'RAWR! WRONG USER NAME OR PASSWORD!' });
    }

    req.session.account = Account.AccountModel.toAPI(account);
    return res.json({ redirect: `/${username}` });
  });
};
const signup = (request, response) => {
  const req = request;
  const res = response;

  if (!req.body.username || !req.body.pass || !req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! All fields are required' });
  }

  req.body.username = `${req.body.username}`;
  req.body.pass = `${req.body.pass}`;
  req.body.pass2 = `${req.body.pass2}`;

  if (req.body.pass !== req.body.pass2) {
    return res.status(400).json({ error: 'RAWR! Passwords do not match' });
  }

  return Account.AccountModel.generateHash(req.body.pass, (salt, hash) => {
    const accountData = {
      username: req.body.username,
      salt,
      password: hash,
    };
    const newAccount = new Account.AccountModel(accountData);
    const savePromise = newAccount.save();
    savePromise.then(() => {
      req.session.account = Account.AccountModel.toAPI(newAccount);
      res.json({ redirect: `/${req.body.username}` });
    });
    savePromise.catch((err) => {
      console.log(err);
      if (err.code === 11000) {
        return res.status(400).json({ error: 'Username already in use' });
      }
      return res.status(500).json({ error: 'An error occurred' });
    });
  });
};

const changePassword = (request, response) => {
  const req = request;
  const res = response;

  if(!req.body.pass || !req.body.newPass || !req.body.newPass2)
    return res.status(400).json({error: "All fields are required"});

  req.body.pass = `${req.body.pass}`;
  req.body.newPass = `${req.body.newPass}`;
  req.body.newPass2 = `${req.body.newPass2}`;

  if(req.body.newPass !== req.body.newPass2)
    return res.status(400).json({error:"Passwords do not match"});

  Account.AccountModel.authenticate(req.session.account.username, req.body.pass, (err, account) => {
    if(err) {
      console.log(err);
      return res.status(400).json({ error: "Incorrect password" });
    }
    Account.AccountModel.generateHash(req.body.newPass, (salt, hash) => {
      account.salt = salt;
      account.password = hash;
      account.save().then(() => {
        res.json({ redirect: `/logout`});
      }).catch((err) => {
        console.log(err);
        res.status(500).json({ error: "An error occurred" });
      });
    });

  })
};

const getToken = (request, response) => {
  const req = request;
  const res = response;

  const csrfJSON = {
    csrfToken: req.csrfToken(),
  };

  res.json(csrfJSON);
};

module.exports.loginPage = loginPage;
module.exports.login = login;
module.exports.logout = logout;
module.exports.signup = signup;
module.exports.changePassword = changePassword;
module.exports.getToken = getToken;
