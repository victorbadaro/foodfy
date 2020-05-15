const db = require('../../../config/db')

module.exports = {
    all(callback) {
        const query = `SELECT * FROM recipes`
        db.query(query, function(err, result) {
            if(err)
                throw `DATABASE ERROR!\n${err}`

            return callback(result.rows)
        })
    }
}