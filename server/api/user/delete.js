const deleteUserFromDB = require('../../db/queries/delete-user');
const deleteRelationFromDB = require('../../db/queries/delete-relation');

async function deleteUser(req, res) {
    const db = res.locals.db;
    const userId = req.params.id;

    try {
        // remove user from the database
        await Promise.all([deleteUserFromDB(db, userId), deleteRelationFromDB(db, userId)]);

        res.status(200).end();
    }
    catch (err) {
        console.error(err);
        res.status(500).end();
    }
}

module.exports = deleteUser;