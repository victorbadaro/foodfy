const routes = require('express').Router();

const ProfileController = require('../../app/controllers/ProfileController');
const ProfileValidator = require('../../app/validators/ProfileValidator');

routes.get('/', ProfileController.index);
routes.put('/', ProfileValidator.update, ProfileController.update);

module.exports = routes;