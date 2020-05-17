const db = require('../../../config/db')

module.exports = {
    all(params, callback) {
        const { filter, limit, offset } = params

        let query = ''
        let filterQuery = ''
        let totalQuery = `(SELECT COUNT(*) FROM recipes) AS total`

        if(filter) {
            filterQuery = `
                WHERE title ILIKE '%${filter}%'`

            totalQuery = `(
                SELECT COUNT(*)
                FROM recipes
                ${filterQuery}
            ) AS total`
        }
        
        query = `
            SELECT recipes.*, chefs.name AS chef_name, ${totalQuery}
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ${filterQuery}
            LIMIT $1 OFFSET $2`

        db.query(query, [limit, offset], function(err, result) {
            if(err)
                throw `DATABASE ERROR!\n${err}`

            return callback(result.rows)
        })
    },
    mostAcessed(callback) {
        const query = `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            LIMIT 6`
        
        db.query(query, function(err, result) {
            if(err)
                throw `DATABASE ERROR!\n${err}`
            
            return callback(result.rows)
        })
    },
    find(id, callback) {
        const query = `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            WHERE recipes.id = ${id}`

        db.query(query, function(err, result) {
            if(err)
                throw `DATABASE ERROR!\n${err}`
            
            return callback(result.rows[0])
        })
    }
}