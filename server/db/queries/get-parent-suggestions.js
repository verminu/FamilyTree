const getUsersFromDB = require("./get-all-users");

async function getParentSuggestionsFromDB(db, userId, parentId=null) {
    const [users, relations] = await Promise.all([getUsersFromDB(db), getAllRelationsFromDB(db)]);

    // convert userID to number
    userId = parseInt(userId);
    parentId = parseInt(parentId);

    // if parentId is provided, add it to relations
    if (parentId) {
        relations.push({user_id: userId, child_of: parentId});
    }

    const excludedNodes = getAllConnections(userId, relations);

    // get all user ids
    const allUserIds = users.map(user => user.id);

    // exclude excludedNodes from allUserIds
    const possibleParentsIds = allUserIds.filter(id => !excludedNodes.includes(id));

    // create an array of users from possibleParentsIds
    const possibleParents = users.filter(user => possibleParentsIds.includes(user.id));


    if (parentId) {
        // add spouse(s) to possibleParents at the beginning of list
        const spouses = findSpouses(parentId, relations, users);

        possibleParents.push(...spouses);
    }

    return possibleParents;
}

async function getAllRelationsFromDB(db) {
    const [relations] = await db.promise().query('SELECT * from relation');

    return relations;
}


function getAllConnections(userId, userList) {
    const connections = [];
    const visited = new Set();

    function traverse(currentUserId) {
        visited.add(currentUserId);
        connections.push(currentUserId);

        const parents = userList
            .filter(node => node.user_id === currentUserId)
            .map(node => node.child_of);

        parents.forEach(parent => {
            if (!visited.has(parent)) {
                traverse(parent);
            }
        });

        const children = userList
            .filter(node => node.child_of === currentUserId)
            .map(node => node.user_id);

        children.forEach(child => {
            if (!visited.has(child)) {
                traverse(child);
            }
        });
    }

    traverse(userId);
    return connections;
}

function findSpouses(parentId, relations, users) {
    // Find all the children of the parent
    const children = relations
        .filter(relation => relation.child_of === parentId)
        .map(relation => relation.user_id);

    // Find the other parents of the children
    const spouseIds = relations
        .filter(relation => children.includes(relation.user_id) && relation.child_of !== parentId)
        .map(relation => relation.child_of);

    // Filter the users array to get the spouse objects
    const spouses = users.filter(user => spouseIds.includes(user.id));

    return spouses;
}

module.exports = getParentSuggestionsFromDB;