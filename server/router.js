const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.delete('/deleteProject', mid.requiresSecure, mid.requiresLogin, controllers.Project.deleteProject);
  app.get('/getProjects', controllers.Project.getProjects);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.post('/addProject', mid.requiresLogin, controllers.Project.addProject);
  app.post('/updatePrject', mid.requiresLogin, controllers.Project.updateProject);
  app.get('/404', (req, res) => res.render('404'));
  app.get(/\/.*\S.*/, mid.requiresSecure, mid.getAccountId, controllers.Project.portfolioPage);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
