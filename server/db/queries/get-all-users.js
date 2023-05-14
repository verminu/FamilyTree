async function getUsersFromDB(db) {
    const [result] = await db.promise().query('SELECT id, first_name, middle_name, last_name, gender from users');

    return result;
}

module.exports = getUsersFromDB;