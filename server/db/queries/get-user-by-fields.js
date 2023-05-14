async function getUserByFieldsFromDB(db, fields) {
    const allowedColumns = new Set(['id', 'first_name', 'middle_name', 'last_name', 'gender']);

    const filteredFields = Object.entries(fields)
        .filter(([field]) => allowedColumns.has(field))
        .reduce((obj, [field, value]) => {
            obj[field] = value;
            return obj;
        }, {});

    const columns = Object.keys(filteredFields);
    const values = Object.values(filteredFields);

    // Construct the SQL query with parameterized placeholders
    const query = `SELECT * FROM users WHERE ${columns.map((column) => `${column} = ?`).join(' AND ')}`;

    const [results] = await db.promise().query(query, values);

    return results;
}

module.exports = getUserByFieldsFromDB;