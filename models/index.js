'use strict'

const fs = require('fs'),
      parse = require('csv-parse'),
      mongo = require('../db_config.js').mongoConnect();

exports.pullDataFromCSV = () => {
    return new Promise((resolve, reject) => {

        let headData;
        let csvData = [];
        let custData = [];
        let i = 0;
        let stream = fs.createReadStream('largeFile.csv')
        .pipe(parse({delimiter: ':'}))
        .on('data', function(csvrow) {
            if(i == 0) {
                headData = csvrow[0].split(',');
                console.log(headData);
            }
            else {
                stream.pause();
                var dt = {};
                let csvDt = csvrow[0].split(',');
                headData.forEach((v, i) => {
                    dt[headData[i]] = csvDt[i];
                    if(headData[i] == 'customerId') {
                        var custID = csvDt[i];
                        storeToMongo(dt, custID)
                        .then((resp) => {
                            stream.resume();
                        });
                    }
                });
            }

            // if(i == 500) {
            //     console.log(csvData);
            //
            //     i = 0;
            //     csvData = [];
            //
            // }

            i++;
        })
        .on('end',function() {
            //do something wiht csvData
            // console.log(csvData);
            console.log('File data uploaded successfully');
            resolve("done");
        });

    });
}

let storeToMongo = (dt, custID) => {
    return new Promise((resolve, reject) => {
        let mongoCollection = mongo.collection('Customers');
        mongoCollection.find({"customerId":String(custID)}).toArray((err, records) => {
            if(records[0].customerId) {
                let mongoCollection = mongo.collection('Orders');

                mongoCollection.find({'customerId':dt.customerId, 'item': dt.item}).toArray((err, records) => {
                    if(records) {
                        var prevOrder = records[0];
                        dt.qty = Number(prevOrder.qty) + Number(dt.qty);
                        mongoCollection.update({'customerId': dt.customerId, 'item': dt.item}, {$set: {'qty': dt.qty}}, (err, records) => {
                            resolve({
                                code: 1,
                                msg: "Record updated"
                            })
                        })
                    }
                    else {
                        mongoCollection.insert(dt, function(err, records) {
                            if(err) {
                                resolve({
                                    code: 1,
                                    msg: "record already present"
                                });
                            }
                            else {
                                resolve({
                                    code: 0,
                                    msg: "record insertted successfully"
                                });
                            }
                        });
                    }
                });
            }
            else {
                resolve({
                    code: 1,
                    msg: "customer id not present"
                });
            }
        })
    });
}
