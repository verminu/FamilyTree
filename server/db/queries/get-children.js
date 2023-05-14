async function getChildrenFromDB(db, userId) {
    const query = ` 
        SELECT u.id, u.first_name, u.last_name, u.middle_name, u.gender
        FROM users u JOIN relation r
        ON u.id = r.user_id WHERE r.child_of = ?
    `;

    const [children] = await db.promise().query(query, [userId]);

    return children;
}

module.exports = getChildrenFromDB;