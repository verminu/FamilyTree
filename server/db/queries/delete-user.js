async function deleteUserFromDB(db, userId) {
    const query = 'DELETE FROM users WHERE id = ?';
    await db.promise().query(query, [userId]);
}

module.exports = deleteUserFromDB