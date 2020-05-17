const db = require('../../../config/db')

module.exports = {
    all(filter, callback) {
        let query = `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)`
        let filterQuery = ''

        if(filter)
            filterQuery = `
                WHERE title ILIKE '%${filter}%'`
        
        query = `
            ${query}
            ${filterQuery}`

        db.query(query, function(err, result) {
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