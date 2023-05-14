async function getParentsFromDB(db, userId) {
    // get all parents of a user
    const query = ` 
        SELECT u.id, u.first_name, u.last_name, u.middle_name, u.gender
        FROM users u JOIN relation r
        ON u.id = r.child_of WHERE r.user_id = ?
    `;

    const [parents] = await db.promise().query(query, [userId]);

    return parents;
}

module.exports = getParentsFromDB;