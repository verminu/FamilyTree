const getParentSuggestionsFromDB = require("../../db/queries/get-parent-suggestions");
const extractParentSuggestions = require("../../utils/extract-parents");

async function getPossibleParents(req, res) {
    const userId = req.params.id;
    const parentId = req.params.parent_id;
    const db = res.locals.db;

    try {
        const parentSuggestions = await getParentSuggestionsFromDB(db, userId, parentId);

        // group suggestions by mother and father
        const parentSuggestionsObj = extractParentSuggestions(parentSuggestions);

        res.json(parentSuggestionsObj);
    }
    catch (err) {
        console.error(err);
        res.status(500).end();
    }
}

module.exports = getPossibleParents;