const db = require('../../../config/db')

module.exports = {
    all(callback) {
        const query = `
            SELECT chefs.*, COUNT(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            GROUP BY chefs.id`

        db.query(query, function(err, result) {
            if(err)
                throw `DATABASE ERROR!\n${err}`
            
            return callback(result.rows)
        })
    }
}