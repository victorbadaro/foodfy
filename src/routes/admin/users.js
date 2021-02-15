const routes = require('express').Router();

const UserController = require('../../app/controllers/UserController');
const UserValidator = require('../../app/validators/UserValidator');

const { onlyAdmins } = require('../../app/middlewares/session');

routes.get('/', onlyAdmins, UserController.index);
routes.post('/', UserValidator.post, UserController.post);
routes.put('/', UserValidator.update, UserController.update);
routes.delete('/', UserValidator.delete, UserController.delete);
routes.get('/create', onlyAdmins, UserController.create);
routes.get('/:id', onlyAdmins, UserValidator.show, UserController.show);

module.exports = routes;