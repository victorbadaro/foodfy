const routes = require('express').Router();

const SessionController = require('../app/controllers/SessionController');
const SessionValidator = require('../app/validators/session');

routes.get('/login', SessionController.loginForm);
routes.post('/login', SessionValidator.login, SessionController.login);

routes.post('/logout', SessionController.logout);

routes.get('/forgot-password', SessionController.forgotForm);
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot);

routes.get('/reset-password', SessionController.resetForm);
routes.post('/reset-password', SessionValidator.reset, SessionController.reset);

module.exports = routes;