const db = require('../../config/db');
const Base = require('./Base');

Base.init({ table: 'recipes' });

module.exports = {
    ...Base,
    async findRecipes(params) {
        let { limit, offset } = params;
        let filterQuery = ``;

        if(params)
            Object.keys(params).forEach(key => {
                if(key != 'search' && key != 'limit' && key != 'offset') {
                    filterQuery += ` ${key}`;
                    
                    Object.keys(params[key]).forEach(field => {
                        let values = params[key][field];
                        
                        if(Array.isArray(values)) {
                            values = values.map(value => `'${value}'`);
                            filterQuery += ` ${field} IN (${values})`;
                        } else
                            filterQuery += ` ${field} = '${values}'`;
                    })
                } else if(key == 'search' && params[key]) {
                    if(!filterQuery)
                        filterQuery += ` WHERE title ILIKE '%${params[key]}%'`;
                    else
                        filterQuery += ` AND title ILIKE '%${params[key]}%'`;
                }
            });
    
        if(!limit)
            limit = null;
        
        if(!offset)
            offset = null;
        
        const query = `
            SELECT recipes.*, chefs.name AS chef_name, (SELECT COUNT(*) FROM recipes ${filterQuery}) AS total
            FROM recipes
            LEFT JOIN chefs ON (recipes.chef_id = chefs.id)
            ${filterQuery}
            ORDER BY recipes.created_at DESC
            LIMIT ${limit} OFFSET ${offset}`;

        const result = await db.query(query);

        return result.rows;
    },
    async getFiles(params) {
        let { limit } = params

        if(!limit)
            limit = null
        
        const query = `
            SELECT files.*, recipe_files.recipe_id
            FROM files
            INNER JOIN recipe_files ON (files.id = recipe_files.file_id)
            WHERE recipe_files.recipe_id = ${params.recipe_id}
            LIMIT ${limit}`

        const result = await db.query(query)

        if(limit === 1)
            return result.rows[0]
        
        return result.rows
    }
}