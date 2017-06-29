var express  = require('express'),
    mongoose = require('mongoose');

var mongoConnect = function() {
    var dbURI = 'mongodb://localhost:32768/localz';
    var mongobox = mongoose.createConnection(dbURI);

    mongobox.on('connected', function () {
        console.log('MongoDB connection successful');
    });

    return mongobox;
};

module.exports.mongoConnect = mongoConnect;
