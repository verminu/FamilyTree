const express = require('express');
const getAllUsers = require('./api/user/get-all');
const getAllParents = require('./api/user/get-all-parents');
const getUserRelations = require('./api/relation/get');
const getPossibleParents = require('./api/relation/get-possible-parents');
const addOrUpdateUser = require('./api/user/addUpdate');
const deleteUser = require('./api/user/delete');
const createRelation = require('./api/relation/add');
const deleteRelation = require('./api/relation/delete');
const dbConnection = require('./db/connection');

const router = express.Router();

// every request will require a connection to DB
router.use((req, res, next) => {
    dbConnection.connect((err) => {
        if (err) {
            console.error('Error connecting to DB:', err);
            res.status(500).end();
        } else {
            // store a reference to DB for further usages
            res.locals.db = dbConnection;
            next();
        }
    });
});

router.get('/user', getAllUsers);
router.get('/user/parents', getAllParents);
router.get('/relation/:id', getUserRelations);
router.get('/relation/:id/:parent_id', getPossibleParents);
router.post('/relation', createRelation);
router.delete('/relation/:user_id', deleteRelation);
router.post('/user', addOrUpdateUser);
router.put('/user/:id', addOrUpdateUser);
router.delete('/user/:id', deleteUser);

module.exports = router;