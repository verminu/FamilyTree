const getUsersFromDB = require('../../db/queries/get-all-users.js');

async function getAllUsers(req, res) {

    try {
        const users = await getUsersFromDB(res.locals.db);

        res.status(200).json(users);
    }
    catch (err) {
        console.error(err);
        return res.status(500).end();
    }
}

module.exports = getAllUsers;