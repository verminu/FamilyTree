const getParentsFromDB = require('../../db/queries/get-parents.js');
const getChildrenFromDB = require('../../db/queries/get-children.js');
const getParentSuggestionsFromDB = require('../../db/queries/get-parent-suggestions.js');
const extractParentSuggestions = require("../../utils/extract-parents");

async function getUserRelations(req, res) {
    const userId = req.params.id;
    const db = res.locals.db;

    let parentSuggestionsObj;
    try {
        const parents = await getParentsFromDB(db, userId);
        const children = await getChildrenFromDB(db, userId);

        let relationObj = extractParents(parents);
        relationObj.children = children;

        // if the user doesn't have a parent, return suggestions
        if (!relationObj.mother || !relationObj.father) {
            const parentSuggestions = await getParentSuggestionsFromDB(db, userId);

            // extract mother and father suggestions
            parentSuggestionsObj = extractParentSuggestions(parentSuggestions);

            // add suggestions to parentsObj
            relationObj = {...relationObj, ...parentSuggestionsObj};
        }

        res.json(relationObj);
    }
    catch (err) {
        console.error(err);
        res.status(500).end();
    }
}

function extractParents(parentsArray) {
    // convert parents array into an object having mother and father properties
    const parentsObj = {};
    parentsArray.forEach((parent) => {
        if (parent.gender === 1) {
            parentsObj.father = parent;
        }
        else {
            parentsObj.mother = parent;
        }
    });

    return parentsObj;
}

module.exports = getUserRelations;