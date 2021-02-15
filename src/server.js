const express = require('express');
const session = require('./config/session');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');
const routes = require('./routes');
const PORT = 3333;
const app = express();

app.use(session);
app.use((req, res, next) => {
    res.locals.session = req.session;
    return next();
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(routes);

app.set('view engine', 'njk');

nunjucks.configure('src/app/views', {
    express: app,
    autoescape: false,
    noCache: true
});

app.listen(PORT, function() {
    console.log(`Listening at port: ${PORT}`);
});