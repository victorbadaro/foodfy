const routes = require('express').Router();

const ChefController = require('../app/controllers/ChefController');

routes.get('/', ChefController.index);

module.exports = routes;