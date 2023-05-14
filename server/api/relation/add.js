const addRelationToDB = require('../../db/queries/add-relation');

async function createRelation(req, res) {
    const db = res.locals.db;

    // userRelations contains pairs of user_id and parent_id
    const userRelations = [];

    if (req.body.mother_id) {
        userRelations.push([req.body.user_id, req.body.mother_id]);
    }
    if (req.body.father_id) {
        userRelations.push([req.body.user_id, req.body.father_id]);
    }

    try {
        await addRelationToDB(db, userRelations);
        res.status(200).end();
    }
    catch (err) {
        console.error(err);
        res.status(500).end();
    }
}

module.exports = createRelation;