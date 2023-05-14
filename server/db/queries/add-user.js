async function addUserToDB(db, userParams) {
    const { first_name, middle_name, last_name, gender } = userParams;
    const query = 'INSERT INTO users (first_name, middle_name, last_name, gender) VALUES (?, ?, ?, ?)';
    const params = [first_name, middle_name, last_name, gender];

    const [result] = await db.promise().query(query, params);
    return result;
}

module.exports = addUserToDB;