async function getUserFromDB(db, id) {
    const query = 'SELECT * FROM users WHERE id = ?';
    const params = [id];

    const [result] = await db.promise().query(query, params);

    return result?.['0'];
}

module.exports = getUserFromDB;