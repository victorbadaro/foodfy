const db = require('../../../config/db')

module.exports = {
    all(params) {
        const { filter, limit, offset } = params

        let query = ''
        let filterQuery = ''
        let totalQuery = `(SELECT COUNT(*) FROM recipes) AS total`
        let ordination = 'ORDER BY recipes.created_at DESC'

        if(filter) {
            filterQuery = `
                WHERE title ILIKE '%${filter}%'`

            totalQuery = `(
                SELECT COUNT(*)
                FROM recipes
                ${filterQuery}
            ) AS total`

            ordination = 'ORDER BY recipes.updated_at DESC'
        }
        
        query = `
            SELECT recipes.*, chefs.name AS chef_name, ${totalQuery}
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ${filterQuery}
            ${ordination}
            LIMIT $1 OFFSET $2`

        return db.query(query, [limit, offset])
    },
    mostAcessed() {
        const query = `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            LIMIT 6`
        
        return db.query(query)
    },
    find(id) {
        const query = `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = ${id}`

        return db.query(query)
    },
    getFiles(recipe_id) {
        const query = `
            SELECT files.*
            FROM files
            INNER JOIN recipe_files ON (files.id = recipe_files.file_id)
            WHERE recipe_files.recipe_id = $1`

        return db.query(query, [recipe_id])
    }
}