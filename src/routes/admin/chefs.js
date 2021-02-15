const routes = require('express').Router();

const ChefController = require('../../app/controllers/ChefController');
const ChefValidator = require('../../app/validators/ChefValidator');

const { onlyAdmins } = require('../../app/middlewares/session');

routes.get('/', ChefController.adminIndex);
routes.post('/', ChefValidator.post, ChefController.post);
routes.put('/', ChefValidator.update, ChefController.update);
routes.delete('/', ChefValidator.delete, ChefController.delete);
routes.get('/create', onlyAdmins, ChefController.create);
routes.get('/:id', ChefController.show);
routes.get('/:id/edit', onlyAdmins, ChefController.edit);

module.exports = routes;