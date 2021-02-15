const routes = require('express').Router();
const multer = require('../../app/middlewares/multer');

const RecipeController = require('../../app/controllers/RecipeController');
const RecipeValidator = require('../../app/validators/RecipeValidator');

routes.get('/', RecipeController.adminIndex);
routes.post('/', multer.array('files', 5), RecipeValidator.post, RecipeController.post);
routes.put('/', multer.array('files', 5), RecipeValidator.update, RecipeController.update);
routes.delete('/', RecipeValidator.delete, RecipeController.delete);
routes.get('/create', RecipeController.create);
routes.get('/:id', RecipeController.adminShow);
routes.get('/:id/edit', RecipeValidator.edit, RecipeController.edit);

module.exports = routes;