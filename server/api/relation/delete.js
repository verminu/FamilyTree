const deleteRelationsFromDB = require('../../db/queries/delete-relation');

async function deleteRelation(req, res) {
    const db = res.locals.db;
    const userId = req.params.user_id;

    // remove relation(s) from the database
    try {
        await deleteRelationsFromDB(db, userId);

        res.status(200).end();
    }
    catch (err) {
        console.error(err);
        res.status(500).end();
    }
}

module.exports = deleteRelation;