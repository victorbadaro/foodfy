const Chef = require('../../models/public/Chef')

module.exports = {
    async index(req, res) {
        const result = await Chef.all()
        const chefs = result.rows

        return res.render('public/chefs/index', { chefs })
    }
}