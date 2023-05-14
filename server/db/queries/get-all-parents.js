async function getParentsByUserFromDB(db) {
    const [result] = await db.promise().query('SELECT user_id, child_of from relation');
    const userParents = {};

    result.forEach((row) => {
        const {user_id, child_of} = row;

        if (!userParents[user_id]) {
            userParents[user_id] = [];
        }

        userParents[user_id].push(child_of);
    });

    return userParents;
}

module.exports = getParentsByUserFromDB;