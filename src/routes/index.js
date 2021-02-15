const routes = require('express').Router();

const admin = require('./admin/index');
const session = require('./session');
const recipes = require('./recipes');
const chefs = require('./chefs');

const MainController = require('../app/controllers/MainController');
const { onlyUsers } = require('../app/middlewares/session');

routes.get('/', (req, res) => res.redirect('/home'));

routes.get('/home', MainController.index);
routes.get('/about', MainController.about);

routes.use('/', session);
routes.use('/admin', onlyUsers, admin);
routes.use('/recipes', recipes);
routes.use('/chefs', chefs);

routes.use((req, res) => res.status(404).render('public/not-found'));

module.exports = routes;