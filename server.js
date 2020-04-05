const express = require('express')
const nunjucks = require('nunjucks')
const methodOverride = require('method-override')
const routes = require('./routes')
const app = express()

app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)

app.set('view engine', 'html')

nunjucks.configure('views', {
    express: app,
    autoescape: false,
    noCache: true
})

app.listen(3000, function() {
    console.log('Server is running:\nPort number: 3000') 
})