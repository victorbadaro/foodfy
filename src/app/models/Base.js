const db = require('../../config/db');

function find(filters, table) {
    let query = `SELECT * FROM ${table}`;
    let limit = null;
    let offset = null;

    if(filters)
        Object.keys(filters).forEach(key => {
            if(key != 'limit' && key != 'offset') {
                query += ` ${key}`;
                
                Object.keys(filters[key]).forEach(field => {
                    let values = filters[key][field];

                    if(Array.isArray(values))
                        values = values.map(value => `'${value}'`);
                    else {
                        if(values !== null)
                            values = `'${values}'`;
                        else
                            values = `${values}`;  
                    }
                    
                    query += ` ${field} IN (${values})`;
                });
            }
        });
    
    if(filters.limit)
        limit = filters.limit;
    
    if(filters.offset)
        offset = filters.offset;
    
    query += ` LIMIT ${limit} OFFSET ${offset}`;
    return db.query(query);
}

module.exports = {
    init({ table }) {
        if(!table)
            throw new Error('Invalid params');
        
        this.table = table;
        return this;
    },
    async create(data) {
        const fields = [];
        const values = [];

        Object.keys(data).forEach(field => {
            fields.push(field);
            
            if(Array.isArray(data[field])) {
                const newArray = data[field].map(item => `'${item}'`);
                values.push(`ARRAY[${newArray}]`);
            }
            else {
                if(data[field] !== null)
                    values.push(`'${data[field]}'`);
                else
                    values.push(`${data[field]}`);
            }
        });

        const query = `INSERT INTO ${this.table} (${fields.join(', ')}) VALUES (${values.join(', ')}) RETURNING id`;
        const result = await db.query(query);

        return result.rows[0].id;
    },
    async findOne(filters) {
        const result = await find(filters, this.table);

        return result.rows[0];
    },
    async findAll(filters) {
        const result = await find(filters, this.table);

        return result.rows;
    },
    async update(id, data) {
        const fieldsSQL = [];

        Object.keys(data).forEach(field => {
            if(Array.isArray(data[field])) {
                const newArray = data[field].map(item => `'${item}'`);
                fieldsSQL.push(`${field} = ARRAY[${newArray}]`)
            } else
                fieldsSQL.push(`${field} = '${data[field]}'`)
        });

        const query = `UPDATE ${this.table} SET ${fieldsSQL.join(', ')} WHERE id = ${id} RETURNING id`;
        const result = await db.query(query);

        return result.rows[0].id;
    },
    async delete(id) {
        const query = `DELETE FROM ${this.table} WHERE id = ${id}`;

        await db.query(query);
        return;
    }
}