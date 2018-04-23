const AccountModel = require('../models/Account.js').AccountModel;

const requiresLogin = (req, res, next) => {
  if (!req.session.account) {
    return res.redirect('/');
  }
  return next();
};

const requiresLogout = (req, res, next) => {
  if (req.session.account) {
    return res.redirect('/maker');
  }
  return next();
};

const requiresSecure = (req, res, next) => {
  if (req.headers['x-forwarded-proto'] !== 'https') {
    return res.redirect(`https://${req.hostname}${req.url}`);
  }
  return next();
};

const bypassSecure = (req, res, next) => {
  next();
};

const getAccountId = (req, res, next) => {
  const username = req.url.substr(1); // Remove the leading slash
  AccountModel.findByUsername(username, (err, doc) => {
    if(doc) {
      const acc = AccountModel.toAPI(doc);
      req.accountId = acc._id;
      next();
    }
    else {
      return res.status(404).redirect('/404');
    }
  });
}

module.exports.requiresLogin = requiresLogin;
module.exports.requiresLogout = requiresLogout;
module.exports.getAccountId = getAccountId;

if (process.env.NODE_ENV === 'production') {
  module.exports.requiresSecure = requiresSecure;
} else {
  module.exports.requiresSecure = bypassSecure;
}
