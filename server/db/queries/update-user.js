async function updateUserToDB(db, userId, userParams) {
    const { first_name, middle_name, last_name, gender } = userParams;

    const query = `UPDATE users
        SET first_name = ?, middle_name = ?, last_name = ?, gender = ?
        WHERE id = ?;`;
    const params = [first_name, middle_name, last_name, gender, userId];

    await db.promise().query(query, params);
}

module.exports = updateUserToDB;