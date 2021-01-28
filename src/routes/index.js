const routes = require('express').Router()

const publicRecipes = require('../app/controllers/public/recipes')
const publicChefs = require('../app/controllers/public/chefs')
const SessionController = require('../app/controllers/SessionController')
const SessionValidator = require('../app/validators/session')

const HomeController = require('../app/controllers/HomeController')

const { onlyUsers } = require('../app/middlewares/session')

const admin = require('./admin')

//* === PUBLIC ROUTES [RECIPES and CHEFS] === *//
routes.get('/', function(req, res) {
    return res.redirect('/home')
})
// routes.get('/home', publicRecipes.index)
routes.get('/home', HomeController.index)
routes.get('/about', publicRecipes.about)

// PUBLIC [RECIPES]
routes.get('/recipes', publicRecipes.index)
routes.get('/recipes/:id', publicRecipes.show)

// PUBLIC [CHEFS]
routes.get('/chefs', publicChefs.index)

routes.use('/admin', onlyUsers, admin)

routes.get('/login', SessionController.loginForm)
routes.post('/login', SessionValidator.login, SessionController.login)

routes.post('/logout', SessionController.logout)

routes.get('/forgot-password', SessionController.forgotForm)
routes.post('/forgot-password', SessionValidator.forgot, SessionController.forgot)

routes.get('/reset-password', SessionController.resetForm)
routes.post('/reset-password', SessionValidator.reset, SessionController.reset)

routes.use((req, res) => {
    return res.render('public/not-found')
})

module.exports = routes