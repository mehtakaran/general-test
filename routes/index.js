'use strict'

var router = require('express').Router();

var exportData = require('../models');
console.log(exportData);

router.get('/', (req, res) => {
    exportData.pullDataFromCSV()
    .then((done) => {
        res.json(done);
    });
});

module.exports = router;
