const db = require('../../config/db');
const Base = require('./Base');

Base.init({ table: 'chefs' });

module.exports = {
    ...Base,
    async findAllChefs() {
        const query = `
            SELECT chefs.*, COUNT(recipes) AS total_recipes
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            GROUP BY chefs.id
            ORDER BY chefs.id ASC`
        
        const result = await db.query(query);
        return result.rows;
    }
}