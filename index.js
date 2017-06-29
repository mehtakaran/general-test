// 'use strict';
var express           = require('express'),
        app           = express(),
        server        = require('http').createServer(app),
        router        = express.Router(),
        routes        = require('./routes'),
        path          = require('path'),
        fs            = require('fs'),
        cluster       = require('cluster'),
        numCPUs       = require('os').cpus().length;


    let orders = require('./models/index.js');

    app.get('/storeData', (req, res) => {
        orders.pullDataFromCSV()
        .then((done) => {
            res.json(done);
        })
    });

    app.listen(3002);
