const db = require('../../../config/db')
const { date } = require('../../../lib/utils')

module.exports = {
    all(callback) {
        const query = `
            SELECT recipes.*, chefs.name AS chef_name
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)`

        db.query(query, function(err, result) {
            if(err)
                throw `DATABASE ERROR!\n${err}`
            
            return callback(result.rows)
        })
    },
    create(data, callback) {
        const query = `
            INSERT INTO recipes (
                chef_id,
                image,
                title,
                ingredients,
                preparation,
                information,
                created_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id`
        const values = [
            data.chef,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            date(Date.now()).isoDate
        ]

        db.query(query, values, function(err, result) {
            if(err)
                throw `DATABASE ERROR!\n${err}`
            
            return callback(result.rows[0])
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
    },
    update(data, callback) {
        const query = `
            UPDATE recipes SET
                chef_id = $1,
                image = $2,
                title = $3,
                ingredients = $4,
                preparation = $5,
                information = $6
            WHERE id = $7
            RETURNING id`
        const values = [
            data.chef,
            data.image,
            data.title,
            data.ingredients,
            data.preparation,
            data.information,
            data.id
        ]

        db.query(query, values, function(err, result) {
            if(err)
                throw `DATABASE ERROR!\n${err}`
            
            return callback(result.rows[0])
        })
    },
    delete(id, callback) {
        const query = `DELETE FROM recipes WHERE id = ${id}`

        db.query(query, function(err) {
            if(err)
                throw `DATABASE ERROR!\n${err}`
            
            return callback()
        })
    },
    getChefs(callback) {
        const query = `SELECT id, name FROM chefs ORDER BY id ASC`

        db.query(query, function(err, result) {
            if(err)
                throw `DATABASE ERROR!\n${err}`
            
            return callback(result.rows)
        })
    }
}