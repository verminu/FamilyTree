const {body, validationResult} = require('express-validator');
const addUserToDB = require('../../db/queries/add-user');
const getUserFromDB = require('../../db/queries/get-user');
const updateUserToDB = require("../../db/queries/update-user");
const getChildrenFromDB = require("../../db/queries/get-children");
const getUserByFieldsFromDB = require("../../db/queries/get-user-by-fields");

// Add a user to the database
async function addOrUpdateUser(req, res) {
    const userId = parseInt(req.params?.id);
    const db = res.locals.db;

    let existingUser;

    if (userId) {
        // check if the provided user id exists in the database
        existingUser = await getUserFromDB(db, userId);

        if (!existingUser) {
            return res.status(404).json({error: 'User not found'});
        }
    }

    await Promise.all(userValidationRules().map((rule) => rule.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    const {first_name, middle_name, last_name, gender} = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).json({errors: errors.array()});
    } else {
        // if existingUser exists in DB, perform additional checks
        if (userId) {
            // check if the gender can be changed.
            // a user who is already a parent can't have the gender changed
            const allowGenderUpdate = await checkGenderUpdateInDB(db, existingUser, gender);
            if (!allowGenderUpdate) {
                // set the corresponding error message
                return res.status(422).json({
                    errors: [{
                        location: 'body',
                        msg: "The gender can't be changed because the user is already a parent",
                        path: 'gender',
                        type: 'server'
                    }]
                });
            }
        }
        else {
            // the names must be unique
            const results = await getUserByFieldsFromDB(db, {first_name, middle_name, last_name});
            if (results.length > 0) {
                // set the corresponding error message
                return res.status(422).json({
                    errors: [{
                        location: 'body',
                        msg: "The user already exists",
                        path: 'first_name',
                        type: 'server'
                    }]
                });
            }
        }

    }

    // Add existingUser to the database
    try {
        let result;

        if (userId) {
            await updateUserToDB(db, userId, req.body);
        } else {
            result = await addUserToDB(db, req.body);
        }

        // return the user data
        const userData = {
            id: userId ? userId : result.insertId,
            first_name,
            middle_name,
            last_name,
            gender
        }

        res.status(200).json(userData);
    }
    catch (err) {
        console.error(err);
        res.status(500).end();
    }
}

async function checkGenderUpdateInDB(db, existingUser, gender) {
    if (gender !== existingUser.gender) {
        const children = await getChildrenFromDB(db, existingUser.id)

        return children.length === 0;
    }

    return true;
}

function userValidationRules() {
    return [
        body('first_name')
            .trim()
            .notEmpty().withMessage('First name is required')
            .isLength({max: 100}).withMessage('First name must be 100 characters or less'),

        body('middle_name')
            .trim()
            .optional()
            .isLength({max: 100}).withMessage('Middle name must be 100 characters or less'),

        body('last_name')
            .trim()
            .notEmpty().withMessage('Last name is required')
            .isLength({max: 100}).withMessage('Last name must be 100 characters or less'),

        body('gender')
            .trim()
            .notEmpty().withMessage('Gender should be specified')
            .toInt()
            .isIn([1, 2]).withMessage('Gender unknown'),
    ];
}

module.exports = addOrUpdateUser;