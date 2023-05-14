async function addRelationToDB(db, userRelations) {
    const query = 'INSERT INTO relation (user_id, child_of) VALUES ?';

    const [result] = await db.promise().query(query, [userRelations]);
    return result;
}

module.exports = addRelationToDB;