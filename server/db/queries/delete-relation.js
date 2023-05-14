async function deleteRelationsFromDB(db, userId) {
    const query = 'DELETE FROM relation WHERE user_id = ? OR child_of = ?';
    await db.promise().query(query, [userId, userId]);
}

module.exports = deleteRelationsFromDB;