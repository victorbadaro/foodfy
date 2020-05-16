const db = require('../../../config/db')
const { date } = require('../../../lib/utils')

module.exports = {
    all(callback) {
        const query = `SELECT * FROM chefs ORDER BY id ASC`

        db.query(query, function(err, result) {
            if(err)
                throw `DATABASE ERROR!\n${err}`
            
            return callback(result.rows)
        })
    },
    create(data, callback) {
        const query = `
            INSERT INTO chefs(
                name,
                avatar_url,
                created_at
            ) VALUES($1, $2, $3)
            RETURNING id`
        const values = [
            data.name,
            data.avatar_url,
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
            SELECT chefs.*, count(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (recipes.chef_id = chefs.id)
            GROUP BY chefs.id
            WHERE chefs.id = ${id}`
        
        db.query(query, function(err, result) {
            if(err)
                throw `DATABASE ERROR!\n${err}`
            
            return callback(result.rows[0])
        })
    },
    update(data, callback) {
        const query = `
            UPDATE chefs SET
                name = $1,
                avatar_url = $2
            WHERE id = $3
            RETURNING id`
        const values = [
            data.name,
            data.avatar_url,
            data.id
        ]

        db.query(query, values, function(err, result) {
            if(err)
                throw `DATABASE ERROR!\n${err}`
            
            return callback(result.rows[0])
        })
    },
    delete(id, callback) {
        const query = `DELETE FROM chefs WHERE id = ${id}`

        db.query(query, function(err) {
            if(err)
                throw `DATABASE ERROR!\n${err}`
            
            return callback()
        })
    }
}