const routes = require('express').Router();

const RecipeController = require('../app/controllers/admin/RecipeController');
const ChefController = require('../app/controllers/admin/ChefController');
const ProfileController = require('../app/controllers/ProfileController');
const UserController = require('../app/controllers/UserController');

const RecipeValidator = require('../app/validators/recipes');
const ChefValidator = require('../app/validators/chefs');
const ProfileValidator = require('../app/validators/profiles');
const UserValidator = require('../app/validators/users');

const multer = require('../app/middlewares/multer');

const { onlyAdmins } = require('../app/middlewares/session');

routes.get('/', function(req, res) {
    return res.redirect('admin/recipes');
})

routes.get('/recipes', RecipeController.index);
routes.post('/recipes', multer.array('files', 5), RecipeValidator.post, RecipeController.post);
routes.put('/recipes', multer.array('files', 5), RecipeValidator.update, RecipeController.update);
routes.delete('/recipes', RecipeValidator.delete, RecipeController.delete);
routes.get('/recipes/create', RecipeController.create);
routes.get('/recipes/:id', RecipeController.show);
routes.get('/recipes/:id/edit', RecipeValidator.edit, RecipeController.edit);

routes.get('/chefs', ChefController.index);
routes.post('/chefs', ChefValidator.post, ChefController.post);
routes.put('/chefs', ChefValidator.update, ChefController.update);
routes.delete('/chefs', ChefValidator.delete, ChefController.delete);
routes.get('/chefs/create', onlyAdmins, ChefController.create);
routes.get('/chefs/:id', ChefController.show);
routes.get('/chefs/:id/edit', onlyAdmins, ChefController.edit);

// Rotas de perfil de um usuário logado
routes.get('/profile', ProfileController.index); // Mostrar o formulário com dados do usuário logado
routes.put('/profile', ProfileValidator.update, ProfileController.update); // Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users', onlyAdmins, UserController.index); //Mostrar a lista de usuários cadastrados
routes.post('/users', UserValidator.post, UserController.post); //Cadastrar um usuário
routes.put('/users', UserValidator.update, UserController.update); // Editar um usuário
routes.delete('/users', UserValidator.delete, UserController.delete); // Deletar um usuário
routes.get('/users/create', onlyAdmins, UserController.create);
routes.get('/users/:id', onlyAdmins, UserValidator.show, UserController.show);

module.exports = routes;