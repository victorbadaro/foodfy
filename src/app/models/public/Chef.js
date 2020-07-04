const db = require('../../../config/db')

module.exports = {
    all() {
        const query = `
            SELECT chefs.*, files.path AS avatar_url, COUNT(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            LEFT JOIN files ON (chefs.file_id = files.id)
            GROUP BY chefs.id, files.path
            ORDER BY chefs.id ASC`

        return db.query(query)
    }
}