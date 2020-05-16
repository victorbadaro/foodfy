const Chef = require('../../models/public/Chef')

module.exports = {
    index(req, res) {
        Chef.all(function(chefs) {
            return res.render('public/chefs/index', { chefs })
        })
    }
}