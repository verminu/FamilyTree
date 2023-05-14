const getParentsByUserFromDB = require('../../db/queries/get-all-parents.js');

async function getAllParents(req, res) {

    try {
        const parents = await getParentsByUserFromDB(res.locals.db);

        res.status(200).json(parents);
    }
    catch (err) {
        console.error(err);
        return res.status(500).end();
    }
}

module.exports = getAllParents;