const routes = require('express').Router();

const RecipeController = require('../app/controllers/RecipeController');

routes.get('/', RecipeController.index);
routes.get('/:id', RecipeController.show);

module.exports = routes;